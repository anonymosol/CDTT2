#!/usr/bin/env python3
"""Sinh frontend/src/mocks/data.json từ data/ của repo.

Dùng khi bộ luật / kho game thay đổi:
    python3 frontend/src/mocks/generate.py
Yêu cầu data/games.csv, data/rules/ tồn tại (nhánh dữ liệu đã merge).

Heuristic tagging checklist theo số người: bullet có đúng MỘT số duy nhất
đứng trước "người" mới được gán players; còn lại áp dụng cho mọi số người
(players = null) — không bịa thêm dữ kiện không có trong tài liệu.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / 'data'
OUT = Path(__file__).resolve().parent / 'data.json'


def strip_md(s: str) -> str:
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'`(.+?)`', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip()


def merge_lines(lines: list[str]) -> list[dict]:
    """Gộp dòng xuống dòng của bullet/đoạn văn: dòng thụt lề nối vào mục trước."""
    items: list[dict] = []
    for raw in lines:
        if not raw.strip():
            continue
        stripped = raw.strip()
        if stripped.startswith('- '):
            items.append({'type': 'bullet', 'text': stripped[2:]})
        elif raw.startswith('  ') and items:
            items[-1]['text'] += ' ' + stripped
        else:
            items.append({'type': 'para', 'text': stripped})
    return items


def parse_rule_doc(path: Path):
    lines = path.read_text(encoding='utf-8').splitlines()
    title = lines[0].lstrip('# ').strip()
    sections, cur, sub = [], None, None

    def clean(ls):
        while ls and not ls[0].strip():
            ls.pop(0)
        while ls and not ls[-1].strip():
            ls.pop()
        return ls

    for line in lines[1:]:
        m = re.match(r'^## (\d+)\. (.+)$', line)
        m2 = re.match(r'^### (\d+(?:\.\d+)*)\s+(.+)$', line)
        if m:
            cur = {'num': m.group(1), 'title': m.group(2).strip(), 'body': [], 'subs': []}
            sections.append(cur)
            sub = None
        elif m2 and cur:
            sub = {'num': m2.group(1), 'title': m2.group(2).strip(), 'body': []}
            cur['subs'].append(sub)
        elif line.startswith('> '):
            continue
        elif cur is not None:
            (sub if sub is not None else cur)['body'].append(line)
    for s in sections:
        s['body'] = clean(s['body'])
        for sb in s['subs']:
            sb['body'] = clean(sb['body'])
    return {'title': title, 'sections': sections}


def block_of(sec: dict) -> dict:
    items = merge_lines(sec['body'])
    for sb in sec.get('subs', []):
        items += merge_lines(sb['body'])
    return {
        'num': sec['num'],
        'title': sec['title'],
        'paragraphs': [strip_md(i['text']) for i in items if i['type'] == 'para'],
        'bullets': [strip_md(i['text']) for i in items if i['type'] == 'bullet'],
    }


def build_learn(doc: dict):
    by_num = {s['num']: s for s in doc['sections']}
    summary5 = [block_of(by_num[n]) for n in ('1', '2', '3') if n in by_num]

    checklist = []
    s3 = by_num.get('3')
    if s3:
        lines = list(s3['body'])
        for sb in s3.get('subs', []):
            lines += sb['body']
        for item in merge_lines(lines):
            if item['type'] != 'bullet':
                continue
            text = strip_md(item['text'])
            counts = {m.group(1) for m in re.finditer(r'(\d+)\s*người', item['text'])}
            players = int(counts.pop()) if len(counts) == 1 else None
            checklist.append({'text': text, 'players': players})

    glossary = []
    s6 = by_num.get('6')
    if s6:
        for item in merge_lines(s6['body']):
            if item['type'] != 'bullet':
                continue
            m = re.match(r'\*\*(.+?)\*\*:?\s*(.*)', item['text'])
            if m:
                glossary.append({'term': m.group(1).strip(), 'definition': strip_md(m.group(2))})
    return {'summary5': summary5, 'checklist': checklist, 'glossary': glossary}


def main():
    games = []
    with open(DATA / 'games.csv', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            games.append({
                'id': r['id'],
                'name': r['name'],
                'minPlayers': int(r['players_min']),
                'maxPlayers': int(r['players_max']),
                'durationMin': int(r['play_time_min']),
                'durationMax': int(r['play_time_max']),
                'weight': float(r['weight']),
                'genres': r['genres'].split(';'),
                'description': r['description'],
                'sourceUrl': r['source_url'],
                'hasRules': (DATA / 'rules' / f"{r['id']}.md").exists(),
            })
    rules, learn = {}, {}
    for gp in sorted((DATA / 'rules').glob('*.md')):
        doc = parse_rule_doc(gp)
        rules[gp.stem] = doc
        learn[gp.stem] = build_learn(doc)
    questions = [
        {'id': q['id'], 'game': q['game'], 'type': q['type'], 'question': q['question']}
        for q in json.loads((ROOT / 'eval' / 'questions.json').read_text(encoding='utf-8'))
    ]
    payload = {'games': games, 'rules': rules, 'learn': learn, 'seedQuestions': questions}
    OUT.write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')
    print(f"OK: {len(games)} games, {len(rules)} rule docs, {len(questions)} seed questions -> {OUT.name} ({OUT.stat().st_size // 1024}KB)")


if __name__ == '__main__':
    main()
