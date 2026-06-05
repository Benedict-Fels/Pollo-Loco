
/**
 * Class representing a collectible salsa bottle item on the ground.
 * @extends DrawableObject
 */
class CollectableBottle extends DrawableObject {
    /** @type {number} The width of the bottle item in pixels. Default is 60. */
    width = 60;

    /** @type {number} The height of the bottle item in pixels. Default is 60. */
    height = 60;

    /** * @type {{top: number, left: number, right: number, bottom: number}} 
     * Padding values to shrink the collision box (hitbox) for more accurate interaction.
     */
    collisionOffset;

    /**
     * Creates an instance of CollectableBottle.
     * @param {number} x - The initial X-coordinate position on the map.
     * @param {number} y - The initial Y-coordinate position on the map.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.collisionOffset = { top: 5, left: 15, right: 15, bottom: 5 };
    }

    /**
     * Manually draws the collectible bottle onto the canvas, factoring in the camera's translation.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} cameraOffset - The current X-axis translation value of the camera.
     */
    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }
}