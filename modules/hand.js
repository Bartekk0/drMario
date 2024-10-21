class Hand {
    offsetX = 31;
    offsetY = 6.1;
    constructor(board, interval) {
        this.board = board;
        this.interval = interval;
        this.frame = 0;
    }
    animate() {
        this.changeFrame();
    }
    draw() {
        const ctx = this.board.ctx;
        let middleDown, middleUp, up, down, leftUp, leftDown;
        switch (this.frame) {
            case 0:
                up = this.board.assetLoader.getAsset("hands/up_1.png");
                middleUp = this.board.assetLoader.getAsset("hands/up_2.png");
                middleDown = this.board.assetLoader.getAsset("hands/up_3.png");
                break;

            case 1:
                leftUp = this.board.assetLoader.getAsset("hands/middle11.png");
                middleUp =
                    this.board.assetLoader.getAsset("hands/middle12.png");
                leftDown =
                    this.board.assetLoader.getAsset("hands/middle21.png");
                middleDown =
                    this.board.assetLoader.getAsset("hands/middle22.png");

                break;

            case 2:
                middleDown =
                    this.board.assetLoader.getAsset("hands/down_1.png");
                down = this.board.assetLoader.getAsset("hands/down_2.png");
                break;
            default:
                break;
        }
        // const img = this.board.assetLoader.getAsset(path);

        if (middleUp)
            ctx.drawImage(
                middleUp,
                this.offsetX * this.board.pieceSize + 1,
                (this.offsetY - 1) * this.board.pieceSize + 1,
                this.board.pieceSize,
                this.board.pieceSize
            );
        if (middleDown)
            ctx.drawImage(
                middleDown,
                this.offsetX * this.board.pieceSize + 1,
                this.offsetY * this.board.pieceSize + 1,
                this.board.pieceSize,
                this.board.pieceSize
            );
        if (up)
            ctx.drawImage(
                up,
                this.offsetX * this.board.pieceSize + 1,
                (this.offsetY - 2) * this.board.pieceSize + 1,
                this.board.pieceSize,
                this.board.pieceSize
            );
        if (down)
            ctx.drawImage(
                down,
                this.offsetX * this.board.pieceSize + 1,
                (this.offsetY + 1) * this.board.pieceSize + 1,
                this.board.pieceSize,
                this.board.pieceSize
            );
        if (leftUp)
            ctx.drawImage(
                leftUp,
                (this.offsetX - 1) * this.board.pieceSize + 1,
                (this.offsetY - 1) * this.board.pieceSize + 1,
                this.board.pieceSize,
                this.board.pieceSize
            );
        if (leftDown)
            ctx.drawImage(
                leftDown,
                (this.offsetX - 1) * this.board.pieceSize + 1,
                this.offsetY * this.board.pieceSize + 1,
                this.board.pieceSize,   
                this.board.pieceSize
            );
    }
    changeFrame() {
        this.frame++;
        this.frame %= 3;
    }
}

export default Hand;
