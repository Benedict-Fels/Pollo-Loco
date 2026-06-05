/**
 * Class representing the final Boss Chicken enemy.
 * Manages complex state transitions, attack patterns (walking, stomping, egg laying, minion spawning),
 * and custom collision/attack hitboxes.
 * @extends DrawableObject
 */
class BossChicken extends DrawableObject {
    /** @type {boolean} Indicates if the boss is looking towards the left side. Default is true. */
    facingLeft = true;

    /** @type {string} The current movement direction ('left' or 'right'). Default is 'left'. */
    direction = 'left';

    /** @type {number} The current index index of the active animation array. */
    currentAnimationFrame = 0;

    /** @type {number} Distance tracker relative to other game entities. */
    chickenDistance = 0;

    /** @type {number} The maximum health points of the boss. Default is 20. */
    maxHealth = 20;

    /** @type {number} The current health points of the boss. Default is 20. */
    health = 20;

    /** @type {number} The horizontal movement speed in pixels per frame. Default is 2. */
    speed = 2;

    /** @type {number} Fixed Y-coordinate for the ground level positioning. Default is 200. */
    groundY = 200;

    /** @type {number} The step counter inside the automated attack sequence loop. Default is 1. */
    attackIndex = 1;

    /** @type {boolean} State flag indicating if the boss is currently walking. Default is true. */
    isWalking = true;

    /** @type {number} Counter or unique identifier for processed damage ticks. */
    damageInstance = 0;

    /** @type {number} Internal timer tracking the duration of the hurt animation. */
    hurtAnimationTimer = 0;

    /** @type {number} Frame interval setting that controls animation pacing. Default is 15. */
    animationSpeed = 15;

    /** @type {World} Reference to the main game world instance to access the player and managers. */
    world;

    /** @type {string[]} Reference array pointing to the currently active set of images in use. */
    imagesToUse;

    /** @type {boolean} State flag indicating if the boss is performing a ground stomp attack. */
    isStomping;

    /** @type {boolean} State flag indicating if the boss is currently laying an egg projectile. */
    isLaying;

    /** @type {boolean} State flag indicating if the boss is calling reinforcements. */
    isCallingChicken;

    /** @type {boolean} Internal frame-switch flag provided by the parent animation system. */
    newFrame;

    /** @type {boolean} Trigger flag signaling that the boss took a hit. */
    gotDamaged;

    /** @type {boolean} Flag indicating if an active attack frame has executed its impact logic. */
    hasAttacked;

    /** @type {boolean} Flag indicating if the death sequence completed and the entity can be safely garbage collected. */
    isGone;

    /**
     * Creates an instance of BossChicken.
     * @param {World} world - The game world context instance.
     * @param {number} [startX=1100] - The initial X-coordinate spawning position.
     */
    constructor(world, startX = 1100) {
        super();
        this.world = world;
        this.x = startX;
        this.y = this.groundY;
        this.width = 300;
        this.height = 300;
        this.collisionOffset = { top: 70, left: 50, right: 50, bottom: 70 };
        Object.keys(bossChickenImages).forEach(stateImage => {
            this.loadImages(bossChickenImages[stateImage]);
        });
        this.imagesToUse = bossChickenImages.walkImages;
        this.img = this.imageCache[this.imagesToUse[0]];
        this.checkAnimation();
    }

    /**
     * Evaluates spatial positioning relative to the player character to update horizontal orientation,
     * and maps current character states (dead, hurt, stomping, etc.) to their matching animation sets.
     */
    checkAnimation() {
        if (this.x > this.world.character.x) this.facingLeft = true;
        else this.facingLeft = false;
        if (this.isDead) this.imagesToUse = bossChickenImages.deadImages;
        else if (this.isHurt) this.imagesToUse = bossChickenImages.hurtImages;
        else if (this.isStomping) this.imagesToUse = bossChickenImages.stompImages;
        else if (this.isLaying) {
            this.imagesToUse = bossChickenImages.layImages;
            this.toggleDirection();
        } else if (this.isCallingChicken) this.imagesToUse = bossChickenImages.callChickenImages;
        else if (this.isWalking) this.imagesToUse = bossChickenImages.walkImages;
    }

    /**
     * Flips the horizontal visual orientation of the boss.
     */
    toggleDirection() {
        if (this.facingLeft) this.facingLeft = false;
        else this.facingLeft = true;
    }

    /**
     * Steps the attack cycle index forward and updates state flags and speeds
     * to transition between distinct modular attack mechanics.
     */
    getAttackPattern() {
        this.attackIndex++;
        if (this.attackIndex == 7) this.attackIndex = 1;
        this.isLaying = false, this.isWalking = false, this.isStomping = false, this.isCallingChicken = false;
        this.animationTimer = 0;
        this.currentAnimationFrame = 0;
        if (this.attackIndex % 2 !== 0) { this.isWalking = true, this.speed = 1; return }
        if (this.attackIndex == 2) { this.isStomping = true, this.speed = 1; return }
        if (this.attackIndex == 4) { this.isLaying = true, this.speed = 0; return }
        if (this.attackIndex == 6) { this.isCallingChicken = true, this.speed = 0; return }
    }

    /**
     * Directs core processing down either the defensive hit-reaction pipeline or the standard state pipeline.
     */
    animateObject() {
        if (this.isHurt) {
            this.hurtAnimation();
        } else {
            this.mainAnimation();
        }
    }

    /**
     * Main simulation processing tick for the boss. Evaluates timers, applies animations,
     * processes state logic updates, and scans for incoming environmental damage.
     */
    mainAnimation() {
        this.getAnimationFrame('animationTimer', this.animationSpeed);
        if (this.newFrame) {
            this.handleStateTransitions();
            this.setCurrentImage(this.imagesToUse);
            this.triggerFrameActions();
            this.checkDamage();
        }
    }

    /**
     * Analyzes active animation frames to trigger cycle resets or kick off death termination.
     * Intercepts standard flow to instantly apply incoming damage states.
     */
    handleStateTransitions() {
        if (this.currentAnimationFrame >= this.imagesToUse.length) {
            if (this.isDead) {
                this.finalizeDeath();
            } else {
                this.getAttackPattern();
                this.checkAnimation();
            }
        }
        if (this.gotDamaged) {
            this.isHurt = true;
            this.hurtAnimationTimer = 0;
            this.gotDamaged = false;
        }
    }

    /**
     * Handles the end of the death animation, freezes on the final carcass frame,
     * stops the game loop, and activates the victory screen layout.
     */
    finalizeDeath() {
        this.checkAnimation();
        if (this.currentAnimationFrame >= this.imagesToUse.length - 1) {
            this.currentAnimationFrame = this.imagesToUse.length - 1;
            setTimeout(() => {
                this.isGone = true;
                this.world.gameStopped = true;
                setOutroDiv('won');
                outroDivRef.classList.remove('vis-none');
            }, 500);
        }
    }

    /**
     * Executes logic payloads bound to precise keyframes inside specific action animations
     * (e.g., throwing eggs, spawning baby chickens, or generating stomp sound waves).
     */
    triggerFrameActions() {
        if (this.isLaying && (this.currentAnimationFrame == 1 || this.currentAnimationFrame == 4)) {
            this.shootEgg();
        }
        if (this.isCallingChicken && (this.currentAnimationFrame == 3 || this.currentAnimationFrame == 6))
            this.world.level.spawnChicken();
        if (this.isStomping)
            if (this.currentAnimationFrame == 3 || this.currentAnimationFrame == 7) {
                this.hasAttacked = true;
                bossChickenStompSound.play();
            }
            else this.hasAttacked = false;
    }

    /**
     * Secondary validation routine checking damage interruption flags.
     */
    checkDamage() {
        if (this.gotDamaged) {
            this.isHurt = true;
            this.hurtAnimationTimer = 0;
            this.gotDamaged = false;
        }
    }

    /**
     * Advances and manages the specialized non-interruptible flinch/damage animation loop.
     */
    hurtAnimation() {
        this.getAnimationFrame('hurtAnimationTimer', this.animationSpeed);
        this.setCurrentImage(bossChickenImages.hurtImages)
        if (this.currentAnimationFrame == bossChickenImages.hurtImages.length - 1) {
            this.isHurt = false;
        }
    }

    /**
     * Applies basic lateral positioning modifiers relative to speed properties and direction vectors.
     */
    moveChicken() {
        if (this.isDead) return;
        if (this.facingLeft) {
            this.x -= this.speed;
        } else this.x += this.speed;
    }

    /**
     * Spawns an egg projectile object. Calculates trajectory variables targeting the player
     * by establishing directional multipliers and mathematical distance caps.
     */
    shootEgg() {
        let center = (this.x + this.width / 2);
        let distance = this.world.character.x - center;
        let direction = distance > 0 ? -1 : 1;
        let flightTime = 70;
        let edge = center - ((this.width / 2) * direction);
        let distanceEggSpawn = this.world.character.x - edge;
        let clampedDistance = Math.max(100, Math.min(900, Math.abs(distanceEggSpawn)));
        let targetSpeedX = (clampedDistance / flightTime) * direction;
        let egg = new BossEgg(edge, this.y + 140, targetSpeedX);
        throwSound.play();
        this.world.throwableObjects.push(egg);
    }

    /**
     * Dynamic getter calculating the active structural surface hitbox area used for melee/ground stomp actions.
     * @readonly
     * @type {{x: number, y: number, width: number, height: number}}
     */
    get attackBox() {
        let attackRange = this.width + 50;
        let xOffset = -20;
        return {
            x: this.x + xOffset,
            y: this.groundLevel,
            width: attackRange,
            height: 40
        }
    }

}