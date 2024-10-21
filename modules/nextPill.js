import Pill from "./pill.js";

class NextPill extends Pill {
    rr1 = { dx: 0, dy: 0, dspin: -1 };
    rr12 = { dx: 0, dy: 0, dspin: 1 };
    rr2 = { dx: -1, dy: -1, dspin: -1 };
    rr22 = { dx: -1, dy: -1, dspin: 1 };
    rr3 = { dx: -1, dy: 0, dspin: -1 };
    rr4 = { dx: -1, dy: 0, dspin: 1 };
    rr5 = { dx: 0, dy: 1, dspin: 0 };
    rr6 = { dx: 0, dy: 0, dspin: 2 };

    expectedPath = [
        this.rr1,
        this.rr22,
        this.rr1,
        this.rr2,
        this.rr1,
        this.rr3,
        this.rr1,
        this.rr3,
        this.rr1,
        this.rr3,
        this.rr1,
        this.rr3,
        this.rr1,
        this.rr3,
        this.rr1,
        this.rr3,
        this.rr1,
        { dx: -1, dy: 1, dspin: 1 },
        this.rr1,
        this.rr4,
        this.rr5,
        this.rr5,
        this.rr5,
    ];
    constructor(x, y, board, hand, colors = []) {
        super(x, y, board, 0, colors);
        this.generatePath();
        this.hand = hand;
        this.lastSpin = 0;
    }
    generatePath() {
        this.path = this.expectedPath;
    }

    async animate(interval) {
        for (let i = 0; i < this.path.length; i++) {
            this.spin += this.path[i].dspin;
            if (this.spin < 0) this.spin += 4;
            this.spin %= 4;
            console.log(this.spin, this.lastSpin);

            if (this.spin % 2 == 0 && this.lastSpin != this.spin) {
                [...this.colors] = [...this.colors.reverse()];
            }
            this.pieces = this.piecesSpined(
                this.pieces[0].x + this.path[i].dx,
                this.pieces[0].y + this.path[i].dy
            );
            // console.log(this.pieces, this.spin);
            if (i % 3 == 0 && i != 0 && i < 9) {
                this.hand.animate();
            }
            await new Promise((resolve) =>
                setTimeout(() => resolve(), interval)
            );
            this.lastSpin = this.spin;
        }
        this.hand.animate();
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
