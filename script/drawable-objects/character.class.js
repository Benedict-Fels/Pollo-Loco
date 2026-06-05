/**
 * Class representing the playable main character (Pepe) in the game.
 * Manages user-controlled animations, complex action states (jumping, attacking, throwing),
 * dynamic directional collision boundaries, inventory systems, and health logic.
 * @extends DrawableObject
 */
class Character extends DrawableObject {
    /** @type {number} The horizontal running speed in pixels per frame. Default is 6. */
    speed = 6;

    /** @type {number} The acceleration factor for jumping physics. Default is 1.5. */
    acceleration = 1.5;

    /** @type {boolean} Orientation toggle indicating if the character faces left. Default is false. */
    facingLeft = false;

    /** @type {number} Current health points of the character. Default is 10. */
    health = 10;

    /** @type {number} Ammunition counter tracking usable salsa bottles. Default is 5. */
    bottleInventory = 5;

    /** @type {number} Score counter tracking collected gold nuggets. Default is 0. */
    nuggets = 0;

    /** @type {number} The active frame index within the currently assigned animation array. */
    currentAnimationFrame = 0;

    /** @type {number} The Y-coordinate boundary representing the character's feet ground placement. Default is 274. */
    groundLevel = 274;

    /** @type {number} The vertical velocity component applied during physics ticks. */
    speedY;

    /** @type {World} Reference link pointing back to the core world system engine. */
    world;

    /** @type {string[]} Reference array containing image paths for the currently active state animation. */
    imagesToUse;

    /** @type {number} Internal system counter ticking frames up to synchronize layout animations. */
    animationTimer;

    /** @type {boolean} Internal engine flag signaling a newly loaded frame sheet index. */
    newFrame;

    /** @type {boolean} State flag indicating if the character is airborne from a jump. */
    isJumping;

    /** @type {boolean} State flag indicating if the character is performing a melee swing attack. */
    isAttacking;

    /** @type {boolean} State flag indicating if the character is executing a bottle-throwing animation. */
    isThrowing;

    /** @type {boolean} State flag indicating if the character is laterally moving. */
    isWalking;

    /** @type {boolean} State flag indicating if the character is standing still. */
    isIdling;

    /** @type {boolean} State flag indicating if the character has taken damage and is flinching. */
    isHurt;

    /** @type {boolean} State flag indicating if the character has lost all health points. */
    isDead;

    /** @type {boolean} Temporary immunity state preventing damage registration during recovery frames. */
    invincibility;

    /** @type {boolean} Trigger flag notifying collision handlers that an active hit frame has executed. */
    hasAttacked;

    /** @type {number} Numeric vector tracking movement direction (-1 for left, 0 for idle, 1 for right). */
    movingDirection;

    /**
     * Creates an instance of Character.
     * Initializes positioning properties and dynamically caches all required sprite texture sheets.
     * @param {World} world - The overarching game world instance context.
     */
    constructor(world) {
        super();
        this.x = 100;
        this.y = this.groundLevel;
        this.width = 100;
        this.height = 200;
        this.speedY = 0;
        this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };
        this.world = world;
        Object.keys(characterImages).forEach(stateImage => {
            this.loadImages(characterImages[stateImage]);
        });
        this.img = this.imageCache[characterImages.idleImages[0]];
    }

    /**
     * Triggers an upward jumping velocity impulse if the character is firmly grounded,
     * switching the state profile and playing the jump audio sample.
     */
    jump() {
        if (!this.isJumping) {
            this.speedY = 22;
            this.setState('isJumping');
            characterJumpSound.play();
        }
    }

    /**
     * Activates the physical melee punch/swing action sequence if the character is 
     * completely stationary and not executing other actions.
     */
    attack() {
        if (!this.isAttacking && !this.isJumping && !this.isWalking) {
            this.setState('isAttacking');
        }
    }

    /**
     * Initiates the ranged projectile throwing sequence if conditions are met 
     * and the ammunition inventory contains available bottles.
     */
    throwBottle() {
        if (!this.isThrowing && !this.isAttacking && !this.isJumping && this.bottleInventory > 0) {
            this.setState('isThrowing');
        }
    }

    /**
     * Helper routine setting an individual state property flag to true while instantly resetting the animation timers.
     * @param {string} state - The exact variable key name of the property flag to toggle.
     */
    setState(state) {
        this[state] = true;
        this.animationTimer = 0;
    }

    /**
     * Central frame-by-frame rendering state validation hook. 
     * Separates regular continuous loops from high-speed action frame triggers.
     */
    animateObject() {
        this.checkAnimation();
        if (this.isAttacking || this.isThrowing) {
            this.characterAnimation(this.imagesToUse, 2);
            if (this.checkEndAnimation()) {
                this.triggerEndFrameActions();
            }
        } else {
            this.characterAnimation(this.imagesToUse, 6);
        }
    }

    /**
     * Processes inventory deductions, updates action loop flags, handles projectile instantiation 
     * upon ending weapon attack sequences, and re-evaluates basic stances.
     */
    triggerEndFrameActions() {
        this.isAttacking = false;
        if (this.isThrowing) {
            this.bottleInventory -= 1;
            this.spawnBottle();
            this.isThrowing = false;
        }
        this.animationTimer = 0;
        this.checkAnimation();
    }

    /**
     * Dynamic getter calculating the precise horizontal melee range hitbox box relative to the character's looking direction.
     * @readonly
     * @type {{x: number, y: number, width: number, height: number}}
     */
    get attackBox() {
        let attackRange = 45;
        let xOffset = this.facingLeft ? -20 : 80;
        return {
            x: this.x + xOffset,
            y: this.y + 100,
            width: attackRange,
            height: 80
        }
    }

    /**
     * Instantiates a new SalsaBottle projectile object into the game engine container array
     * while applying structural adjustments to mirror current position offsets.
     */
    spawnBottle() {
        let bottle = new SalsaBottle(
            this.x + (this.facingLeft ? 0 : 50),
            this.y + 50,
            this.facingLeft,
        );
        throwSound.play();
        this.world.throwableObjects.push(bottle);
    }

    /**
     * Processes health point subtractions. Handles invincibility frames, invokes audio feedbacks,
     * triggers hit flinch animations, or stops the game system upon reaching zero health.
     */
    recieveDamage() {
        if (this.invincibility || this.health <= 0) return;
        this.health -= 1;
        if (this.health <= 0) {
            this.isDead = true;
            characterDeadSound.play();
            return
        }
        this.isHurt = true;
        characterHurtSound.play();
        this.invincibility = true;
        setTimeout(() => {
            this.isHurt = false;
            this.invincibility = false;
        }, 1000);
    }

    /**
     * Advanced sequence wrapper managing index configurations. Maps image caches to rendering units 
     * and triggers game-over layout states when death frames expire.
     * @param {string[]} imagesToUse - The cached image source filepath collection to evaluate.
     * @param {number} [timer=6] - The modulo layout value defining the frame rate pacing.
     */
    characterAnimation(imagesToUse, timer = 6) {
        this.getAnimationFrame('animationTimer', timer);
        if (this.newFrame) {
            this.setCurrentImage(imagesToUse);
            if (this.isDead && this.checkEndAnimation()) {
                console.log(`Ende`);
                this.world.gameStopped = true;
                setOutroDiv('lost');
                outroDivRef.classList.remove('vis-none');
            };
            this.checkHasAttacked();
        }
    }

    /**
     * Monitors active hit frame keys during a physical attack sequence to play swinging audio triggers
     * and declare active offensive impact boxes.
     */
    checkHasAttacked() {
        if (this.isAttacking && this.currentAnimationFrame == 8) {
            characterAttackSound.play();
            this.hasAttacked = true
        }
        else
            this.hasAttacked = false;
    }

    /**
     * Hierarchical state machine checking condition matrices to route the character's texture sheets
     * to the appropriate visual context (Death, Flinch, Jump, Melee, Toss, Run, Sleep, or Idle).
     */
    checkAnimation() {
        if (this.isDead) this.imagesToUse = characterImages.deadImages;
        else if (this.isHurt) {
            this.imagesToUse = characterImages.hurtImages;
            this.applyGravity(this);
        }
        else if (this.isJumping) {
            this.imagesToUse = characterImages.jumpImages;
            this.applyGravity(this);
        }
        else if (this.isThrowing) this.imagesToUse = characterImages.throwImages;
        else if (this.isAttacking) this.imagesToUse = characterImages.attackImages;
        else if (this.isWalking) this.imagesToUse = characterImages.walkImages;
        else if (this.currentAnimationFrame >= 30) {
            this.imagesToUse = characterImages.sleepImages;
            characterSleepingSound.play();
        }
        else this.imagesToUse = characterImages.idleImages;
    }

    /**
     * Moves the character to the left. Adjusts vector factors, flips orientation toggles, 
     * shifts internal tracking variables, and mirrors structural hitbox values for accurate left-facing calculations.
     */
    moveLeft() {
        this.isAttacking = false;
        this.isIdling = false;
        if (!this.isWalking) {
            this.setState('isWalking');
        }
        this.movingDirection = -1;
        this.facingLeft = true;
        this.x -= this.speed;
        this.collisionOffset = { top: 100, left: 30, right: 20, bottom: 10 };
    }

    /**
     * Moves the character to the right. Adjusts horizontal speed values, alters visual orientation, 
     * and sets custom structural right-facing hitbox boundaries.
     */
    moveRight() {
        this.isAttacking = false;
        this.isIdling = false;
        if (!this.isWalking) {
            this.setState('isWalking');
        }
        this.movingDirection = 1;
        this.facingLeft = false;
        this.x += this.speed;
        this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };
    }

    /**
     * Terminates lateral velocity components, updates locomotion states, and resets 
     * frame trackers when shifting into standard resting stances.
     */
    stopWalking() {
        this.isWalking = false;
        this.movingDirection = 0;
        if (!this.isIdling) {
            this.currentAnimationFrame = 0;
            this.animationTimer = 0;
        }
        this.isIdling = true;
    }
}