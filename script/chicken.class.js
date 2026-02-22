

class Chicken extends DrawableObject {
    speed = 3;
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

    constructor() {
        super();
        this.x = 700;
        this.y = 370;
        this.width = 100;
        this.height = 100;
        this.collisionOffset = { top: 20, left: 20, right: 20, bottom: 10 };

        this.loadImages(this.walkImages);
        this.img = this.imageCache[this.walkImages[0]];
    }

    chickenAnimation() {
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 20 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 20));
        let i = (this.currentAnimationFrame % this.walkImages.length);
        let path = this.walkImages[i];
        this.img = this.imageCache[path];
    }

    moveChicken(cameraOffset) {
        this.chickenDistance -= this.speed;
        this.x = -cameraOffset + 700 + this.chickenDistance;
    }


    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}