import sprites from "./sprites.js";

class AssetLoader {
    constructor() {
        this.assets = {};
        this.loaded = false;
    }

    async loadImages(imagePaths) {
        const loadImage = (path) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = sprites.path + path;

                img.onload = () => resolve({ path, img });
                img.onerror = (err) => reject(err);
            });
        };

        const promises = imagePaths.map(loadImage);
        const loadedImages = await Promise.all(promises);

        loadedImages.forEach(({ path, img }) => {
            this.assets[path] = img;
        });
        this.loaded = true;
    }

    getAsset(path) {
        console.log(this.assets);

        return this.assets[path];
    }

    async loadImagePathsFromFile(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error("Failed to fetch image paths");
        }
        const text = await response.text();
        return text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }
}

export default AssetLoader;
