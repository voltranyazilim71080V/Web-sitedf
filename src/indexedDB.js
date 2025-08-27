function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("assetsDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
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
    const response = await fetch(url);
    let file;

    if (url.endsWith(".glb") || url.endswith(".hdr")) {
      file = await response.arrayBuffer();
    } else if (url.match(/\.(png|jpg|jpeg)$/)) {
      file = await response.blob();
    } else {
      continue; // desteklenmeyen dosya tipi
    }

    await saveFile(key, file);
    console.log(`${key} cachelendi`);
  }
}

const files = [
  { key: "large-gear", url: "/GLB/large-gear.glb", type: "glb" },
  { key: "small-gear", url: "/GLB/small-gear.glb", type: "glb" },
  { key: "vrc_element_1", url: "/GLB/vrc_element_1.glb", type: "glb" },
  { key: "vrc_element_2", url: "/GLB/vrc_element_2.glb", type: "glb" },
  { key: "vrc_element_3", url: "/GLB/vrc_element_3.glb", type: "glb" },
  { key: "frc_element_1", url: "/GLB/vrc_element_4.glb", type: "glb" },
  { key: "light", url: "/textures/light.hdr", type: "hdr" },
  { key: "baseColor", url: "/textures/baseColor.jpg", type: "texture" },
  { key: "metallic", url: "/textures/metallic.jpg", type: "texture" },
  { key: "normal", url: "/textures/normal.jpg", type: "texture" },
  { key: "roughness", url: "/textures/roughness.jpg", type: "texture" },
];

cacheFiles(files).then(() => console.log("Tüm dosyalar cachelendi"));
