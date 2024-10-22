import AssetLoader from "./assetLoader.js";
import Piece from "./piece.js";

class MagnifierVirus {
    positions = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },

        { x: 4, y: 3 },
        { x: 5, y: 3 },

        { x: 7, y: 0 },
        { x: 7, y: -1 },

        { x: 5, y: -3 },
        { x: 4, y: -3 },

        { x: 2, y: -2 },
        { x: 2, y: -2 },
    ];
    offsetX = 2;
    offsetY = 17;
    constructor(board, color) {
        this.board = board;
        this.color = color;
        this.position = Math.round(
            (this.positions.length / 3) * Piece.colors.indexOf(color)
        );
        this.frame = 0;
        this.dead = false;
    }
    draw() {
        if (!this.dead) {
            const ctx = this.board.ctx;
            this.setCordinates();

            let path =
                "magnifier/" + this.color + "/" + (this.frame + 1) + ".png";

            const img = this.board.assetLoader.getAsset(path);
            ctx.drawImage(
                img,
                this.x,
                this.y,
                this.board.pieceSize * 3,
                this.board.pieceSize * 3
            );
        }
    }
    changeFrame() {
        this.frame++;
        this.frame %= 4;
    }
    changePosition() {
        this.position++;
        this.position %= this.positions.length;
    }
    setCordinates() {
        this.x =
            this.board.pieceSize * this.offsetX +
            this.positions[this.position].x * this.board.pieceSize;
        this.y =
            this.board.pieceSize * this.offsetY +
            this.positions[this.position].y * this.board.pieceSize;
    }
}

export default MagnifierVirus;
