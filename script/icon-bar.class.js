
class IconBar {
    x;
    y;
    iconImg;
    count = 0;
    iconSize = 40;

    constructor(x, y, imagePath) {
        this.x = x;
        this.y = y;
        this.iconImg = new Image();
        this.iconImg.src = imagePath;
    }

    draw(ctx) {
        if (this.count <= 5 && this.count > 1) {
            for (let i = 0; i < this.count; i++) {
                ctx.drawImage(
                    this.iconImg,
                    this.x + (i * (this.iconSize + 5)),
                    this.y,
                    this.iconSize,
                    this.iconSize
                );
            }
        } 
        if (this.count > 5){
            let text = "x " + this.count;
            this.drawIcon(ctx, text);
        }
        if (this.count <= 1) {
            this.count < 0 ? 0 : this.count;
            let text = "x " + this.count;
            this.drawIcon(ctx, text);
        }
    }
    drawIcon(ctx, text){
        ctx.drawImage(this.iconImg, this.x, this.y, this.iconSize, this.iconSize);
        ctx.font = "24px Rye, serif";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "left";
        ctx.strokeText(text, this.x + this.iconSize + 10, this.y + 30);
        ctx.fillText(text, this.x + this.iconSize + 10, this.y + 30);

    }
}