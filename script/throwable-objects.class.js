
class ThrowableObject extends DrawableObject {
    speedY = 30;
    speedX = 20;
    acceleration = 2;

    spinningBottleImages = [
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    ]

    splashBottleImages = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    constructor(x, y, direction) {
        super();
        this.loadImages(this.spinningBottleImages);
        this.loadImages(this.splashBottleImages);
        this.img = this.imageCache[this.spinningBottleImages[0]];
        if (!this.x) {
            this.x = x;
        }
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.collisionOffset = { top: 10, left: 10, right: 10, bottom: 10 };
        this.direction = direction;
        this.throw();
    }

    throw() {
        this.isSplashing = false;
        setInterval(() => {
            if (this.isSplashing) {
                this.splashBottle();
                return;
            }
            if (this.direction === 'right') {
                this.x += this.speedX;
            } else {
                this.x -= this.speedX;
            }
            if (this.isAboveGround() || this.speedY > 0) {
                this.rotateBottle();
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.isSplashing = true;
                this.animationTimer = -5;
                this.y = this.groundLevel;
                this.speedY = 0;
                this.speedX = 0;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        return this.y < this.groundLevel;
    }

    rotateBottle(timer = 5) {
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % timer !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / timer));
        let i = (this.currentAnimationFrame % this.spinningBottleImages.length);
        let path = this.spinningBottleImages[i];
        this.img = this.imageCache[path];
    }

    splashBottle(timer = 10) {
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % timer !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / timer));
        let i = (this.currentAnimationFrame % this.splashBottleImages.length);
        let path = this.splashBottleImages[i];
        this.img = this.imageCache[path];
        if (this.currentAnimationFrame >= this.splashBottleImages.length - 1) {
            this.isGone = true;
        }
    }

    draw(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
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