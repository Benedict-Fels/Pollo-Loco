

class Chicken extends DrawableObject {
    facingLeft = true;
    currentAnimationFrame = 0;
    chickenDistance = 0;
    health = 1;

    constructor(startX = 1100, speed = 3) {
        super();
        this.x = startX;
        this.y = 390;
        this.width = 80;
        this.height = 80;
        this.speed = speed;
        this.collisionOffset = { top: 20, left: 20, right: 20, bottom: 10 };
        this.loadImages(chickenImages.walkImages);
        this.loadImage(chickenImages.deadImage);
        this.img = this.imageCache[chickenImages.walkImages[0]];
    }

    spawnChicken() {
        this.chicken = new Chicken();
        this.world.enemies.push(this.chicken);
    }

    despawnChicken() {
        if (this.world.character.x - this.x > 2000) {
            this.isGone = true;
        }
    }

    chickenAnimation() {
        if (this.isDead) {
            this.img = this.imageCache[chickenImages.deadImage];
            this.speed = 0;
            setTimeout(() => {
                this.isGone = true;
            }, 2000);
            return;
        }
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 6 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 6));
        let i = (this.currentAnimationFrame % chickenImages.walkImages.length);
        let path = chickenImages.walkImages[i];
        this.img = this.imageCache[path];
    }

    animateObject() {
        this.chickenAnimation();
        if (this.isDead) return;
        this.x -= this.speed;
    }

    recieveDamage() {
        this.isDead = true;
    }
}