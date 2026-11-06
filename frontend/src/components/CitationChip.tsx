import { useState } from 'react';
import type { Citation } from '../api/types';

interface Props {
  citation: Citation;
  gameName?: string;
}

/** Chip trích dẫn: nhãn "Mục N · Tiêu đề", bấm để bung đoạn trích gốc. */
export default function CitationChip({ citation, gameName }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="cursor-pointer rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200"
      >
        {gameName ? `${gameName} · ` : ''}Mục {citation.section} · {citation.title}
      </button>
      {open && (
        <span className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600">
          {citation.snippet || '(đoạn trích trống)'}
        </span>
      )}
    </span>
  );
}
