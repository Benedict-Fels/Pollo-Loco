class Clouds extends DrawableObject {

    constructor() {
        super();
        this.x = 36;
        this.y = 0;
        this.width = 960;
        this.height = 400;
        this.speed = 0.2;
        this.loadImage('./img/5_background/layers/4_clouds/1.png');
        this.img = this.imageCache['./img/5_background/layers/4_clouds/1.png'];
    }

    moveClouds() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
    }
}