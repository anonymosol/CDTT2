import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '../api/client';

export function useResource<T>(load: (signal: AbortSignal) => Promise<T>, key: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(undefined);
    setLoading(true);
    setError('');
    load(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // The key is the explicit cache identity; callers supply all changing inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, revision]);
  return { data, error, loading, reload: useCallback(() => setRevision((value) => value + 1), []) };
}
