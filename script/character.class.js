
class Character extends DrawableObject {
    speed = 10;
    isWalking = false;
    direction = 'right';
    movingDirection = 0;
    currentAnimationFrame;
    idleImages = [];
    walkImages = [];
    animationCounter = 0;

    constructor() {
        super();
        this.x = 100;
        this.y = 264;
        this.width = 100;
        this.height = 200;

        this.idleImages = [
            'img/2_character_pepe/1_idle/idle/I-1.png',
            'img/2_character_pepe/1_idle/idle/I-2.png',
            'img/2_character_pepe/1_idle/idle/I-3.png',
            'img/2_character_pepe/1_idle/idle/I-4.png',
            'img/2_character_pepe/1_idle/idle/I-5.png',
            'img/2_character_pepe/1_idle/idle/I-6.png',
            'img/2_character_pepe/1_idle/idle/I-7.png',
            'img/2_character_pepe/1_idle/idle/I-9.png',
            'img/2_character_pepe/1_idle/idle/I-10.png',
        ];

        this.walkImages = [
            'img/2_character_pepe/2_walk/W-21.png',
            'img/2_character_pepe/2_walk/W-22.png',
            'img/2_character_pepe/2_walk/W-23.png',
            'img/2_character_pepe/2_walk/W-24.png',
            'img/2_character_pepe/2_walk/W-25.png',
            'img/2_character_pepe/2_walk/W-26.png',
        ];

        this.loadImages(this.idleImages);
        this.loadImages(this.walkImages);
        this.img = this.imageCache[this.idleImages[0]];
    }

    updateAnimation() {

        if (this.isWalking !== this.wasWalkingLastFrame) {
            this.currentAnimationFrame = 0;
            this.animationTimer = 0;
        }
        this.wasWalkingLastFrame = this.isWalking;
        let imagesToUse = this.isWalking ? this.walkImages : this.idleImages;
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 20 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 20));
        let i = (this.currentAnimationFrame % imagesToUse.length);
        let path = imagesToUse[i];
        this.img = this.imageCache[path];
    }

    moveLeft() {
        this.movingDirection = -1;
        this.direction = 'left';
        this.isWalking = true;
    }

    moveRight() {
        this.movingDirection = 1;
        this.direction = 'right';
        this.isWalking = true;
    }

    stopWalking() {
        this.isWalking = false;
        this.movingDirection = 0;
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;
    }

    draw(ctx) {
        if (this.direction === 'left') {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.width / 2, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
