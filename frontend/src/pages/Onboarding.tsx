import { ArrowRight, Check, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { api, errorMessage } from '../api/client';
import { useResource } from '../hooks/useResource';
import { useApp } from '../store/AppProvider';
import { useState } from 'react';
import { ErrorState, GameCover, Loading, PageIntro, Rating } from '../components/ui';

export function Onboarding() {
  const resource = useResource((signal) => api.games({ weight: 2 }, signal), 'onboarding');
  const { records, update, notify, sessionLoading, shelfLoading, notice } = useApp();
  const [pending, setPending] = useState<string>();
  async function save(gameId: string, patch: { played?: boolean; rating?: number | null }) {
    setPending(gameId);
    try {
      await update(gameId, patch);
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setPending(undefined);
    }
  }
  return (
    <div className="content-page">
      <PageIntro eyebrow="LÀM QUEN MỘT CHÚT" title="Gu chơi của bạn là gì?">
        <p>
          Chọn những game bạn từng chơi và chấm điểm nếu muốn.
          <br />
          Chưa biết game nào cũng không sao, bạn có thể bỏ qua.
        </p>
      </PageIntro>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={resource.reload} />
      ) : (
        <div className="onboarding-grid">
          {resource.data?.items.map((game) => {
            const record = records.find((item) => item.gameId === game.id);
            return (
              <article
                className={`onboarding-card ${record?.played ? 'chosen' : ''}`}
                key={game.id}
              >
                <GameCover game={game} />
                <div>
                  <h2>{game.name}</h2>
                  <p>{game.tagline}</p>
                  <button
                    className={`button ${record?.played ? 'primary' : 'secondary'}`}
                    disabled={!!pending || sessionLoading || shelfLoading || !!notice}
                    aria-pressed={record?.played ?? false}
                    onClick={() => void save(game.id, { played: !record?.played })}
                  >
                    {record?.played ? <Check size={16} /> : <Heart size={16} />}
                    {record?.played ? 'Đã chơi' : 'Mình từng chơi'}
                  </button>
                  {record?.played && (
                    <fieldset disabled={!!pending}>
                      <legend className="sr-only">Điểm cho {game.name}</legend>
                      <Rating
                        value={record.rating}
                        onChange={(rating) => void save(game.id, { rating })}
                      />
                    </fieldset>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="onboarding-footer">
        <Link className="text-button" to="/games">
          Bỏ qua và khám phá
        </Link>
        <Link className="button primary" to="/recommend">
          Tìm game phù hợp
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
