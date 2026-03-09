
class DrawableObject {
    y = 0;
    width = 0;
    height = 0;
    img;
    imageCache = {};
    currentImage = 0;
    collisionOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    groundLevel = 404;

    loadImage(path) {
        if (!this.imageCache[path]) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }
        this.img = this.imageCache[path];
    }

    loadImages(arrayOfPaths) {
        arrayOfPaths.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    getAnimationFrame(timer, animateSpeed) {
        this[timer] = (this[timer] || 0) + 1;
        if (this[timer] % animateSpeed !== 0) {
            return this.newFrame = false
        }
        this.newFrame = true;
        this.currentAnimationFrame = (this[timer] / animateSpeed);
    }

    setCurrentImage(imagesToUse) {
        if (!imagesToUse || imagesToUse.length === 0) return;
        let i = Math.floor(this.currentAnimationFrame) % imagesToUse.length;
        let path = imagesToUse[i];
        if (path) this.img = this.imageCache[path];
    }

    animateImages(imagesToUse, timer = 6) {
        this.getAnimationFrame('animationTimer', timer);
        this.setCurrentImage(imagesToUse);
    }

    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = 264;
            this.speedY = 0;
            this.isJumping = false;
        }
    }

    isAboveGround() {
        return this.y < 264;
    }

    drawAttackBox(ctx) {
        if (this.hasAttacked) {
            let box = this.attackBox;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(box.x + this.cameraOffset, box.y, box.width, box.height);
        }

    }

    checkEndAnimation() {
        if ((this.currentAnimationFrame % this.imagesToUse.length) >= (this.imagesToUse.length - 1)) return true
        else return false
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    isColliding(enemy) {
        return this.x + this.width - this.collisionOffset.right > enemy.x + enemy.collisionOffset.left &&
            this.y + this.height - this.collisionOffset.bottom > enemy.y + enemy.collisionOffset.top &&
            this.x + this.collisionOffset.left < enemy.x + enemy.width - enemy.collisionOffset.right &&
            this.y + this.collisionOffset.top < enemy.y + enemy.height - enemy.collisionOffset.bottom;
    }

    drawManual(ctx, cameraOffset) {
        if (!this.facingLeft) {
            ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        } else {
            ctx.save();
            ctx.translate(this.x + cameraOffset + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    drawHitbox(ctx, cameraOffset = 0) {
        if (debugMode) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.collisionOffset.left + cameraOffset,
                this.y + this.collisionOffset.top,
                this.width - this.collisionOffset.left - this.collisionOffset.right,
                this.height - this.collisionOffset.top - this.collisionOffset.bottom
            );
            ctx.stroke();
        }
    }

    drawAttackBox(ctx, cameraOffset) {
        if (this.hasAttacked) {
            let box = this.attackBox;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(box.x + cameraOffset, box.y, box.width, box.height);
        }
    }
}
