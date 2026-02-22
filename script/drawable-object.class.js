
class DrawableObject {
    x = 0;
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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    isColliding(enemy) {
        return this.x + this.width - this.collisionOffset.right > enemy.x + enemy.collisionOffset.left &&
            this.y + this.height - this.collisionOffset.bottom > enemy.y + enemy.collisionOffset.top &&
            this.x + this.collisionOffset.left < enemy.x + enemy.width - enemy.collisionOffset.right &&
            this.y + this.collisionOffset.top < enemy.y + enemy.height - enemy.collisionOffset.bottom;
    }

    drawHitbox(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.collisionOffset.left,
                this.y + this.collisionOffset.top,
                this.width - this.collisionOffset.left - this.collisionOffset.right,
                this.height - this.collisionOffset.top - this.collisionOffset.bottom
            );
            ctx.stroke();
        }
    }
}
