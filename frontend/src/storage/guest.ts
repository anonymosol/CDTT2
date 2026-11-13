import { userGameSchema, type UserGame } from '../api/models';

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open('boardgame-advisor', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('guest-games', { keyPath: 'gameId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Không mở được kệ trên trình duyệt.'));
    request.onblocked = () => reject(new Error('Hãy đóng các tab cũ của ứng dụng rồi thử lại.'));
  });
async function transaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction('guest-games', mode);
    const request = operation(tx.objectStore('guest-games'));
    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(new Error('Chưa lưu được kệ trên trình duyệt. Kiểm tra dung lượng và quyền lưu trữ.'));
    };
  });
}
export const guestStore = {
  async all(): Promise<UserGame[]> {
    const records = await transaction('readonly', (store) => store.getAll());
    return records
      .map((record) => userGameSchema.safeParse(record))
      .filter((result) => result.success)
      .map((result) => result.data!);
  },
  async save(record: UserGame) {
    await transaction('readwrite', (store) => store.put(userGameSchema.parse(record)));
  },
  async clear() {
    await transaction('readwrite', (store) => store.clear());
  },
};
