import sortByY from "./functions.js";

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
    }
    draw() {
        this.clearCanvas();

        // Drawing background
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.background.width,
            this.background.height
        );

        // Updating position of the pills on grid
        this.updateGridPositions();

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
        if (window.innerWidth >= window.innerHeight) {
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

        // this.canvas.height =
        //     this.height * this.pieceSize + (this.height + 1) * this.margin;

        // this.canvas.width =
        //     this.width * this.pieceSize + (this.width + 1) * this.margin;

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
}
export default Board;
