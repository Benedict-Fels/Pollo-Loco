/**
 * Class representing decorative background rocks that can have different sizes and nugget offsets.
 * @extends DrawableObject
 */
class BackgroundRocks extends DrawableObject {
    /** @type {number} The width of the rock object in pixels. Default is 120. */
    width = 120;

    /** @type {number} The height of the rock object in pixels. Default is 160. */
    height = 160;

    /** * @type {{x: number, y: number}} Relative offset coordinates for a nugget on the rock.
     * Default is { x: 45, y: -10 }.
     */
    nuggetOffset = { x: 45, y: -10 };

    /**
     * Creates an instance of BackgroundRocks.
     * @param {number} x - The initial X-coordinate on the map.
     * @param {number} y - The baseline Y-coordinate (used to calculate positioning for specific types).
     * @param {number} type - The type variation of the rock (1, 2, or 3), which determines image, size, and offsets.
     */
    constructor(x, y, type) {
        super();
        
        if (type === 1) {
            this.loadImage('img/11_rocks/rock1.png');
            this.nuggetOffset = { x: 52, y: -2 };
        } else if (type === 2) {
            this.loadImage('img/11_rocks/rock2.png');
            this.width = 160;
            this.height = 220;
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

    /**
     * Manually draws the rock onto the canvas, taking the camera's translation into account.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} cameraOffset - The current X-axis translation value of the camera.
     */
    drawManual(ctx, cameraOffset) {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }
}