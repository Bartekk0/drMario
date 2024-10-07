import { sprites } from "./sprites.js";

class MagnifierVirus {
    constructor(board, color, startingPosition) {
        this.board = board;
        this.color = color;
        this.position = startingPosition;
    }
    draw() {
        const ctx = this.board.ctx;
        const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);

        // let path = sprites["path"] + "magnifier.png";

        const img = new Image();
        img.src = path;
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
}
