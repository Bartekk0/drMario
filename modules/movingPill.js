import Pill from "./pill.js";

class MovingPill extends Pill {
    constructor(x = 0, y = 0, board, colors = []) {
        super(x, y, board, 0, colors);
        this.#addEventLiseners();
    }
    static fromNextPill(nextPill) {
        return new MovingPill(3, 0, nextPill.board, nextPill.colors);
    }

    #addEventLiseners() {
        // Just basic event listeners
        this.listeners = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                case "a":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                case "d":
                    this.moveRight();
                    break;
                case "ArrowDown":
                case "s":
                    this.moveDown();
                    break;
                case "x":
                case "Shift":
                    this.spinPill(1);
                    break;
                case "z":
                case "w":
                case "ArrowUp":
                    this.spinPill(-1);
                    break;
            }
        };
        document.addEventListener("keydown", this.listeners);
    }
    moveRight() {
        // Different condition for horizontal and vertical positions.
        if (this.spin % 2 == 0) {
            // Checking for empty place
            if (
                this.board.grid[this.pieces[0].y][this.pieces[1].x + 1] ==
                    undefined &&
                this.pieces[1].x < this.board.width - 1
            ) {
                this.pieces[0].x++;
                this.pieces[1].x++;
            }
        } else {
            // Checking for empty place
            if (
                this.board.grid[this.pieces[0].y][this.pieces[0].x + 1] ==
                    undefined &&
                this.board.grid[this.pieces[1].y][this.pieces[1].x + 1] ==
                    undefined &&
                this.pieces[1].x < this.board.width - 1
            ) {
                this.pieces[0].x++;
                this.pieces[1].x++;
            }
        }
    }
    moveLeft() {
        // Different condition for horizontal and vertical positions.
        if (this.spin % 2 == 0) {
            // Checking for empty place
            if (
                this.board.grid[this.pieces[0].y][this.pieces[0].x - 1] ==
                    undefined &&
                this.pieces[0].x > 0
            ) {
                this.pieces[0].x--;
                this.pieces[1].x--;
            }
        } else {
            // Checking for empty place
            if (
                this.board.grid[this.pieces[0].y][this.pieces[0].x - 1] ==
                    undefined &&
                this.board.grid[this.pieces[1].y][this.pieces[1].x - 1] ==
                    undefined &&
                this.pieces[0].x > 0
            ) {
                this.pieces[0].x--;
                this.pieces[1].x--;
            }
        }
    }
    moveDown() {
        this.fall();
    }

    spinPill(s) {
        this.spin += s;
        if (this.spin < 0) {
            this.spin = this.spin + 4;
        }
        this.spin %= 4;

        let error = false;
        // Spin even => vertical    -
        // Spin odd  => horizontal  |

        switch (this.spin) {
            case 0:
                if (
                    this.pieces[0].x == this.board.width - 1 ||
                    (this.pieces[0].x > 0 &&
                        this.board.grid[this.pieces[0].y][
                            this.pieces[0].x + 1
                        ] != undefined &&
                        this.board.grid[this.pieces[0].y][
                            this.pieces[1].x + 1
                        ] != undefined)
                ) {
                    if (
                        this.board.grid[this.pieces[0].y][
                            this.pieces[0].x - 1
                        ] == undefined
                    ) {
                        this.pieces[0].x--;
                        this.pieces[1].x--;

                        this.pieces[1].x++;
                        this.pieces[1].y++;
                    } else error = true;
                } else if (
                    this.board.grid[this.pieces[1].y + 1][
                        this.pieces[1].x + 1
                    ] == undefined
                ) {
                    // 12

                    // Changing position
                    this.pieces[1].x++;
                    this.pieces[1].y++;
                } else error = true;

                break;
            case 1:
                if (
                    this.pieces[0].y > 0 &&
                    this.board.grid[this.pieces[1].y - 1][
                        this.pieces[1].x - 1
                    ] == undefined
                ) {
                    // 1
                    // 2

                    // Center piece is always at the beginning of the board
                    [this.pieces[0], this.pieces[1]] = [
                        this.pieces[1],
                        this.pieces[0],
                    ];
                    // Changing position
                    this.pieces[0].x--;
                    this.pieces[1].y--;
                } else error = true;

                break;
            case 2:
                if (
                    this.pieces[0].x == this.board.width - 1 ||
                    (this.pieces[0].x > 0 &&
                        this.board.grid[this.pieces[0].y][
                            this.pieces[0].x + 1
                        ] != undefined &&
                        this.board.grid[this.pieces[0].y][
                            this.pieces[1].x + 1
                        ] != undefined)
                ) {
                    if (
                        this.board.grid[this.pieces[0].y][
                            this.pieces[0].x - 1
                        ] == undefined
                    ) {
                        this.pieces[0].x--;
                        this.pieces[1].x--;

                        this.pieces[1].x++;
                        this.pieces[1].y++;
                    } else error = true;
                } else if (
                    this.board.grid[this.pieces[1].y + 1][
                        this.pieces[1].x + 1
                    ] == undefined
                ) {
                    // 21

                    // Changing position
                    this.pieces[1].x++;
                    this.pieces[1].y++;
                } else error = true;

                break;
            case 3:
                if (
                    this.pieces[0].y > 0 &&
                    this.board.grid[this.pieces[1].y - 1][
                        this.pieces[1].x - 1
                    ] == undefined
                ) {
                    // 2
                    // 1

                    // Center piece is always at the beginning of the board
                    [this.pieces[0], this.pieces[1]] = [
                        this.pieces[1],
                        this.pieces[0],
                    ];
                    // Changing position
                    this.pieces[0].x--;
                    this.pieces[1].y--;
                } else error = true;

                break;
            default:
                break;
        }

        if (error) {
            this.spin -= s;
            if (this.spin < 0) {
                this.spin = this.spin + 4;
            }
        }
    }
    intoPill() {
        // Transforming into pill
        // To avoid player moving to pills at the same time
        const res = new Pill(
            this.pieces[0].x,
            this.pieces[0].y,
            this.board,
            this.spin,
            [this.pieces[0].color, this.pieces[1].color]
        );
        return res;
    }
}
export default MovingPill;

