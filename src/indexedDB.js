function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("glbCacheDB", 1);
        request.onupgradeneeded = (event) => {
            event.target.result.createObjectStore("files");
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function saveToDB(key, arrayBuffer) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readwrite");
        tx.objectStore("files").put(arrayBuffer, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function getFromDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readonly");
        const request = tx.objectStore("files").get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function fetchBinary(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

async function cacheFiles(files) {
    for (let url of files) {
        const existing = await getFromDB(url);
        if (!existing) {
            const data = await fetchBinary(url);
            await saveToDB(url, data);
            console.log("Cached:", url);
        } else {
            console.log("Already cached:", url);
        }
    }
}

// GLB ve Texture Listesi
const GLB_FILES = [
    "/GLB/large-gear.glb",
    "/GLB/small-gear.glb",
    "/GLB/console.glb",
];

const TEXTURE_FILES = [
    "/texture2/texture1.jpg",
    "/texture2/texture2.jpg",
    "/texture2/texture3.jpg",
    "/texture2/texture4.jpg",
    "/texture2/texture5.jpg",
];

const ALL_FILES = [...GLB_FILES, ...TEXTURE_FILES];

async function init() {
    await cacheFiles(ALL_FILES);
}

init();
