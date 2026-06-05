/**
 * Class representing a salsa bottle projectile thrown by the player character.
 * Manages spinning flight animations, custom hitboxes, and impact splash sequences upon collision.
 * @extends ThrowableObject
 */
class SalsaBottle extends ThrowableObject {
    /** @type {HTMLAudioElement} The sound effect triggered when the bottle hits an object and breaks. */
    breakSound = bottleBreakSound;

    /** * @type {{top: number, left: number, right: number, bottom: number}} 
     * Padding values to shrink the collision box (hitbox) for accurate hit detection on enemies.
     */
    collisionOffset;

    /** @type {boolean} Flag indicating if the bottle has finished its splash animation and can be cleaned up. */
    isGone;

    /** @type {number} Current animation frame index, inherited from ThrowableObject / DrawableObject. */
    currentAnimationFrame;

    /**
     * Creates an instance of SalsaBottle.
     * @param {number} x - The initial horizontal X-coordinate spawn position.
     * @param {number} y - The initial vertical Y-coordinate spawn position.
     * @param {boolean|string} facingLeft - The direction indicator determining the horizontal flight vector path.
     */
    constructor(x, y, facingLeft) {
        super(x, y, facingLeft);
        this.loadImages(salsaBottleImages.spinningImages);
        this.loadImages(salsaBottleImages.splashImages);
        this.img = this.imageCache[salsaBottleImages.spinningImages[0]];
        if (!this.x) {
            this.x = x;
        }
        this.collisionOffset = { top: 10, left: 10, right: 10, bottom: 10 };
    }

    /**
     * Loops through the spinning texture assets to animate the bottle rotating mid-air during flight.
     */
    animateRotation() {
        this.animateImages(salsaBottleImages.spinningImages, 5);
    }

    /**
     * Plays the bottle breaking/shattering animation sequence. Once the final frame 
     * is rendered, it sets the `isGone` flag to true for memory cleanup.
     */
    animateSplash() {
        this.animateImages(salsaBottleImages.splashImages, 10);
        let i = (this.currentAnimationFrame % salsaBottleImages.splashImages.length);
        if (i >= salsaBottleImages.splashImages.length - 1) {
            this.isGone = true;
        }
    }
}