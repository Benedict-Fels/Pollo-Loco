
class SalsaBottle extends ThrowableObject {

    spinningImages = [
        'img/6_salsa_bottle/bottle_rotation/180_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/225_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/270_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/315_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/0_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/45_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/90_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/135_bottle_rotation.png',
    ]

    splashImages = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]
    constructor(x, y, direction) {
        super(x, y, direction);
        this.loadImages(this.spinningImages);
        this.loadImages(this.splashImages);
        this.img = this.imageCache[this.spinningImages[0]];
        if (!this.x) {
            this.x = x;
        }
        this.collisionOffset = { top: 10, left: 10, right: 10, bottom: 10 };
        this.applyPhysics();
    }

    animateRotation() {
        this.animateImages(this.spinningImages, 5);
    }

    animateSplash() {
        this.animateImages(this.splashImages, 10);
        let i = (this.currentAnimationFrame % this.splashImages.length);
        if (i >= this.splashImages.length - 1) {
            this.isGone = true;
        }
    }

    drawHitbox(ctx, cameraOffset) {
        if (!this.isSplashing) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
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