import Piece from "./piece.js";

class Pill {
    constructor(x = 0, y = 0, board, spin = 0, colors = []) {
        this.spin = spin;
        this.board = board;
        this.colors = colors;

        this.pieces = this.piecesSpined(x, y);

        if (colors.length > 0) {
            this.pieces.forEach((piece, index) => {
                piece.color = colors[index];
            });
        }
    }
    draw() {
        this.pieces.forEach((piece, index) => {
            piece.draw(this.pieces.length, index, this.spin);
        });
    }

    piecesSpined(x, y) {
        // vertical / horizontal position
        switch (this.spin % 2) {
            case 0:
                return [
                    new Piece(x, y, this.board, this, this.colors[0]),
                    new Piece(x + 1, y, this.board, this, this.colors[1]),
                ];
            case 1:
                return [
                    new Piece(x, y, this.board, this, this.colors[0]),
                    new Piece(x, y - 1, this.board, this, this.colors[1]),
                ];
            default:
                break;
        }
    }

    setColorsFromPieces(pieces_) {
        // Here bc i didn't know how to put it in contructor
        for (let i = 0; i < pieces_.length; i++) {
            this.pieces[i].color = pieces_[i].color;
        }
    }

    canFall() {
        // Different condition for horizontal and vertical positions.
        if (this.spin % 2 == 0 && this.pieces.length == 2) {
            return this.pieces[0].canFall() && this.pieces[1].canFall();
        } else {
            return this.pieces[0].canFall();
        }
    }

    fall() {
        // Just falling
        if (this.canFall()) {
            this.pieces.forEach((piece) => {
                piece.fall(true);
            });
            return true;
        }
        return false;
    }
}
export default Pill;
