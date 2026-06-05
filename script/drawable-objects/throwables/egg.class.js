/**
 * Class representing an egg projectile thrown by the Boss Chicken.
 * Handles gravity-based parabolic flight paths, rotation, and impact splash sequences.
 * @extends ThrowableObject
 */
class BossEgg extends ThrowableObject {
    /** @type {number} The initial vertical speed or upward impulse velocity. Default is 15. */
    speedY = 15;

    /** @type {number} The gravity constant pulling the egg back to the ground. Default is 0.5. */
    acceleration = 0.5;

    /** @type {HTMLAudioElement} The sound effect triggered when the egg breaks or splashes. */
    breakSound = eggCrackSound;

    /** @type {boolean} Flag indicating if the projectile has finished its splash animation and can be deleted. */
    isGone;

    /** @type {number} Current animation frame index, inherited from ThrowableObject / DrawableObject. */
    currentAnimationFrame;

    /**
     * Creates an instance of BossEgg.
     * @param {number} x - The initial horizontal X-coordinate spawn position.
     * @param {number} y - The initial vertical Y-coordinate spawn position.
     * @param {number} targetSpeedX - The calculated horizontal movement speed targeting the player.
     */
    constructor(x, y, targetSpeedX) {
        super(x, y, 'left');
        this.loadImages(egg.spinningImages);
        this.loadImages(egg.splashImages);
        this.img = this.imageCache[egg.spinningImages[0]];
        this.speedX = targetSpeedX;
    }

    /**
     * Loops through the spin texture keyframes to animate the egg rotating mid-air during flight.
     */
    animateRotation() {
        this.animateImages(egg.spinningImages, 10);
    }

    /**
     * Plays the egg smash/splash animation sequence. Once the final texture frame 
     * is reached, it sets the `isGone` flag to true for engine clean-up.
     */
    animateSplash() {
        this.animateImages(egg.splashImages, 10);
        let i = (this.currentAnimationFrame % egg.splashImages.length);
        if (i >= egg.splashImages.length - 1) {
            this.isGone = true;
        }
    }
}