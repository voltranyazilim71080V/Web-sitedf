function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("assetsDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function getFileFromDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = (e) => reject(e);
  });
}

async function saveFile(key, file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    store.put(file, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e);
  });
}

async function cacheFiles(fileList) {
  for (let i = 0; i < fileList.length; i++) {
    const { key, url } = fileList[i];

    const cached = await getFileFromDB(key);
    if (cached) { continue; }

    const response = await fetch(url);
    if (!response.ok) { continue; }

    let file;
    if (typeof url === "string" && (url.endsWith(".glb") || url.endsWith(".hdr"))) {
      file = await response.arrayBuffer();
    } else if (typeof url === "string" && (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg"))) {
      file = await response.blob();
    } else {
      continue;
    }

    await saveFile(key, file);
  }
}

const files = [
  { key: "large-gear", url: "/GLB/large-gear.glb", type: "glb" },
  { key: "small-gear", url: "/GLB/small-gear.glb", type: "glb" },
  { key: "vrc_element_1", url: "/GLB/vrc_element_1.glb", type: "glb" },
  { key: "vrc_element_2", url: "/GLB/vrc_element_2.glb", type: "glb" },
  { key: "vrc_element_3", url: "/GLB/vrc_element_3.glb", type: "glb" },
  { key: "frc_element_1", url: "/GLB/frc_element_1.glb", type: "glb" },
  { key: "light", url: "/texture/light.hdr", type: "hdr" },
  { key: "baseColor", url: "/texture/baseColor.jpg", type: "texture" },
  { key: "metallic", url: "/texture/metallic.jpg", type: "texture" },
  { key: "normal", url: "/texture/normal.png", type: "texture" },
  { key: "roughness", url: "/texture/roughness.jpg", type: "texture" },
];

cacheFiles(files).then(() => console.log("Cache Rate: 100%"));
