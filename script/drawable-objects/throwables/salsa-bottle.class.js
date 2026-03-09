
class SalsaBottle extends ThrowableObject {

    breakSound = bottleBreakSound;

    constructor(x, y, facingLeft) {
        super(x, y, facingLeft);
        this.loadImages(salsaBottleImages.spinningImages);
        this.loadImages(salsaBottleImages.splashImages);
        this.img = this.imageCache[salsaBottleImages.spinningImages[0]];
        if (!this.x) {
            this.x = x;
        }
        this.collisionOffset = { top: 10, left: 10, right: 10, bottom: 10 };
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
}