

class Chicken extends DrawableObject {
    direction = 'left';
    currentAnimationFrame = 0;
    chickenDistance = 0;
    walkImages = [
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_000.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_001.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_002.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_003.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_004.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_005.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_006.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_007.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/frame_008.png',];

    deadImage = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    constructor(startX = 1100, speed = 3) {
        super();
        this.x = startX;
        this.y = 370;
        this.width = 100;
        this.height = 100;
        this.speed = speed;
        this.collisionOffset = { top: 20, left: 20, right: 20, bottom: 10 };
        this.loadImages(this.walkImages);
        this.loadImage(this.deadImage);
        this.img = this.imageCache[this.walkImages[0]];
    }

    spawnChicken() {
        this.chicken = new Chicken();
        this.world.enemies.push(this.chicken);
    }

    chickenAnimation() {
        if (this.isDead) {
            this.img = this.imageCache[this.deadImage];
            this.speed = 0;
            setTimeout(() => {
                this.isGone = true;
            }, 2000);
            return;
        }
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 20 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 20));
        let i = (this.currentAnimationFrame % this.walkImages.length);
        let path = this.walkImages[i];
        this.img = this.imageCache[path];
    }

    moveChicken() {
        if (this.isDead) return;
        this.x -= this.speed; 
    }

    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }

    drawHitbox(ctx, cameraOffset) {
        ctx.beginPath();
        ctx.rect(this.x + this.collisionOffset.left + cameraOffset, this.y + this.collisionOffset.top,
            this.width - this.collisionOffset.left - this.collisionOffset.right,
            this.height - this.collisionOffset.top - this.collisionOffset.bottom);
        ctx.stroke();
    }

    recieveDamage() {
        this.isDead = true;
    }
}