import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, BookmarkPlus, Check, Compass, Users } from 'lucide-react';
import { api } from '../api/client';
import { useResource } from '../hooks/useResource';
import { useApp } from '../store/AppProvider';
import { ErrorState, GameCover, GameMeta, Loading } from '../components/ui';
import { ShelfEditor } from '../components/ShelfEditor';
import { shelfLabels, type ShelfFlag } from '../api/models';

export function Detail() {
  const { gameId = '' } = useParams();
  const resource = useResource((signal) => api.game(gameId, signal), gameId);
  const [editing, setEditing] = useState(false);
  const { records, sessionLoading, shelfLoading, notice } = useApp();
  const record = records.find((item) => item.gameId === gameId);
  if (resource.loading) return <Loading label="Đang mở chiếc hộp…" />;
  if (resource.error || !resource.data)
    return (
      <div className="content-page">
        <Link className="back-link" to="/games">
          <ArrowLeft size={16} />
          Về bộ sưu tập
        </Link>
        <ErrorState message={resource.error || 'Không tìm thấy game.'} retry={resource.reload} />
      </div>
    );
  const game = resource.data;
  return (
    <div className="content-page">
      <Link className="back-link" to="/games">
        <ArrowLeft size={16} />
        Về bộ sưu tập
      </Link>
      <div className="detail-grid">
        <GameCover game={game} className="detail-cover" />
        <section className="detail-copy">
          <span className="eyebrow">{game.genres?.join(' · ') || 'KHÁM PHÁ BOARDGAME'}</span>
          <h1>{game.name}</h1>
          <p className="detail-tagline">{game.tagline}</p>
          <GameMeta game={game} />
          <p className="detail-description">
            {game.description || 'Thông tin chi tiết đang được bổ sung.'}
          </p>
          <div className="detail-facts">
            <div>
              <Users size={18} />
              <span>Độ tuổi</span>
              <strong>{game.minAge !== undefined ? `${game.minAge}+` : 'Chưa có'}</strong>
            </div>
            <div>
              <Compass size={18} />
              <span>Độ khó</span>
              <strong>{game.weight !== undefined ? `${game.weight} / 5` : 'Chưa có'}</strong>
            </div>
          </div>
          {game.mechanics?.length ? (
            <div className="mechanics">
              <span>Cơ chế chơi</span>
              {game.mechanics.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          <div className="detail-actions">
            <button
              className="button primary"
              disabled={sessionLoading || shelfLoading || !!notice}
              onClick={() => setEditing(true)}
            >
              <BookmarkPlus size={18} />
              Lưu & chấm điểm
            </button>
          </div>
          {record && (
            <div className="saved-labels">
              {(Object.keys(shelfLabels) as ShelfFlag[])
                .filter((flag) => record[flag])
                .map((flag) => (
                  <span key={flag}>
                    <Check size={13} />
                    {shelfLabels[flag]}
                  </span>
                ))}
              {record.rating !== null && <span>★ {record.rating}/5</span>}
            </div>
          )}
          <p className="small muted">
            Lưu điều bạn muốn thử hôm nay, để buổi chơi sau dễ chọn hơn.
          </p>
        </section>
      </div>
      {editing && <ShelfEditor game={game} close={() => setEditing(false)} />}
    </div>
  );
}
