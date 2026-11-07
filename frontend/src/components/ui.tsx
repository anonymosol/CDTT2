import { useEffect, useRef, type ReactNode } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Dice5,
  Heart,
  LoaderCircle,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import { errorMessage } from '../api/client';
import { useApp } from '../store/AppProvider';
import { useState } from 'react';
import type { Game } from '../api/models';

export function Loading({ label = 'Đang tìm những lựa chọn dành cho bạn…' }: { label?: string }) {
  return (
    <div className="state-box" role="status">
      <LoaderCircle className="spin" size={27} />
      <p>{label}</p>
    </div>
  );
}
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="state-box error-state" role="alert">
      <AlertCircle size={29} />
      <h2>Có một chút gián đoạn</h2>
      <p>{message}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="state-box empty-state">
      <div className="state-icon">
        <Dice5 size={29} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeRef.current();
      }}
    >
      <div className="modal-inner">
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" aria-label="Đóng hộp thoại" onClick={close}>
            <X size={21} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function GameCover({ game, className = '' }: { game: Game; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [game.imageUrl]);
  return (
    <div className={`game-cover ${className}`} style={{ backgroundColor: game.color || '#d8dfd3' }}>
      {game.imageUrl && !failed ? (
        <img
          src={game.imageUrl}
          alt={`Minh họa ${game.name}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cover-fallback">
          <Dice5 size={42} />
          <span>{game.name}</span>
        </div>
      )}
    </div>
  );
}
export function GameMeta({ game }: { game: Game }) {
  return (
    <div className="game-meta">
      <span>
        <Users size={14} />
        {game.minPlayers !== undefined && game.maxPlayers !== undefined
          ? `${game.minPlayers}–${game.maxPlayers} người`
          : 'Chưa rõ số người'}
      </span>
      <span>
        <Clock3 size={14} />
        {game.duration ? `${game.duration} phút` : 'Chưa rõ thời lượng'}
      </span>
      <span className="difficulty">
        <span aria-hidden="true">◷</span>
        {game.weight === undefined
          ? 'Chưa rõ độ khó'
          : game.weight <= 2
            ? 'Dễ làm quen'
            : game.weight <= 3
              ? 'Vừa sức'
              : 'Thử thách'}
      </span>
    </div>
  );
}
export function GameCard({ game, reason }: { game: Game; reason?: string }) {
  const { records, update, sessionLoading, shelfLoading, notice, notify } = useApp();
  const saved = records.find((record) => record.gameId === game.id)?.wishlist ?? false;
  const [saving, setSaving] = useState(false);
  async function toggle() {
    setSaving(true);
    try {
      await update(game.id, { wishlist: !saved });
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className="game-card" data-testid="game-card">
      <div className="card-art">
        <Link to={`/games/${game.id}`} aria-label={`Xem ${game.name}`}>
          <GameCover game={game} />
        </Link>
        {game.featured && (
          <span className="featured-label">
            <Sparkles size={11} /> GỢI Ý KHÁM PHÁ
          </span>
        )}
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          aria-label={`${saved ? 'Bỏ muốn thử' : 'Muốn thử'} ${game.name}`}
          aria-pressed={saved}
          disabled={saving || sessionLoading || shelfLoading || !!notice}
          onClick={() => void toggle()}
        >
          {saving ? (
            <LoaderCircle size={18} className="spin" />
          ) : (
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          )}
        </button>
      </div>
      <div className="card-content">
        <div className="card-genre">{game.genres?.slice(0, 2).join(' · ') || 'Boardgame'}</div>
        <h3>
          <Link to={`/games/${game.id}`}>{game.name}</Link>
        </h3>
        <p className="card-tagline">
          {game.tagline || game.description || 'Một lựa chọn mới cho buổi chơi của bạn.'}
        </p>
        <GameMeta game={game} />
        {reason && (
          <p className="recommendation-reason">
            <Sparkles size={15} />
            <span>{reason}</span>
          </p>
        )}
      </div>
    </article>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <div className="intro-copy">{children}</div>
    </div>
  );
}
export function InlineNotice({ children }: { children: ReactNode }) {
  return (
    <div className="inline-notice">
      <Bookmark size={17} />
      <div>{children}</div>
    </div>
  );
}
export function Rating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="rating-row">
      <div className="stars" role="group" aria-label="Chấm điểm game">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            aria-label={`Chấm ${star} sao`}
            aria-pressed={value === star}
            onClick={() => onChange(star)}
          >
            <Star size={24} fill={star <= (value ?? 0) ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <button type="button" className="text-button" onClick={() => onChange(null)}>
        Xóa điểm
      </button>
    </div>
  );
}
export function SmallSuccess({ children }: { children: ReactNode }) {
  return (
    <span className="small-success">
      <Check size={15} />
      {children}
    </span>
  );
}
export function ExploreLink() {
  return (
    <Link className="button primary" to="/games">
      Khám phá game <ArrowRight size={17} />
    </Link>
  );
}
