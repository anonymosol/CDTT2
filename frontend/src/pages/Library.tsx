import { useState } from 'react';
import { Link } from 'react-router';
import { BookmarkPlus, Heart, Pencil, Star } from 'lucide-react';
import { api } from '../api/client';
import { isActiveRecord, shelfLabels, type Game, type ShelfFlag } from '../api/models';
import { useApp } from '../store/AppProvider';
import { useResource } from '../hooks/useResource';
import {
  EmptyState,
  ErrorState,
  ExploreLink,
  GameCard,
  InlineNotice,
  Loading,
  PageIntro,
} from '../components/ui';
import { ShelfEditor } from '../components/ShelfEditor';

export function Library() {
  const { records, user, shelfLoading, sessionLoading, notice } = useApp();
  const [filter, setFilter] = useState<ShelfFlag | 'all'>('all');
  const [editing, setEditing] = useState<Game>();
  const active = records.filter(isActiveRecord);
  const key = active
    .map((item) => item.gameId)
    .sort()
    .join(',');
  const resource = useResource(async (signal) => {
    const results = await Promise.allSettled(
      active.map((record) => api.game(record.gameId, signal)),
    );
    return {
      games: results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])),
      missing: results.filter((result) => result.status === 'rejected').length,
    };
  }, key);
  const visible = resource.data?.games.filter(
    (game) => filter === 'all' || records.find((record) => record.gameId === game.id)?.[filter],
  );
  return (
    <div className="content-page">
      <PageIntro eyebrow="NHỮNG CHIẾC HỘP CỦA RIÊNG BẠN" title="Kệ game của tôi">
        <p>
          Một góc nhỏ cho những game đã chơi,
          <br />
          những điều yêu thích và những ván chơi sắp tới.
        </p>
      </PageIntro>
      {!user && (
        <InlineNotice>
          Kệ khách được lưu trên trình duyệt này. <Link to="/login">Đăng nhập</Link> để gộp vào tài
          khoản khi dịch vụ tài khoản sẵn sàng.
        </InlineNotice>
      )}
      <div className="shelf-stats">
        <div>
          <span className="stat-icon">
            <BookmarkPlus size={21} />
          </span>
          <strong>{active.length}</strong>
          <span>game trên kệ</span>
        </div>
        <div>
          <span className="stat-icon">
            <Heart size={21} />
          </span>
          <strong>{records.filter((record) => record.wishlist).length}</strong>
          <span>game muốn thử</span>
        </div>
        <div>
          <span className="stat-icon">
            <Star size={21} />
          </span>
          <strong>{records.filter((record) => record.played).length}</strong>
          <span>game đã chơi</span>
        </div>
      </div>
      <div className="shelf-tabs" role="group" aria-label="Lọc kệ game">
        <button
          className={filter === 'all' ? 'selected' : ''}
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Tất cả <span>{active.length}</span>
        </button>
        {(Object.keys(shelfLabels) as ShelfFlag[]).map((flag) => (
          <button
            key={flag}
            className={filter === flag ? 'selected' : ''}
            aria-pressed={filter === flag}
            onClick={() => setFilter(flag)}
          >
            {shelfLabels[flag]} <span>{records.filter((record) => record[flag]).length}</span>
          </button>
        ))}
      </div>
      {sessionLoading || shelfLoading || resource.loading ? (
        <Loading label="Đang sắp lại kệ game…" />
      ) : resource.error || notice ? (
        <ErrorState message={resource.error || notice} retry={resource.reload} />
      ) : active.length === 0 ? (
        <EmptyState
          title="Kệ game đang chờ chiếc hộp đầu tiên"
          description="Nhấn trái tim trên một game bạn thích, hoặc lưu những game đã từng chơi."
        >
          <ExploreLink />
        </EmptyState>
      ) : (
        <>
          {!!resource.data?.missing && (
            <p className="field-error" role="alert">
              {resource.data.missing} game chưa tải được. Dữ liệu lưu vẫn được giữ.
              <button className="text-button" onClick={resource.reload}>
                Thử lại
              </button>
            </p>
          )}
          {visible?.length ? (
            <div className="game-grid">
              {visible.map((game) => {
                const record = records.find((item) => item.gameId === game.id)!;
                return (
                  <div className="library-item" key={game.id}>
                    <GameCard game={game} />
                    <div className="library-item-footer">
                      <div>
                        {record.rating !== null ? (
                          <span className="shelf-rating">★ {record.rating}/5</span>
                        ) : (
                          <span className="muted small">Chưa chấm điểm</span>
                        )}
                        {record.notes && <p>{record.notes}</p>}
                      </div>
                      <button
                        className="icon-button"
                        aria-label={`Chỉnh sửa ${game.name}`}
                        onClick={() => setEditing(game)}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Chưa có game trong nhóm này"
              description="Bạn có thể thay đổi nhãn và chấm điểm từ trang chi tiết hoặc nút chỉnh sửa trên kệ."
            >
              <button className="button secondary" onClick={() => setFilter('all')}>
                Xem toàn bộ kệ
              </button>
            </EmptyState>
          )}
        </>
      )}
      {editing && <ShelfEditor game={editing} close={() => setEditing(undefined)} />}
    </div>
  );
}
