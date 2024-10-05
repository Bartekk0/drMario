import sprites from "./sprites.js";

class Piece {
    colors = ["yellow", "red", "blue"]
    // colors = ["#ffff0080", "#a52a2a80", "#6494ed80"]
    constructor(x, y, board, pill) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.color = Math.floor(Math.random() * 3) + 1;
        this.pill = pill;

    }
    setColor(color) {
        this.color = color;
    }
    // draw(stroke="black") {
    //     // Drawing on canvas
    //     const ctx = this.board.ctx;
    //     const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);

    //     ctx.strokeStyle = stroke; 
    //     ctx.lineCap = "round";
    //     ctx.lineWidth = this.board.margin;
    //     ctx.fillStyle = this.colors[this.color-1]
    //     ctx.beginPath();
        
    //     ctx.moveTo(x, y);
    //     ctx.lineTo(x + this.pieceSize, y);
    //     ctx.lineTo(x + this.pieceSize, y + this.pieceSize);
    //     ctx.lineTo(x, y + this.pieceSize);
    //     ctx.lineTo(x, y);
        
    //     ctx.closePath()

    //     ctx.stroke();
    //     ctx.fill();

    // }

    draw(howMany, index, spin) {
        if(howMany == 1) {

        }
        else {
            const ctx = this.board.ctx;
            const [x, y] = this.getCanvasPositionFromXnY(this.x, this.y);
            const path = sprites["path"] + "pills/" + this.colors[this.color - 1] + "_" + sprites["pills"]["piece"][1][index][spin%2] + ".png";
            const img = new Image();
            img.src = path;
            
            ctx.drawImage(img, x, y, this.board.pieceSize, this.board.pieceSize);
        }
    }
    canFall() {
        // Checking if place below the piece is empty (undefined)
        if (this.y < this.board.height-1 && this.board.grid[this.y + 1][this.x] == undefined) {
            return true;
        }
        return false;
    }
    fall(nocheck=false) {
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
        return [this.pieceSize * x + this.board.margin * (x + 1), this.board.pieceSize * y + this.board.margin * (y + 1)];
    }
}
export default Piece;