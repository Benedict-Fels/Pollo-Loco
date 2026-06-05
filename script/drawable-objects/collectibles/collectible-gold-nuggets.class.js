/**
 * Class representing a collectible gold nugget item that features an animated glow effect.
 * @extends DrawableObject
 */
class CollectibleGoldNuggets extends DrawableObject {
    /** @type {number} The width of the gold nugget item in pixels. */
    width;

    /** @type {number} The height of the gold nugget item in pixels. */
    height;

    /** @type {number} An internal timer used to calculate the periodic glow animation cycle. */
    glowTimer;

    /** * @type {{top: number, left: number, right: number, bottom: number}} 
     * Padding values to shrink the collision box (hitbox) for precise collection detection.
     */
    collisionOffset;

    /**
     * Creates an instance of CollectibleGoldNuggets.
     * @param {number} x - The initial X-coordinate position on the map.
     * @param {number} y - The initial Y-coordinate position on the map.
     */
    constructor(x, y) {
        super();
        this.width = 30;
        this.height = 30;
        this.loadImage('img/11_rocks/nugget3.png');
        this.x = x;
        this.y = y;
        this.glowTimer = 0;
        this.collisionOffset = { top: 5, left: 15, right: 15, bottom: 5 };
    }

    /**
     * Manually draws the collectible gold nugget onto the canvas, factoring in the camera's translation.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} cameraOffset - The current X-axis translation value of the camera.
     */
    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        this.nuggetGlowEffect(ctx, cameraOffset);
    }

    /**
     * Animates and renders a moving semi-transparent white sheen line across the nugget's surface
     * to simulate a periodic "glinting" or "glowing" visual effect.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} cameraOffset - The current X-axis translation value of the camera.
     */
    nuggetGlowEffect(ctx, cameraOffset) {
        this.glowTimer += 0.05;
        let cycle = this.glowTimer % 5;
        if (cycle < 1) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.4;
            let moveX = (this.width - 10) * cycle - 10;
            ctx.fillRect(
                this.x + cameraOffset + moveX + 10,
                this.y + 6,
                4,
                (this.height - 12)
            );
            ctx.restore();
        }
    }
}