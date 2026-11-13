import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Lightbulb, Send, Sparkles } from 'lucide-react';
import { api, errorMessage } from '../api/client';
import { isDemo, type Recommendations } from '../api/models';
import { useApp } from '../store/AppProvider';
import { EmptyState, ErrorState, GameCard, Loading, PageIntro } from '../components/ui';

const examples = [
  '4 người, 30 phút, thích hợp tác',
  'Game dễ chơi cho gia đình',
  '6 người, tối đa 30 phút, tiệc nhóm',
];
export function Recommend() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [excludePlayed, setExcludePlayed] = useState(true);
  const [result, setResult] = useState<Recommendations>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { records } = useApp();
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function submit(event?: FormEvent) {
    event?.preventDefault();
    if (loading) return;
    if (query.trim().length < 3 || query.trim().length > 1000) {
      setError('Hãy mô tả nhu cầu từ 3 đến 1.000 ký tự.');
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    setResult(undefined);
    setSubmitted(query.trim());
    try {
      const response = await api.recommend(
        query.trim(),
        records
          .filter((record) => record.disliked || (excludePlayed && record.played))
          .map((record) => record.gameId),
        controller.signal,
      );
      if (!controller.signal.aborted) setResult(response);
    } catch (error) {
      if (!controller.signal.aborted) setError(errorMessage(error));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  return (
    <div className="content-page">
      <PageIntro eyebrow="MỘT BUỔI CHƠI ĐÚNG GU" title="Kể mình nghe, bạn muốn chơi gì?">
        <p>
          Số người, thời gian, một chút sở thích.
          <br />
          Cùng tìm chiếc hộp phù hợp cho hôm nay.
        </p>
      </PageIntro>
      <div className="recommend-form-card">
        <div className="assistant-label">
          <span className="assistant-icon">
            <Sparkles size={21} />
          </span>
          <div>
            <strong>Bạn kể, mình gợi ý</strong>
            <p>Mỗi lượt gửi là một yêu cầu độc lập.</p>
          </div>
        </div>
        <form onSubmit={(event) => void submit(event)}>
          <label className="sr-only" htmlFor="recommend-query">
            Mô tả buổi chơi
          </label>
          <textarea
            id="recommend-query"
            placeholder="Ví dụ: Tụi mình có 4 người, khoảng 45 phút, có người mới và thích chơi hợp tác…"
            value={query}
            maxLength={1000}
            rows={4}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="composer-bottom">
            <span>{query.length}/1.000</span>
            <button
              className="button primary"
              type="submit"
              disabled={loading || query.trim().length < 3}
            >
              {loading ? 'Đang tìm game…' : 'Tìm game phù hợp'}
              <Send size={16} />
            </button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={excludePlayed}
              onChange={(event) => setExcludePlayed(event.target.checked)}
            />
            Ẩn game đã chơi; luôn loại game đã đánh dấu không thích
          </label>
        </form>
        <div className="example-chips">
          <span>Thử một ý tưởng:</span>
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => {
                setQuery(example);
                document.getElementById('recommend-query')?.focus();
              }}
            >
              {example}
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      </div>
      {isDemo && (
        <p className="demo-explanation">
          <Lightbulb size={16} />
          Gợi ý trải nghiệm được lọc từ game mẫu theo từ khóa; chưa gọi LLM thật.
        </p>
      )}
      {loading ? (
        <Loading label="Đang tìm những chiếc hộp hợp với buổi chơi…" />
      ) : error ? (
        <ErrorState message={error} retry={() => void submit()} />
      ) : result ? (
        <section className="recommend-results" aria-live="polite">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DÀNH CHO BUỔI CHƠI CỦA BẠN</span>
              <h2>
                {result.items.length ? 'Những lựa chọn đáng thử' : 'Mình thử đổi điều kiện nhé?'}
              </h2>
              <p className="muted">{result.interpretation}</p>
            </div>
            <span className="result-mode">
              {result.mode === 'demo' ? 'Gợi ý mẫu' : 'Gợi ý từ dịch vụ'}
            </span>
          </div>
          <p className="submitted-query">“{submitted}”</p>
          {result.items.length ? (
            <div className="game-grid">
              {result.items.map((item) => (
                <GameCard key={item.game.id} game={item.game} reason={item.reason} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có game đáp ứng đủ điều kiện"
              description="Thử thêm thời gian hoặc thay thể loại. Mình sẽ giữ đúng những điều kiện bạn đưa ra."
            />
          )}
        </section>
      ) : (
        <div className="recommend-tip">
          <Lightbulb size={22} />
          <div>
            <h3>Một chút cụ thể, một gợi ý tốt hơn</h3>
            <p>
              Cho biết số người và thời gian trước, rồi thêm thể loại bạn thích. Bạn cũng có thể
              đánh dấu game không thích trong kệ để loại khỏi kết quả.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
