
class CollectibleGoldNuggets extends DrawableObject {


    constructor(x, y) {
        super();
        this.width = 30;
        this.height = 30;
        this.loadImage('img/11_rocks/nugget3.png');
        this.x = x;
        this.y = y;
        this.glowTimer = 0;
        this.collisionOffset = { top: 5, left: 15, right: 15, bottom: 5 };
    }
    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        this.nuggetGlowEffect(ctx, cameraOffset);
    }

    nuggetGlowEffect(ctx, cameraOffset) {
        this.glowTimer += 0.05;
        let cycle = this.glowTimer % 5;
        if (cycle < 1) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.4;
            let moveX = (this.width - 10) * cycle - 10;
            ctx.fillRect(
                this.x + cameraOffset + moveX + 10,
                this.y + 6,
                4,
                (this.height - 12)
            );
            ctx.restore();
        }
    }
}