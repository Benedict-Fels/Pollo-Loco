/**
 * Class for the icon bars that show the amount of collected items, like coins or hearts.
 */

class IconBar {
    x;
    y;
    iconImg;
    count = 0;
    iconSize = 40;

    /** @type {number} The X-coordinate position of the icon bar on the canvas. */
    x;

    /** @type {number} The Y-coordinate position of the icon bar on the canvas. */
    y;

    /** @type {HTMLImageElement} The image object used for the icon. */
    iconImg;

    /** @type {number} The current amount of collected items. Default is 0. */
    count = 0;

    /** @type {number} The width and height size of the icon in pixels. Default is 40. */
    iconSize = 40;

    /**
     * Creates an instance of IconBar.
     * @param {number} x - The X-coordinate for the icon bar.
     * @param {number} y - The Y-coordinate for the icon bar.
     * @param {string} imagePath - The file path to the icon image.
     */
    constructor(x, y, imagePath) {
        this.x = x;
        this.y = y;
        this.iconImg = new Image();
        this.iconImg.src = imagePath;
    }

    /**
     * Draws the icon bar onto the canvas. Chooses between drawing multiple icons 
     * side-by-side or a single icon with a counter text based on the item count.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
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
        if (this.count > 5) {
            let text = "x " + this.count;
            this.drawIcon(ctx, text);
        }
        if (this.count <= 1) {
            this.count < 0 ? 0 : this.count;
            let text = "x " + this.count;
            this.drawIcon(ctx, text);
        }
    }

    /**
     * Draws a single icon with an accompanied text label next to it.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {string} text - The text string to display next to the icon (e.g., "x 6").
     */
    drawIcon(ctx, text) {
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