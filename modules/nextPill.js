import Pill from "./pill.js";

class NextPill extends Pill {
    path = [
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: -1,
            dspin: 1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: 1,
        },
        {
            dx: -1,
            dy: -1,
            dspin: 1,
        },
        // Repeat section

        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: -1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: -1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: -1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: 1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: -1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: -1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        // End of repeat section
        {
            dx: -1,
            dy: 1,
            dspin: 1,
        },
        {
            dx: 0,
            dy: 0,
            dspin: -1,
        },
        {
            dx: -1,
            dy: 0,
            dspin: 1,
        },
        // Repeat section
        {
            dx: 0,
            dy: 1,
            dspin: 0,
        },
        {
            dx: 0,
            dy: 1,
            dspin: 0,
        },
        {
            dx: 0,
            dy: 1,
            dspin: 0,
        },
    ];
    constructor(x, y, board, colors = []) {
        super(x, y, board, 0, colors);
    }

    async animate(interval) {
        for (let i = 0; i < this.path.length; i++) {
            this.spin += this.path[i].dspin;
            if (this.spin < 0) this.spin += 4;
            this.spin %= 4;
            this.pieces = this.piecesSpined(
                this.pieces[0].x + this.path[i].dx,
                this.pieces[0].y + this.path[i].dy
            );
            console.log(this.pieces, this.spin);

            await new Promise((resolve) =>
                setTimeout(() => resolve(), interval)
            );
        }
    }

    canFall() {
        return false;
    }
    fall() {
        return false;
    }
    intoPill() {
        // Transforming into pill
        // To avoid player moving to pills at the same time
        const res = new MovingPill(
            this.pieces[0].x,
            this.pieces[0].y,
            this.board,
            this.spin,
            [this.pieces[0].color, this.pieces[1].color]
        );
        return res;
    }
}

export default NextPill;
