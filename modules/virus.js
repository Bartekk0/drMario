import Piece from "./piece.js";


class Virus extends Piece {
    constructor(x, y, board) {
        super(x, y, board, null);
    }
    // Viruses don't fall if you didn't know
    canFall() { return false; }
    fall() { return false; }
    // draw() { super.draw("#8b8272"); }
}
export default Virus;