import sortByY from "./functions.js";
import sprites from "./sprites.js";
import AssetLoader from "./assetLoader.js";

class Board {
    constructor(height = 16, width = 8, pieceSize = 16, margin = 0) {
        this.height = height;
        this.width = width;
        this.pills = [];
        this.viruses = [];
        this.pieceSize = pieceSize;
        this.margin = margin;
        this.#createGrid();
        this.#createCanvas();
        this.assetLoader = new AssetLoader();
    }
    async loadImages() {
        this.assetLoader
            .loadImagePathsFromFile("../images/imagePaths.txt")
            .then((imagePaths) => {
                return this.assetLoader.loadImages(imagePaths);
            })
            .then(() => {
                console.log("All images loaded");
                // Now you can use assetLoader.getAsset(path) to get the loaded images
                return;
            })
            .catch((err) => {
                alert("Error loading images");
                console.error("Error loading images", err);
            });
    }

    draw() {
        this.clearCanvas();

        // Updating position of the pills on grid
        this.updateGridPositions();

        // Drawing background
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.background.width,
            this.background.height
        );

        // Drawing every piece
        [...this.viruses, ...this.pills].forEach((item) => {
            item.draw();
        });
    }
    #createGrid() {
        // Creating empty grid
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            const row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(undefined);
            }
            this.grid.push(row);
        }
    }
    #createCanvas() {
        // Creating canvas in html
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("game-canvas");
        console.log(window.innerHeight, window.innerWidth);
        const windowRatio = window.innerHeight / window.innerWidth;
        const gameRatio = 384 / 640;
        console.log(windowRatio, gameRatio);

        if (windowRatio < gameRatio) {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerHeight * (640 / 384);
            this.scale = window.innerHeight / 384;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerWidth * (384 / 640);
            this.scale = window.innerWidth / 640;
        }
        console.log(this.scale);
        this.pieceSize *= this.scale;
        this.playgroundYOffset = this.pieceSize * 6;
        this.playgroundXOffset = this.pieceSize * 17;

        this.background = new Image();
        this.background.height = this.canvas.height;
        this.background.width = this.canvas.width;

        this.ctx = this.canvas.getContext("2d");
        this.background.src = "../images/other/background.png";
        const body = document.querySelector("body");
        body.appendChild(this.canvas);
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    addPill(pill) {
        // Adding pill everywhere it should be
        this.pills.push(pill);
        this.sortPills();

        this.grid[pill.pieces[0].y][pill.pieces[0].x] = pill.pieces[0];
        this.grid[pill.pieces[1].y][pill.pieces[1].x] = pill.pieces[1];
    }
    removePill(pill) {
        // Removing pill from everywhere
        this.pills.splice(this.pills.indexOf(pill), 1);
        delete this.grid[pill.pieces[0].y][pill.pieces[0].x];
        delete this.grid[pill.pieces[1].y][pill.pieces[1].x];
    }
    updateGridPositions() {
        // Transfering pills/viruses position to grid
        this.#createGrid();
        this.viruses.forEach((virus) => {
            this.grid[virus.y][virus.x] = virus;
        });
        this.pills.forEach((pill) => {
            pill.pieces.forEach((piece) => {
                this.grid[piece.y][piece.x] = piece;
            });
        });
    }
    sortPills() {
        this.pills.sort((a, b) => sortByY(a, b));
    }
    clearGrid() {
        this.#createGrid();
        this.pills = [];
    }
    drawNumber(number, x, y) {
        // Drawing number on canvas
        const ctx = this.ctx;
        const path = sprites.path + "numbers/" + number + ".png";
        const img = this.assetLoader.getAsset(path);

        ctx.drawImage(img, x + 1, y - 1, this.pieceSize, this.pieceSize);
    }
    drawInfo(path, sizeX, sizeY) {
        // Drawing info on canvas
        const ctx = this.ctx;
        const img = this.assetLoader.getAsset(path);

        ctx.drawImage(
            img,
            this.playgroundXOffset - this.pieceSize * 3,
            this.playgroundYOffset,
            this.pieceSize * sizeX + 1,
            this.pieceSize * sizeY + 2
        );
    }
}
export default Board;
