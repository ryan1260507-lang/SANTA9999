const DB_NAME = 'SantaGiftDB';
const STORE_NAME = 'assets';

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveAsset = async (key: string, file: Blob) => {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(file, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const loadAllAssets = async () => {
  const db = await getDB();
  return new Promise<{ bgUrl: string | null, sockUrl: string | null, giftUrls: Record<number, string> }>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const result = {
        bgUrl: null as string | null,
        sockUrl: null as string | null,
        giftUrls: {} as Record<number, string>
    };

    const request = store.openCursor();
    request.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result;
        if (cursor) {
            const key = cursor.key as string;
            const blob = cursor.value as Blob;
            const url = URL.createObjectURL(blob);
            
            if (key === 'bg') result.bgUrl = url;
            else if (key === 'sock') result.sockUrl = url;
            else if (key.startsWith('gift_')) {
                const id = parseInt(key.replace('gift_', ''), 10);
                if (!isNaN(id)) {
                    result.giftUrls[id] = url;
                }
            }
            cursor.continue();
        } else {
            resolve(result);
        }
    };
    request.onerror = () => reject(request.error);
  });
};