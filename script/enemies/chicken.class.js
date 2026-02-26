

class Chicken extends DrawableObject {
    direction = 'left';
    currentAnimationFrame = 0;
    chickenDistance = 0;
    health = 1;

    constructor(startX = 1100, speed = 3) {
        super();
        this.x = startX;
        this.y = 370;
        this.width = 100;
        this.height = 100;
        this.speed = speed;
        this.collisionOffset = { top: 20, left: 20, right: 20, bottom: 10 };
        this.loadImages(chicken.walkImages);
        this.loadImage(chicken.deadImage);
        this.img = this.imageCache[chicken.walkImages[0]];
    }

    spawnChicken() {
        this.chicken = new Chicken();
        this.world.enemies.push(this.chicken);
    }

    chickenAnimation() {
        if (this.isDead) {
            this.img = this.imageCache[chicken.deadImage];
            this.speed = 0;
            setTimeout(() => {
                this.isGone = true;
            }, 2000);
            return;
        }
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 20 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 20));
        let i = (this.currentAnimationFrame % chicken.walkImages.length);
        let path = chicken.walkImages[i];
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