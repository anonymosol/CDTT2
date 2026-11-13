import { useState, type FormEvent } from 'react';
import { errorMessage } from '../api/client';
import { emptyRecord, shelfLabels, type Game, type ShelfFlag } from '../api/models';
import { useApp } from '../store/AppProvider';
import { Modal, Rating } from './ui';

export function ShelfEditor({ game, close }: { game: Game; close: () => void }) {
  const { records, update } = useApp();
  const [draft, setDraft] = useState(
    records.find((record) => record.gameId === game.id) ?? emptyRecord(game.id),
  );
  const [saving, setSaving] = useState(false),
    [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await update(game.id, draft);
      close();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }
  return (
    <Modal
      title={`Lưu ${game.name}`}
      close={() => {
        if (!saving) close();
      }}
    >
      <form onSubmit={(event) => void submit(event)}>
        <p className="muted">Một game có thể mang nhiều nhãn. Chọn những điều đúng với bạn.</p>
        <div className="shelf-options">
          {(Object.keys(shelfLabels) as ShelfFlag[]).map((flag) => (
            <label key={flag} className={`shelf-option ${draft[flag] ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={draft[flag]}
                onChange={(event) => setDraft({ ...draft, [flag]: event.target.checked })}
              />
              {shelfLabels[flag]}
            </label>
          ))}
        </div>
        <label className="form-label">Điểm của bạn</label>
        <Rating value={draft.rating} onChange={(rating) => setDraft({ ...draft, rating })} />
        <label className="form-label" htmlFor="game-notes">
          Ghi chú nhỏ
        </label>
        <textarea
          id="game-notes"
          rows={3}
          maxLength={1000}
          placeholder="Bạn muốn chơi cùng ai? Có điều gì đáng nhớ?"
          value={draft.notes}
          onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
        />
        <span className="muted small">{draft.notes.length}/1.000 ký tự</span>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button className="button secondary" type="button" disabled={saving} onClick={close}>
            Hủy
          </button>
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu vào kệ'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
