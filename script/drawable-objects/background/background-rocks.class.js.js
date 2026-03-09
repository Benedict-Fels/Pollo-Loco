
class BackgroundRocks extends DrawableObject {
    width = 120;
    height = 160;
    nuggetOffset = { x: 45, y: -10 };

    constructor(x, y, type) {
        super();
        
        if (type === 1) {
            this.loadImage('img/11_rocks/rock1.png');
            this.nuggetOffset = { x: 52, y: -2 };
        } else if (type === 2) {
            this.loadImage('img/11_rocks/rock2.png');
            this.width = 160;
            this.height = 220;
            this.y = y - this.height;
            this.nuggetOffset = { x: 82, y: 15 };
        } else if (type === 3) {
            this.loadImage('img/11_rocks/rock3.png');
            this.nuggetOffset = { x: 42, y: -3 };
            this.width = 100;
            this.height = 80;
        }
        this.x = x;
        this.y = this.groundLevel - this.height + 70;
    }
    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }
}