
class ThrowableObject extends DrawableObject {
    speedY = 30;
    speedX = 20;
    acceleration = 2;
    groundLevel = 404; 
    collisionOffset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.height = 60;
        this.width = 50;
    }

    applyPhysics() {
        this.isSplashing = false;
    let physicsInterval = setInterval(() => {
        if (this.isSplashing) {
            if (this.speedX !== 0 || this.speedY !== 0) {
                this.animationTimer = 0;
                this.speedX = 0;
                this.speedY = 0;
            }
            this.animateSplash();
            if (this.isGone) clearInterval(physicsInterval);
            return;
        }
            this.x += (this.direction === 'right') ? this.speedX : -this.speedX;

            if (this.y < this.groundLevel || this.speedY > 0) {
                this.animateRotation();
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.isSplashing = true;
                this.animationTimer = 0;
                this.speedY = 0;
                this.speedX = 0;
            }
        }, 1000 / 60);
    }
    
    animateRotation() {}
    animateSplash() {}
    
    draw(ctx, cameraOffset) {
        if (this.img) {
            ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        }
    }
}