import { sprites } from "./sprites.js";

class Magnifier {
    constructor(board) {
        this.board = board;
    }
    draw() {
        const ctx = this.board.ctx;
        const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);

        // let path = sprites["path"] + "magnifier.png";

        const img = new Image();
        img.src = path;
        ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
    }
}
