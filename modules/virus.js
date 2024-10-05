import Piece from "./piece.js";
import sprites from "./sprites.js";

class Virus extends Piece {
    constructor(x, y, board) {
        super(x, y, board, null);
        this.frame = 0;
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
            "_" +
            this.frame +
            ".png";

        const img = this.board.assetLoader.getAsset(path);
        ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
    }
    changeFrame() {
        this.frame++;
        this.frame %= 2;
    }
}
export default Virus;
