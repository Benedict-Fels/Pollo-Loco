
class Character extends DrawableObject {
    speed = 6;
    acceleration = 1.5;
    // direction = 'right';
    facingLeft = false;
    health = 10;
    bottleInventory = 5;
    nuggets = 0;
    currentAnimationFrame = 0;

    constructor(world) {
        super();
        this.x = 100;
        this.y = 264;
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

    jump() {
        if (!this.isJumping) {
            this.speedY = 22;
            this.setState('isJumping');
            characterJumpSound.play();
        }
    }

    attack() {
        if (!this.isAttacking && !this.isJumping && !this.isWalking) {
            this.setState('isAttacking');
            characterWarcrySound.play();
        }
    }

    throwBottle() {
        if (!this.isThrowing && !this.isAttacking && !this.isJumping && this.bottleInventory > 0) {
            this.setState('isThrowing');
        }
    }

    setState(state) {
        this[state] = true;
        this.animationTimer = 0;
    }

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

    spawnBottle() {
        let bottle = new SalsaBottle(
            this.x + (this.facingLeft ? 0 : 50),
            this.y + 50,
            this.facingLeft,
        );
        throwSound.play();
        this.world.throwableObjects.push(bottle);
    }

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

    checkHasAttacked() {
        if (this.isAttacking && this.currentAnimationFrame == 8) {
            this.hasAttacked = true
        }
        else
            this.hasAttacked = false;
    }

    checkAnimation() {
        if (this.isDead) this.imagesToUse = characterImages.deadImages;
        else if (this.isHurt) {
            this.imagesToUse = characterImages.hurtImages;
            this.applyGravity();
        }
        else if (this.isJumping) {
            this.imagesToUse = characterImages.jumpImages;
            this.applyGravity();
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