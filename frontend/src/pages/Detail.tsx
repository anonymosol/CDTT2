import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, BookOpen, BookmarkPlus, Check, Compass, Users } from 'lucide-react';
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
            {game.hasRules && (
              <Link className="button secondary" to={`/games/${game.id}/learn`}>
                <BookOpen size={17} />
                Làm quen luật
                <ArrowRight size={16} />
              </Link>
            )}
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
      <div className="detail-bottom">
        <BookOpen size={24} />
        <div>
          <h2>Một chiếc hộp, một cách kết nối</h2>
          <p>
            {game.hasRules
              ? 'Đọc phần làm quen luật trước khi chơi. Luôn kiểm tra đúng phiên bản tài liệu của game.'
              : 'Tài liệu luật đã duyệt đang được bổ sung. Bạn vẫn có thể lưu game vào kệ.'}
          </p>
        </div>
      </div>
      {editing && <ShelfEditor game={game} close={() => setEditing(false)} />}
    </div>
  );
}

export function Learn() {
  const { gameId = '' } = useParams();
  const resource = useResource((signal) => api.learn(gameId, signal), gameId);
  return (
    <div className="content-page reading-page">
      <Link className="back-link" to={`/games/${gameId}`}>
        <ArrowLeft size={16} />
        Về chi tiết game
      </Link>
      {resource.loading ? (
        <Loading label="Đang mở hướng dẫn…" />
      ) : resource.error || !resource.data ? (
        <ErrorState message={resource.error || 'Chưa có tài liệu.'} retry={resource.reload} />
      ) : (
        <>
          <span className="eyebrow">CÙNG BẮT ĐẦU MỘT VÁN CHƠI</span>
          <h1>{resource.data.title}</h1>
          <p className="source-note">Nguồn: {resource.data.source}</p>
          <section className="reading-card">
            <h2>Chuẩn bị bàn chơi</h2>
            <ul className="setup-list">
              {resource.data.setup.map((item, index) => (
                <li key={item}>
                  <span>{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          {resource.data.sections.map((section) => (
            <section className="reading-card" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
