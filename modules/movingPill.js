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
        document.addEventListener("keydown", (e) => {
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
                case "z":
                case "Shift":
                    this.spinPill(-1);
                    break;
                case "x":
                case "w":
                case "ArrowUp":
                    this.spinPill(1);
                    break;
            }
        });
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

        // FIXME: something is wrong with this code

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
                }
                // Checking if spining is possible
                else if (
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

