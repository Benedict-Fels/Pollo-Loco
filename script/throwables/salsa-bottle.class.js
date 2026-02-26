
class SalsaBottle extends ThrowableObject {

    constructor(x, y, direction) {
        super(x, y, direction);
        this.loadImages(salsaBottleImages.spinningImages);
        this.loadImages(salsaBottleImages.splashImages);
        this.img = this.imageCache[salsaBottleImages.spinningImages[0]];
        if (!this.x) {
            this.x = x;
        }
        this.collisionOffset = { top: 10, left: 10, right: 10, bottom: 10 };
        this.applyPhysics();
    }

    animateRotation() {
        this.animateImages(salsaBottleImages.spinningImages, 5);
    }

    animateSplash() {
        this.animateImages(salsaBottleImages.splashImages, 10);
        let i = (this.currentAnimationFrame % salsaBottleImages.splashImages.length);
        if (i >= salsaBottleImages.splashImages.length - 1) {
            this.isGone = true;
        }
    }

    drawHitbox(ctx, cameraOffset) {
        if (!this.isSplashing) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.collisionOffset.left + cameraOffset,
                this.y + this.collisionOffset.top,
                this.width - this.collisionOffset.left - this.collisionOffset.right,
                this.height - this.collisionOffset.top - this.collisionOffset.bottom
            );
            ctx.stroke();
        }
    }
}