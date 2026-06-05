
/**
 * Class representing a standard minor Chicken enemy.
 * Handles automatic horizontal movement, basic animations, damage reception,
 * and background performance optimizations like off-screen despawning.
 * @extends DrawableObject
 */
class Chicken extends DrawableObject {
    /** @type {boolean} Indicates if the chicken is facing left. Default is true. */
    facingLeft = true;

    /** @type {number} The current frame index counter used for structural animations. */
    currentAnimationFrame = 0;

    /** @type {number} Tracked horizontal distance offset value. */
    chickenDistance = 0;

    /** @type {number} The active health point count of the chicken. Default is 1. */
    health = 1;

    /** @type {number} The internal ticking timer used to step keyframe increments. */
    animationTimer;

    /** @type {boolean} Flag indicating if the chicken has died. Provided by the dynamic game engine. */
    isDead;

    /** @type {boolean} Flag indicating if the entity should be deleted from the active engine loop. */
    isGone;

    /** @type {World} Reference to the main game world instance. */
    world;

    /** @type {Chicken} Temporary pointer used inside the instantiation factory routine. */
    chicken;

    /**
     * Creates an instance of Chicken.
     * @param {number} [startX=1100] - The initial horizontal X-axis spawn position.
     * @param {number} [speed=3] - The lateral moving speed in pixels per frame.
     */
    constructor(startX = 1100, speed = 3) {
        super();
        this.x = startX;
        this.y = 390;
        this.width = 80;
        this.height = 80;
        this.speed = speed;
        this.collisionOffset = { top: 20, left: 20, right: 20, bottom: 10 };
        this.loadImages(chickenImages.walkImages);
        this.loadImage(chickenImages.deadImage);
        this.img = this.imageCache[chickenImages.walkImages[0]];
    }

    /**
     * Factory function that instantiates a new chicken object and pushes it into the global enemy collection.
     */
    spawnChicken() {
        this.chicken = new Chicken();
        this.world.enemies.push(this.chicken);
    }

    /**
     * Validates horizontal position against the player character. Marks the entity as ready for
     * garbage collection (`isGone = true`) if it trails more than 2000 pixels behind the player.
     */
    despawnChicken() {
        if (this.world.character.x - this.x > 2000) {
            this.isGone = true;
        }
    }

    /**
     * Evaluates active states to update animations. Freezes movement on death and transitions
     * to a flat sprite texture, or steps through walking frame cycles using modulo calculations.
     */
    chickenAnimation() {
        if (this.isDead) {
            this.img = this.imageCache[chickenImages.deadImage];
            this.speed = 0;
            setTimeout(() => {
                this.isGone = true;
            }, 2000);
            return;
        }
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 6 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 6));
        let i = (this.currentAnimationFrame % chickenImages.walkImages.length);
        let path = chickenImages.walkImages[i];
        this.img = this.imageCache[path];
    }

    /**
     * Continuous game loop update tick. Processes current visual animations
     * and updates horizontal positioning coordinates unless the entity is dead.
     */
    animateObject() {
        this.chickenAnimation();
        if (this.isDead) return;
        this.x -= this.speed;
    }

    /**
     * Inflicts lethal impact damage upon the entity, instantly toggling its death state flags.
     */
    recieveDamage() {
        this.isDead = true;
    }
}