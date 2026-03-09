
class CollectableBottle extends DrawableObject {
    width = 60;
    height = 60;
    
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.collisionOffset = { top: 5, left: 15, right: 15, bottom: 5 };
    }

    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }
}