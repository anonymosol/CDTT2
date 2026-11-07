import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { api, type Filters } from '../api/client';
import { useResource } from '../hooks/useResource';
import { EmptyState, ErrorState, GameCard, Loading } from '../components/ui';

const genreOptions = [
  'Tất cả',
  'Hợp tác',
  'Gia đình',
  'Chiến thuật',
  'Tiệc nhóm',
  'Suy luận',
  'Nhẹ nhàng',
  'Sáng tạo',
];
function numeric(value: string | null, max = Infinity) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= max ? parsed : undefined;
}
export function Discover() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(
    () => window.matchMedia('(min-width: 521px)').matches,
  );
  const [draft, setDraft] = useState({ q: '', players: '', time: '', weight: '' });
  const page = Math.floor(numeric(params.get('page')) ?? 1);
  const genre = params.get('genre') || '';
  const sort = (
    ['featured', 'name', 'duration'].includes(params.get('sort') || '')
      ? params.get('sort')
      : 'featured'
  ) as Filters['sort'];
  const filters: Filters = {
    q: params.get('q') || undefined,
    players: numeric(params.get('players'), 20),
    time: numeric(params.get('time')),
    weight: numeric(params.get('weight'), 5),
    genre: genre || undefined,
    page,
    sort,
  };
  const resource = useResource((signal) => api.games(filters, signal), params.toString());
  useEffect(() => {
    setDraft({
      q: params.get('q') || '',
      players: params.get('players') || '',
      time: params.get('time') || '',
      weight: params.get('weight') || '',
    });
  }, [params]);
  function apply(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(draft)) {
      if (value.trim()) next.set(key, value.trim());
      else next.delete(key);
    }
    next.delete('page');
    setParams(next);
  }
  function changeParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  }
  const filtered = ['q', 'players', 'time', 'weight', 'genre'].some((key) => params.has(key));
  const totalPages =
    resource.data?.total !== null && resource.data?.total !== undefined
      ? Math.max(1, Math.ceil(resource.data.total / resource.data.pageSize))
      : undefined;
  function goPage(value: number) {
    const next = new URLSearchParams(params);
    next.set('page', String(value));
    setParams(next);
    document.getElementById('collection-heading')?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <div className="discover-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span>✳</span> ĐẶT ĐIỆN THOẠI XUỐNG. MỞ MỘT HỘP GAME.
          </span>
          <h1>
            Tối nay,
            <br />
            mình <em>chơi gì?</em>
          </h1>
          <p>
            Một chút chiến thuật, một tràng cười.
            <br />
            Tìm boardgame hợp gu cho những người bạn yêu quý.
          </p>
          <Link className="button primary" to="/recommend">
            <Sparkles size={17} />
            Tìm game cho buổi chơi
            <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">Có người mới? Chúng mình bắt đầu thật dễ.</span>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-arch" />
          <img className="hero-box box-back" src="/games/vuon-ky-uc.svg" alt="" />
          <img className="hero-box box-front" src="/games/dao-may.svg" alt="" />
          <span className="hero-orbit">
            CÙNG NHAU
            <br />
            <span>✳</span>
            <br />
            VUI HƠN
          </span>
          <div className="wood-die">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="hero-spark spark-one">✦</span>
          <span className="hero-spark spark-two">✧</span>
          <span className="hero-doodle">một ván nữa nhé!</span>
        </div>
      </section>
      <section className="collection" aria-labelledby="collection-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MỖI HỘP GAME, MỘT THẾ GIỚI</span>
            <h2 id="collection-heading">
              Khám phá bộ sưu tập{' '}
              <span className="collection-count">{resource.data?.total ?? '…'}</span>
            </h2>
          </div>
          <button
            className={`button filter-toggle ${showFilters ? 'active' : ''}`}
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            Bộ lọc
          </button>
        </div>
        <form className={`filter-bar ${showFilters ? 'expanded' : ''}`} onSubmit={apply}>
          <div className="filter-search">
            <Search size={17} />
            <input
              aria-label="Tên boardgame"
              placeholder="Bạn đang tìm game nào?"
              value={draft.q}
              maxLength={100}
              onChange={(event) => setDraft({ ...draft, q: event.target.value })}
            />
          </div>
          <label>
            Số người
            <select
              aria-label="Số người"
              value={draft.players}
              onChange={(event) => setDraft({ ...draft, players: event.target.value })}
            >
              <option value="">Bất kỳ</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} người
                </option>
              ))}
            </select>
          </label>
          <label>
            Thời gian
            <select
              aria-label="Thời gian"
              value={draft.time}
              onChange={(event) => setDraft({ ...draft, time: event.target.value })}
            >
              <option value="">Bất kỳ</option>
              {[20, 30, 45, 60, 90].map((n) => (
                <option key={n} value={n}>
                  Tối đa {n} phút
                </option>
              ))}
            </select>
          </label>
          <label>
            Độ khó
            <select
              aria-label="Độ khó"
              value={draft.weight}
              onChange={(event) => setDraft({ ...draft, weight: event.target.value })}
            >
              <option value="">Bất kỳ</option>
              <option value="2">Dễ làm quen</option>
              <option value="3">Vừa sức trở xuống</option>
              <option value="5">Tất cả mức độ</option>
            </select>
          </label>
          <button className="button primary filter-apply" type="submit">
            Áp dụng
          </button>
        </form>
        <div className="collection-toolbar">
          <div className="genre-tabs" role="group" aria-label="Lọc thể loại">
            {genreOptions.map((option, index) => (
              <button
                key={option}
                className={(index === 0 ? !genre : genre === option) ? 'selected' : ''}
                aria-pressed={index === 0 ? !genre : genre === option}
                onClick={() => changeParam('genre', index ? option : '')}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="sort-label">
            Sắp xếp:
            <select
              aria-label="Sắp xếp game"
              value={sort}
              onChange={(event) => changeParam('sort', event.target.value)}
            >
              <option value="featured">Đề xuất</option>
              <option value="name">Tên A–Z</option>
              <option value="duration">Thời gian tăng dần</option>
            </select>
          </label>
        </div>
        {filtered && (
          <div className="active-filters">
            <span>Đang lọc theo lựa chọn của bạn</span>
            <button className="text-button" onClick={() => setParams({})}>
              <X size={13} />
              Xóa bộ lọc
            </button>
          </div>
        )}
        {resource.loading ? (
          <Loading />
        ) : resource.error ? (
          <ErrorState message={resource.error} retry={resource.reload} />
        ) : resource.data?.items.length ? (
          <>
            <div className="game-grid">
              {resource.data.items.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            <div className="pagination">
              <span>
                {resource.data.total === null
                  ? 'Kết quả khám phá'
                  : `${resource.data.total} game phù hợp`}{' '}
                · Trang {page}
                {totalPages ? ` / ${totalPages}` : ''}
              </span>
              <div>
                <button
                  className="icon-button"
                  aria-label="Trang trước"
                  disabled={page <= 1}
                  onClick={() => goPage(page - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="page-number">{page}</span>
                <button
                  className="icon-button"
                  aria-label="Trang sau"
                  disabled={
                    totalPages !== undefined
                      ? page >= totalPages
                      : resource.data.items.length < resource.data.pageSize
                  }
                  onClick={() => goPage(page + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title={page > 1 ? 'Trang này chưa có game' : 'Chưa tìm thấy game phù hợp'}
            description="Thử đổi thời gian, số người hoặc khám phá một thể loại khác nhé."
          >
            <button className="button secondary" onClick={() => setParams({})}>
              Xem tất cả game
            </button>
          </EmptyState>
        )}
      </section>
      <section className="bottom-invite">
        <span className="invite-symbol">✳</span>
        <div>
          <h3>Game hay là game có người cùng chơi.</h3>
          <p>Chọn một chiếc hộp. Rủ thêm vài người bạn. Phần còn lại là kỷ niệm.</p>
        </div>
        <Link to="/library">
          Ghé kệ game của bạn <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
