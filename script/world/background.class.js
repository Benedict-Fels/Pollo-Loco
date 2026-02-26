class Background extends DrawableObject {
    parallaxFactor = 1;
    imageIndex = 0;
    originalWidth = 3840;
    originalHeight = 1080;

    constructor(imagePath, parallaxFactor = 1, imageIndex = 0) {
        super();
        this.loadImage(imagePath);
        this.parallaxFactor = parallaxFactor;
        this.imageIndex = imageIndex;

        this.height = 540;
        this.width = 1920;

        this.x = imageIndex * this.width;
        this.y = 0;
    }

    updatePosition(cameraOffset) {
        this.x = -cameraOffset * this.parallaxFactor;
    }

    draw(ctx, cameraOffset) {
        let x = (cameraOffset * this.parallaxFactor) % this.width;
        ctx.drawImage(this.img, x, 0, this.width, this.height);
        ctx.drawImage(this.img, x + this.width, 0, this.width, this.height);
        ctx.drawImage(this.img, x - this.width, 0, this.width, this.height);
    }
}

