import Board from "./canvas.js";
import Virus from "./virus.js";
import movingPill from "./movingPill.js";
import style from "./style.js";
class Game {
    constructor(interval = 500) {
        this.interval = interval;
        this.board = new Board();
        this.viruses = [];
        this.level = 1;
        this.score = 0;
        // Number of viruses in each level
        // Random numbers
        this.levels = [3, 6, 10, 13, 16, 20, 30, 40, 64];
        this.highScore = localStorage.getItem("Mario_hs");
    }
    randomColor() {
        this.nextColors = [
            Math.floor(Math.random() * 3) + 1,
            Math.floor(Math.random() * 3) + 1,
        ];
    }

    initialize() {
        // Finite number of levels bc board does not grow
        if (this.level - 1 >= this.levels.length) {
            this.gameEnd(1);
        }

        // Reset the board and spawn viruses
        this.board.clearGrid();
        this.spawnViruses(this.levels[this.level - 1]);

        style();
    }
    start() {
        // Initialize the first level
        this.initialize(this.level);
        this.createFallingPill();
        this.board.draw();
        alert("Starting level " + this.level);

        // Start first step of game loop
        setTimeout(() => {
            this.fallingPill();
            this.draw();
        }, this.interval);
    }
    draw() {
        setTimeout(() => {
            window.requestAnimationFrame(() => {
                // this.board.updateGridPositions();
                // this.board.clearCanvas();
                this.board.draw();
                this.drawScore();
                this.drawHighScore();
                this.drawLevel();
                this.drawVirusesLeft();

                this.draw();
            });
        }, 1000 / 90);
    }
    spawnViruses(n) {
        const positions = [];
        for (var i = 0; i < n; i++) {
            // Creating a new virus
            const x = Math.floor(Math.random() * (this.board.width - 1));
            const y = Math.floor(Math.random() * (this.board.height - 5));

            const virus = new Virus(x, this.board.height - 1 - y, this.board);

            // To prevent spawning in same position

            if (positions.includes(x + "." + y)) {
                i--;
                continue;
            }

            positions.push(x + "." + y);
            this.board.viruses.push(virus);
            this.viruses.push(virus);

            virus.setColor((i % 3) + 1);
        }
    }
    createFallingPill() {
        this.randomColor();

        // New falling pill
        this.userPill = new movingPill(3, 0, this.board, this.nextColors);

        this.board.addPill(this.userPill);
    }

    canPillSpawn() {
        return (
            this.board.grid[0][3] == undefined &&
            this.board.grid[0][4] == undefined
        );
    }

    fallingPill() {
        // Pieces fall while it can
        if (!this.userPill.canFall()) {
            // Turning moving pill into normal pill
            this.board.removePill(this.userPill);
            this.board.addPill(this.userPill.intoPill());

            // Then start next step of the game
            this.piecesClear();
        } else {
            // Falling loop
            this.userPill.fall();

            setTimeout(() => {
                this.fallingPill();
            }, this.interval);
        }
    }

    piecesClear() {
        let cleared = false;
        // Clearing pieces

        const toClear = [];

        let colorStart = null;
        let colorCount = 0;
        let lastColor = null;

        // Really complicated code
        // Going through every row and column and checking if there is 4 or more pieces in a row
        for (let i = 0; i < this.board.grid.length; i++) {
            const row = this.board.grid[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] == undefined) {
                    if (colorCount >= 4) {
                        toClear.push({ x: [colorStart, j - 1], y: [i] });
                    }
                    colorCount = 0;
                    colorStart = null;
                    lastColor = null;
                    continue;
                }

                const color = row[j].color;

                if (color == lastColor) {
                    colorCount++;
                } else {
                    if (colorCount >= 4) {
                        toClear.push({ x: [colorStart, j - 1], y: [i] });
                    }
                    colorCount = 1;
                    colorStart = j;
                    lastColor = color;
                }

                if (j == row.length - 1) {
                    if (colorCount >= 4)
                        toClear.push({ x: [colorStart, j], y: [i] });
                    colorCount = 0;
                    colorStart = null;
                    lastColor = null;
                }
            }
        }
        for (let i = 0; i < this.board.grid[0].length; i++) {
            for (let j = 0; j < this.board.grid.length; j++) {
                if (this.board.grid[j][i] == undefined) {
                    if (colorCount >= 4) {
                        toClear.push({ x: [i], y: [colorStart, j - 1] });
                    }
                    colorCount = 0;
                    colorStart = null;
                    lastColor = null;
                    continue;
                }

                const color = this.board.grid[j][i].color;

                if (color == lastColor) {
                    colorCount++;
                } else {
                    if (colorCount >= 4) {
                        toClear.push({ x: [i], y: [colorStart, j - 1] });
                    }
                    colorCount = 1;
                    colorStart = j;
                    lastColor = color;
                }

                if (j == this.board.grid.length - 1) {
                    if (colorCount >= 4)
                        toClear.push({ x: [i], y: [colorStart, j] });
                    colorCount = 0;
                    colorStart = null;
                    lastColor = null;
                }
            }
        }

        if (toClear.length > 0) {
            // Then clearing it
            toClear.forEach((e) => {
                let endX, endY;
                if (e.x.length == 2) endX = e.x[1];
                else endX = e.x[0];
                if (e.y.length == 2) endY = e.y[1];
                else endY = e.y[0];

                for (let i = e.y[0]; i < endY + 1; i++) {
                    for (let j = e.x[0]; j < endX + 1; j++) {
                        const piece = this.board.grid[i][j];
                        if (piece == undefined) continue;

                        if (piece.constructor.name == "Virus") {
                            this.virusKilled();
                            this.viruses.splice(this.viruses.indexOf(piece), 1);
                            this.board.viruses.splice(
                                this.board.viruses.indexOf(piece),
                                1
                            );
                        } else {
                            const pill = piece.pill;
                            pill.pieces.splice(pill.pieces.indexOf(piece), 1);
                            if (pill.pieces.length == 0) {
                                this.board.pills.splice(
                                    this.board.pills.indexOf(pill),
                                    1
                                );
                            }
                            pill.spin = 0;
                        }
                        this.board.updateGridPositions();

                        this.board.grid[i][j] = undefined;
                    }
                }
            });
            cleared = true;
        }

        // If something cleared then pieces fall
        if (cleared && this.anyVirusesLeft()) {
            setTimeout(() => {
                this.piecesFall();
            }, this.interval);
        } else
            setTimeout(() => {
                // If not pill spawns again
                if (this.anyVirusesLeft()) {
                    if (this.canPillSpawn()) {
                        this.createFallingPill();

                        setTimeout(() => {
                            this.fallingPill();
                        }, this.interval);
                    } else {
                        this.gameEnd(0);
                    }
                } else {
                    // Or next level starts
                    this.nextLevel();
                }
            }, 100);
    }

    piecesFall() {
        let fall = false;

        // Pieces fall
        this.board.pills.forEach((e) => {
            if (e.canFall()) {
                fall = true;
                e.fall();
                this.board.updateGridPositions();
            }
        });

        // Falling loop
        if (fall) {
            setTimeout(() => this.piecesFall(), this.interval / 3);
        } else {
            // If nothing fall then pieces clear
            // setTimeout(() => this.piecesClear(), this.interval/2)
            this.piecesClear();
        }
        return fall;
    }

    anyVirusesLeft() {
        return this.board.viruses.length != 0;
    }

    nextLevel() {
        alert("Level " + this.level + " cleared!");
        console.log();

        this.level++;
        this.start();

        this.scoreChanged();
    }

    gameEnd(x) {
        if (x) alert("You win");
        else alert("You lost");
        this.scoreChanged();
        location.reload();
    }

    scoreChanged() {
        this.highScore = localStorage.getItem("Mario_hs");
        if (this.highScore == null) {
            localStorage.setItem("Mario_hs", this.score);
        } else if (Number(this.highScore) < this.score) {
            localStorage.setItem("Mario_hs", this.score);
        }
    }

    drawNumber(number, x, y, n) {
        const offsetY = this.board.pieceSize * y;
        const offsetX = this.board.pieceSize * x;
        const score = this.xToNString(number, n);

        for (let i = 0; i < score.length; i++) {
            const element = score[i];
            this.board.drawNumber(
                element,
                offsetX + i * this.board.pieceSize,
                offsetY
            );
        }
    }

    drawScore() {
        this.drawNumber(this.score, 5, 8, 7);
    }
    drawHighScore() {
        this.drawNumber(this.highScore, 5, 5, 7);
    }
    drawLevel() {
        this.drawNumber(this.level, 35, 15, 2);
    }
    drawVirusesLeft() {
        this.drawNumber(this.viruses.length, 35, 21, 2);
    }

    xToNString(x, n) {
        let result = "";
        for (let i = 0; i < n - x.toString().length; i++) {
            result += "0";
        }
        result += x;
        return result;
    }

    virusKilled() {
        this.score += 100;
        this.scoreChanged();
    }
}

export default Game;
