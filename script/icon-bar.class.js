
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
        if (this.count <= 5) {
            for (let i = 0; i < this.count; i++) {
                ctx.drawImage(
                    this.iconImg,
                    this.x + (i * (this.iconSize + 5)),
                    this.y,
                    this.iconSize,
                    this.iconSize
                );
            }
        } else {
            ctx.drawImage(this.iconImg, this.x, this.y, this.iconSize, this.iconSize);
            ctx.font = "24px Rye, serif";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            let text = "x " + this.count;
            ctx.textAlign = "left";
            ctx.strokeText(text, this.x + this.iconSize + 10, this.y + 30);
            ctx.fillText(text, this.x + this.iconSize + 10, this.y + 30);
        }
        if (this.count == 0) {
            ctx.drawImage(this.iconImg, this.x, this.y, this.iconSize, this.iconSize);
            ctx.font = "24px Rye, serif";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            let text = "x " + this.count;
            ctx.textAlign = "left";
            ctx.strokeText(text, this.x + this.iconSize + 10, this.y + 30);
            ctx.fillText(text, this.x + this.iconSize + 10, this.y + 30);
        }
    }
}