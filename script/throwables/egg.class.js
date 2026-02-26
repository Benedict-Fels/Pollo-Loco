
class BossEgg extends ThrowableObject {
    speedY = 15;
    acceleration = 0.5;

    eggImages = [
        'img/10_egg/0_egg_rotation.png',
        'img/10_egg/315_egg_rotation.png',
        'img/10_egg/270_egg_rotation.png',
        'img/10_egg/225_egg_rotation.png',
        'img/10_egg/180_egg_rotation.png',
        'img/10_egg/135_egg_rotation.png',
        'img/10_egg/90_egg_rotation.png',
        'img/10_egg/45_egg_rotation.png',
    ];

    eggBreakImages = [
        'img/10_egg/egg_splash/1_splash.png',
        'img/10_egg/egg_splash/2_splash.png',
        'img/10_egg/egg_splash/3_splash.png',
        'img/10_egg/egg_splash/4_splash.png',

    ];

    constructor(x, y, targetSpeedX) {
        super(x, y, 'left');
        this.loadImages(this.eggImages);
        this.loadImages(this.eggBreakImages);
        this.img = this.imageCache[this.eggImages[0]];
        this.speedX = targetSpeedX;
        this.applyPhysics();
    }

    animateRotation() {
        this.animateImages(this.eggImages, 10);
    }

    animateSplash() {
        this.animateImages(this.eggBreakImages, 10);
        let i = (this.currentAnimationFrame % this.eggBreakImages.length);
        if (i >= this.eggBreakImages.length - 1) {
            this.isGone = true;
        }
    }
}