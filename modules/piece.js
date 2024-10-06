import sprites from "./sprites.js";

class Piece {
    colors = ["yellow", "red", "blue"];
    // colors = ["#ffff0080", "#a52a2a80", "#6494ed80"]
    constructor(x, y, board, pill) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.color = Math.floor(Math.random() * 3) + 1;
        this.pill = pill;
        this.empty = false;
    }
    setColor(color) {
        this.color = color;
    }

    draw(howMany, index, spin) {
        const ctx = this.board.ctx;
        const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);
        let path = "";
        if (this.empty) {
            path = "pills/" + this.colors[this.color - 1] + "_empty.png";
        } else if (howMany == 1) {
            path = "pills/" + this.colors[this.color - 1] + "_single.png";
        } else {
            path =
                "pills/" +
                this.colors[this.color - 1] +
                "_" +
                sprites["pills"]["piece"][index][spin % 2] +
                ".png";
        }
        const img = this.board.assetLoader.getAsset(path);
        ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
    }
    canFall() {
        // Checking if place below the piece is empty (undefined)
        if (
            this.y < this.board.height - 1 &&
            this.board.grid[this.y + 1][this.x] == undefined
        ) {
            return true;
        }
        return false;
    }
    fall(nocheck = false) {
        // Just falling
        if (nocheck || this.canFall()) {
            this.y++;
            return true;
        }
        return false;
    }
    getCanvasPositionFromXnY(x, y) {
        // Calculating canvas x, y from grid x, y
        this.pieceSize = this.board.pieceSize;
        return [
            this.pieceSize * x +
                this.board.margin * (x + 1) +
                this.board.playgroundXOffset,
            this.board.pieceSize * y +
                this.board.margin * (y + 1) +
                this.board.playgroundYOffset,
        ];
    }
}
export default Piece;
