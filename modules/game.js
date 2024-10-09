import Board from "./canvas.js";
import Virus from "./virus.js";
import MovingPill from "./movingPill.js";
import style from "./style.js";
import sprites from "./sprites.js";
import AssetLoader from "./assetLoader.js";
import NextPill from "./nextPill.js";

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
        this.frameCounter = 0;
        this.over = false;
        this.assetLoader = new AssetLoader();
        this.startingScreenOnEnter_ = this.startingScreenOnEnter.bind(this);
        this.nextLevelOnEnter_ = this.nextLevelOnEnter.bind(this);
    }
    randomColor() {
        this.nextColors = [
            Math.floor(Math.random() * 3) + 1,
            Math.floor(Math.random() * 3) + 1,
        ];
        this.nextPill = new NextPill(13, -3, this.board, this.nextColors);
    }

    initialize() {
        // Finite number of levels bc board does not grow
        if (this.level - 1 >= this.levels.length) {
            window.addEventListener("keydown", this.startingScreenOnEnter_);

            this.gameOver(1);
        }

        // Reset the board and spawn viruses
        this.board.clearGrid();
        this.spawnViruses(this.levels[this.level - 1]);

        style();
        this.frameCounter = 0;
    }
    async start() {
        // Initialize level
        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
        this.initialize(this.level);
        this.randomColor();

        try {
            if (!this.board.assetLoader.loaded) {
                await this.board.loadImages();
            }
        } catch (error) {
            console.error("Error loading assets:", error);
            alert("Failed to load game assets. Please try again.");
        } finally {
            this.draw();
            await this.createFallingPill();

            // Start first step of game loop
            setTimeout(() => {
                this.fallingPill();
                this.draw();
            }, this.interval);
        }
    }
    draw() {
        if (this.drawTimeOut) {
            clearTimeout(this.drawTimeOut);
        }
        this.drawTimeOut = setTimeout(() => {
            window.requestAnimationFrame(() => {
                if (!this.anyVirusesLeft()) this.drawNextLevel();
                else if (this.over) {
                    window.addEventListener(
                        "keydown",
                        this.startingScreenOnEnter_
                    );
                    this.drawGameOver();
                } else {
                    this.board.draw();
                    this.nextPill.draw();
                    this.drawScore();
                    this.drawHighScore();
                    this.drawLevel();
                    this.drawVirusesLeft();
                    this.draw();
                    this.frameCounter++;
                    this.frameCounter %= 60;
                    if (this.frameCounter % 15 == 0) {
                        this.viruses.forEach((virus) => {
                            virus.changeFrame();
                        });
                    }
                }
            });
        }, 1000 / 60);
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
    async createFallingPill() {
        // New falling pill

        await this.nextPill.animate(this.interval / 10);
        this.userPill = MovingPill.fromNextPill(this.nextPill);
        this.randomColor();

        this.board.addPill(this.userPill);
    }

    canPillSpawn() {
        return (
            this.board.grid[0][3] == undefined &&
            this.board.grid[0][4] == undefined
        );
    }

    /**
     * Handles the falling logic for the current user-controlled pill.
     * If the pill can no longer fall, it converts the moving pill into a normal pill,
     * removes it from the board, adds the new pill to the board, and then clears pieces.
     * If the pill can still fall, it continues the falling process in a loop.
     *
     * @async
     * @function fallingPill
     * @returns {Promise<void>} A promise that resolves when the falling and clearing process is complete.
     */
    async fallingPill() {
        // Pieces fall while it can

        if (!this.userPill.canFall()) {
            // Turning moving pill into normal pill
            this.board.removePill(this.userPill);
            this.board.addPill(this.userPill.intoPill());

            // Then start next step of the game

            await this.piecesClear();
        } else {
            // Falling loop
            this.userPill.fall();

            await new Promise((resolve) =>
                setTimeout(() => {
                    this.fallingPill();

                    resolve();
                }, this.interval)
            );
        }
    }

    /**
     * Clears pieces from the board if there are 4 or more in a row or column.
     *
     * This method checks each row and column of the board for sequences of 4 or more pieces of the same color.
     * If such sequences are found, the pieces are marked for clearing. After marking, the pieces are cleared
     * from the board, and any associated viruses or pills are removed. If any pieces are cleared, the remaining
     * pieces fall to fill the gaps. If no viruses are left, the next level starts; otherwise, a new pill spawns.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when the pieces have been cleared and the board updated.
     */
    async piecesClear() {
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
            for (const e of toClear) {
                let endX, endY;
                if (e.x.length == 2) endX = e.x[1];
                else endX = e.x[0];
                if (e.y.length == 2) endY = e.y[1];
                else endY = e.y[0];

                for (let i = endY; i >= e.y[0]; i--)
                    for (let j = e.x[0]; j < endX + 1; j++)
                        this.board.grid[i][j].empty = true;

                await new Promise((resolve) =>
                    setTimeout(() => resolve(), this.interval)
                );

                for (let i = endY; i >= e.y[0]; i--) {
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

                        // this.board.grid[i][j].empty = true;

                        await new Promise((resolve) =>
                            setTimeout(() => resolve(), this.interval / 8)
                        );
                        this.board.updateGridPositions();

                        this.board.grid[i][j] = undefined;
                    }
                }
            }
            cleared = true;
        }

        // If something cleared then pieces fall
        if (cleared && this.anyVirusesLeft()) {
            // setTimeout(() => {
            this.piecesFall();
            // }, this.interval);
        } else {
            await new Promise((resolve) =>
                setTimeout(async () => {
                    // If not pill spawns again
                    if (this.anyVirusesLeft()) {
                        if (this.canPillSpawn()) {
                            await this.createFallingPill();

                            await new Promise((resolve1) =>
                                setTimeout(() => {
                                    this.fallingPill();
                                    resolve1();
                                }, this.interval)
                            );
                        } else {
                            window.addEventListener(
                                "keydown",
                                this.startingScreenOnEnter_
                            );
                            this.gameOver(0);
                        }
                    } else {
                        // Or next level starts
                        window.addEventListener(
                            "keydown",
                            this.nextLevelOnEnter_
                        );
                        // this.nextLevel();
                    }
                    resolve();
                }, 100)
            );
        }
    }

    /**
     * Handles the falling of pieces on the board.
     *
     * This method checks if any pieces can fall and makes them fall if possible
     * It recursively calls itself with a delay if any pieces have fallen.
     * If no pieces fall, it proceeds to clear the pieces.
     *
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if any pieces fell.
     */
    async piecesFall() {
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
            await this.piecesClear();
        }
        return fall;
    }

    anyVirusesLeft() {
        return this.board.viruses.length != 0;
    }

    nextLevel() {
        window.removeEventListener("keydown", this.nextLevelOnEnter_);

        this.level++;
        this.start();

        this.scoreChanged();
    }

    gameOver(x) {
        this.over = true;
        this.scoreChanged();
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
    drawGameOver() {
        const path = "other/gameover.png";
        this.board.drawInfo(path, 14, 5);
    }

    drawNextLevel() {
        const path = "other/stagecompleted.png";
        this.board.drawInfo(path, 16, 5);
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

    startingScreenOnEnter(e) {
        if (e.key == "Enter") {
            window.location.href = "index.html";
        }
    }
    nextLevelOnEnter(e) {
        if (e.key == "Enter") {
            this.nextLevel();
        }
    }
}

export default Game;
