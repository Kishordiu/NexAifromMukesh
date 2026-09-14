<<<<<<< HEAD
const DB_NAME = 'nexai-offline';
=======
const DB_NAME = 'diumed-offline';
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
const DB_VERSION = 1;
const STORE_CACHE = 'cache';
const STORE_SYNC_QUEUE = 'syncQueue';

function openDB() {
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject(event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE);
      }
      
      if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
        db.createObjectStore(STORE_SYNC_QUEUE, { autoIncrement: true });
      }
    };
  });
}

export async function getCache(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CACHE], 'readonly');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setCache(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CACHE], 'readwrite');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.put(value, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function addToSyncQueue(action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);
    const request = store.add(action);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSyncQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearSyncQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
=======
 return new Promise((resolve, reject) => {
 const request = indexedDB.open(DB_NAME, DB_VERSION);

 request.onerror = (event) => reject(event.target.error);

 request.onsuccess = (event) => resolve(event.target.result);

 request.onupgradeneeded = (event) => {
 const db = event.target.result;
 
 if (!db.objectStoreNames.contains(STORE_CACHE)) {
 db.createObjectStore(STORE_CACHE);
 }
 
 if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
 db.createObjectStore(STORE_SYNC_QUEUE, { autoIncrement: true });
 }
 };
 });
}

export async function getCache(key) {
 const db = await openDB();
 return new Promise((resolve, reject) => {
 const transaction = db.transaction([STORE_CACHE], 'readonly');
 const store = transaction.objectStore(STORE_CACHE);
 const request = store.get(key);

 request.onsuccess = () => resolve(request.result);
 request.onerror = () => reject(request.error);
 });
}

export async function setCache(key, value) {
 const db = await openDB();
 return new Promise((resolve, reject) => {
 const transaction = db.transaction([STORE_CACHE], 'readwrite');
 const store = transaction.objectStore(STORE_CACHE);
 const request = store.put(value, key);

 request.onsuccess = () => resolve();
 request.onerror = () => reject(request.error);
 });
}

export async function addToSyncQueue(action) {
 const db = await openDB();
 return new Promise((resolve, reject) => {
 const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
 const store = transaction.objectStore(STORE_SYNC_QUEUE);
 const request = store.add(action);

 request.onsuccess = () => resolve();
 request.onerror = () => reject(request.error);
 });
}

export async function getSyncQueue() {
 const db = await openDB();
 return new Promise((resolve, reject) => {
 const transaction = db.transaction([STORE_SYNC_QUEUE], 'readonly');
 const store = transaction.objectStore(STORE_SYNC_QUEUE);
 const request = store.getAll();

 request.onsuccess = () => resolve(request.result);
 request.onerror = () => reject(request.error);
 });
}

export async function clearSyncQueue() {
 const db = await openDB();
 return new Promise((resolve, reject) => {
 const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
 const store = transaction.objectStore(STORE_SYNC_QUEUE);
 const request = store.clear();

 request.onsuccess = () => resolve();
 request.onerror = () => reject(request.error);
 });
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
