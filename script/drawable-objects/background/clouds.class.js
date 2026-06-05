/**
 * Class representing moving background clouds with an endless horizontal scrolling effect.
 * @extends DrawableObject
 */
class Clouds extends DrawableObject {
    /** @type {number} The current X-coordinate of the first cloud layer. */
    x;

    /** @type {number} The vertical Y-coordinate position of the clouds. */
    y;

    /** @type {number} The width of the cloud texture in pixels. */
    width;

    /** @type {number} The calculated height of the cloud texture. */
    height;

    /** @type {number} The movement speed of the clouds per frame. Default is 0.2. */
    speed = 0.2;

    /**
     * Creates an instance of Clouds.
     * @param {number} width - The baseline width for the cloud layer.
     * @param {number} height - The canvas or screen height used to calculate the cloud's height offset.
     */
    constructor(width, height) {
        super();
        this.x = 36;
        this.y = 0;
        this.width = width;
        this.height = height - 140;
        this.speed = 0.2;
        this.loadImage('./img/5_background/layers/4_clouds/1.png');
    }

    /**
     * Moves the clouds to the left. Resets the X-coordinate to 0 once the first 
     * image has fully moved off-screen to create a seamless looping effect.
     */
    moveClouds() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    /**
     * Manually draws two identical cloud layers side-by-side onto the canvas 
     * to guarantee a seamless transition during the endless scrolling animation.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawManual(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
    }
}