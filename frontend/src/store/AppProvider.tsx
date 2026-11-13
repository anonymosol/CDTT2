import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { api, ApiError, errorMessage } from '../api/client';
import { emptyRecord, isActiveRecord, type User, type UserGame } from '../api/models';
import { guestStore } from '../storage/guest';

type Context = {
  user: User | null;
  sessionLoading: boolean;
  shelfLoading: boolean;
  records: UserGame[];
  guestsToMerge: UserGame[];
  notice: string;
  toast: string;
  update: (gameId: string, patch: Partial<Omit<UserGame, 'gameId'>>) => Promise<void>;
  authenticate: (
    mode: 'login' | 'register',
    body: { name?: string; email: string; password: string },
  ) => Promise<void>;
  logout: () => Promise<void>;
  merge: () => Promise<void>;
  dismissMerge: () => void;
  notify: (message: string) => void;
  clearNotice: () => void;
  reload: () => Promise<void>;
};
const AppContext = createContext<Context | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [shelfLoading, setShelfLoading] = useState(true);
  const [records, setRecords] = useState<UserGame[]>([]);
  const [guestsToMerge, setGuestsToMerge] = useState<UserGame[]>([]);
  const [notice, setNotice] = useState('');
  const [toast, setToast] = useState('');
  const epoch = useRef(0);
  const locked = useRef(new Set<string>());
  const currentRecords = useRef(records);
  currentRecords.current = records;
  const notify = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  async function loadShelf(account: User | null, generation: number) {
    setShelfLoading(true);
    try {
      const next = account ? await api.shelf() : await guestStore.all();
      if (generation === epoch.current) setRecords(next);
    } finally {
      if (generation === epoch.current) setShelfLoading(false);
    }
  }
  async function reload() {
    const generation = ++epoch.current;
    setSessionLoading(true);
    setNotice('');
    try {
      const account = await api.me();
      if (generation !== epoch.current) return;
      setUser(account);
      setRecords([]);
      await loadShelf(account, generation);
      if (account) {
        const guest = (await guestStore.all()).filter(isActiveRecord);
        if (generation === epoch.current) setGuestsToMerge(guest);
      }
    } catch (error) {
      if (generation === epoch.current) setNotice(errorMessage(error));
    } finally {
      if (generation === epoch.current) {
        setSessionLoading(false);
        setShelfLoading(false);
      }
    }
  }
  useEffect(() => {
    void reload();
    return () => {
      epoch.current++;
    };
  }, []);
  async function update(gameId: string, patch: Partial<Omit<UserGame, 'gameId'>>) {
    if (sessionLoading || shelfLoading) throw new Error('Kệ đang tải, vui lòng thử lại.');
    if (locked.current.has(gameId)) return;
    locked.current.add(gameId);
    const generation = epoch.current;
    const next = {
      ...(currentRecords.current.find((record) => record.gameId === gameId) ?? emptyRecord(gameId)),
      ...patch,
      gameId,
    };
    try {
      if (user) await api.save(next);
      else await guestStore.save(next);
      if (generation === epoch.current) {
        setRecords((previous) => [...previous.filter((record) => record.gameId !== gameId), next]);
        notify('Đã cập nhật kệ game của bạn.');
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && generation === epoch.current) {
        const guestGeneration = ++epoch.current;
        setUser(null);
        setRecords([]);
        setGuestsToMerge([]);
        setNotice('Phiên đã hết hạn. Hãy đăng nhập lại để tiếp tục lưu game.');
        await loadShelf(null, guestGeneration).catch(() => undefined);
      }
      throw error;
    } finally {
      locked.current.delete(gameId);
    }
  }
  async function authenticate(
    mode: 'login' | 'register',
    body: { name?: string; email: string; password: string },
  ) {
    const account = await api.authenticate(mode, body);
    const generation = ++epoch.current;
    setUser(account);
    setRecords([]);
    setNotice('');
    setSessionLoading(false);
    await loadShelf(account, generation);
    setGuestsToMerge((await guestStore.all()).filter(isActiveRecord));
    notify(`Chào ${account.name}, mừng bạn trở lại!`);
  }
  async function logout() {
    await api.logout();
    const generation = ++epoch.current;
    setUser(null);
    setRecords([]);
    setGuestsToMerge([]);
    setNotice('');
    await loadShelf(null, generation);
    notify('Bạn đã đăng xuất.');
  }
  async function merge() {
    const generation = epoch.current;
    const merged = await api.merge(guestsToMerge);
    if (generation !== epoch.current) return;
    // Clear only after the server acknowledges the idempotent merge.
    await guestStore.clear();
    setRecords(merged);
    setGuestsToMerge([]);
    notify('Đã gộp kệ khách vào tài khoản.');
  }
  return (
    <AppContext.Provider
      value={{
        user,
        sessionLoading,
        shelfLoading,
        records,
        guestsToMerge,
        notice,
        toast,
        update,
        authenticate,
        logout,
        merge,
        dismissMerge: () => setGuestsToMerge([]),
        notify,
        clearNotice: () => setNotice(''),
        reload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppProvider is required');
  return context;
};
