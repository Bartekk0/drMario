import Piece from "./piece.js";
import sprites from "./sprites.js";

class Virus extends Piece {
    constructor(x, y, board) {
        super(x, y, board, null);
    }
    // Viruses don't fall if you didn't know
    canFall() {
        return false;
    }
    fall() {
        return false;
    }
    draw() {
        const ctx = this.board.ctx;
        const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);

        let path =
            sprites["path"] +
            "viruses/virus_" +
            this.colors[this.color - 1] +
            ".png";

        const img = new Image();
        img.src = path;
        ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
    }
}
export default Virus;
