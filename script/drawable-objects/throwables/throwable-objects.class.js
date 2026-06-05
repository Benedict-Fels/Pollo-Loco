/**
 * Base class representing any physical projectile thrown in the game (e.g., salsa bottles, boss eggs).
 * Handles gravity, horizontal directional pathing, collision ground-level limits, and state switches for splashing.
 * @extends DrawableObject
 */
class ThrowableObject extends DrawableObject {
    /** @type {number} The vertical upward velocity component. Default is 30. */
    speedY = 30;

    /** @type {number} The horizontal forward velocity component. Default is 20. */
    speedX = 20;

    /** @type {number} The gravitational downward force pulling the object down each frame. Default is 2. */
    acceleration = 2;

    /** @type {number} The Y-coordinate threshold representing the solid ground level. Default is 404. */
    groundLevel = 404;

    /** * @type {{top: number, left: number, right: number, bottom: number}} 
     * Default structural padding bounds for calculating projectile hitboxes.
     */
    collisionOffset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    /** @type {boolean} State flag indicating if the projectile has hit a target/ground and is currently breaking apart. */
    isSplashing;

    /** @type {number} Frame tracker tracking active keyframe steps, inherited from parent classes. */
    animationTimer;

    /** @type {HTMLAudioElement|undefined} Abstract sound file reference played upon object breakage, defined by child classes. */
    breakSound;

    /**
     * Creates an instance of ThrowableObject.
     * @param {number} x - The initial horizontal X-axis spawn coordinate.
     * @param {number} y - The initial vertical Y-axis spawn coordinate.
     * @param {boolean|string} facingLeft - Trajectory orientation toggle (true/left applies a negative X vector force).
     */
    constructor(x, y, facingLeft) {
        super();
        this.x = x;
        this.y = y;
        this.facingLeft = facingLeft;
        this.height = 60;
        this.width = 50;
    }

    /**
     * Central physics and animation update loop tick. 
     * Manages flight vectors, applies gravity reduction, intercepts ground hits, 
     * and switches states into the final stationary splash routine.
     */
    animateObject() {
        if (this.isSplashing) {
            if (this.speedX !== 0 || this.speedY !== 0) {
                this.animationTimer = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.playSound();
            }
            this.animateSplash();
            return;
        }
        if (this.facingLeft) {
            this.x -= this.speedX;
        } else {
            this.x += this.speedX;
        }
        if (this.y < this.groundLevel || this.speedY > 0) {
            this.animateRotation();
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.isSplashing = true;
            this.playSound();
            this.animationTimer = 0;
            this.speedY = 0;
            this.speedX = 0;
        }
    }

    /**
     * Safely rewinds and plays the assigned structural break/shatter sound effect.
     */
    playSound() {
        if (this.breakSound) {
            this.breakSound.currentTime = 0;
            this.breakSound.play();
        }
    }

    /**
     * Abstract placeholder method. To be overridden by inheriting child classes 
     * to animate the object spinning or rotating while airborne.
     */
    animateRotation() { }

    /**
     * Abstract placeholder method. To be overridden by inheriting child classes 
     * to process keyframe structures once the impact splash triggers.
     */
    animateSplash() { }
}