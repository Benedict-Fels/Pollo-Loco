
class BossEgg extends ThrowableObject {
    speedY = 15;
    acceleration = 0.5;

    constructor(x, y, targetSpeedX) {
        super(x, y, 'left');
        this.loadImages(egg.spinningImages);
        this.loadImages(egg.splashImages);
        this.img = this.imageCache[egg.spinningImages[0]];
        this.speedX = targetSpeedX;
        this.applyPhysics();
    }

    animateRotation() {
        this.animateImages(egg.spinningImages, 10);
    }

    animateSplash() {
        this.animateImages(egg.splashImages, 10);
        let i = (this.currentAnimationFrame % egg.splashImages.length);
        if (i >= egg.splashImages.length - 1) {
            this.isGone = true;
        }
    }
}