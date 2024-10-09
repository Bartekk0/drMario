import AssetLoader from "./assetLoader.js";
import { sprites } from "./sprites.js";

class MagnifierVirus {
    positions = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
    ];
    offsetX = 0;
    offsetY = 0;
    constructor(board, color, startingPosition) {
        this.board = board;
        this.color = color;
        this.position = startingPosition;
    }
    draw() {
        const ctx = this.board.ctx;
        const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);

        let path = "magnifier";
        const img = this.board.assetLoader.getAsset(path);

        ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
    }
    changeFrame() {
        this.frame++;
        this.frame %= 4;
    }
    changePosition() {
        this.position++;
        this.position %= 6;
    }
    setCordinates() {
        this.x =
            this.positions[this.position].x * this.board.pieceSize +
            this.offsetX;
        this.y =
            this.positions[this.position].y * this.board.pieceSize +
            this.offsetY;
    }
}
