
class BossChicken extends DrawableObject {
    facingLeft = true;
    direction = 'left';
    currentAnimationFrame = 0;
    chickenDistance = 0;
    health = 20;
    speed = 2;
    groundY = 200;
    attackIndex = 1;
    isWalking = true;
    damageInstance = 0;
    hurtAnimationTimer = 0;
    animationSpeed = 15;


    constructor(startX = 1100) {
        super();
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

    checkAnimation() {
        this.facingLeft = true;
        // this.direction = 'left'
        if (this.isDead) this.imagesToUse = bossChickenImages.deadImages;
        else if (this.isHurt) this.imagesToUse = bossChickenImages.hurtImages;
        else if (this.isStomping) this.imagesToUse = bossChickenImages.stompImages;
        else if (this.isLaying) {
            this.imagesToUse = bossChickenImages.layImages;
            this.facingLeft = false;
            // this.direction = 'left'
        } else if (this.isCallingChicken) this.imagesToUse = bossChickenImages.callChickenImages;
        else if (this.isWalking) this.imagesToUse = bossChickenImages.walkImages;
    }

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

    chickenAnimation() {
        if (this.isHurt) {
            this.hurtAnimation();
        } else {
            this.mainAnimation();
        }
    }

    mainAnimation() {
        this.getAnimationFrame('animationTimer', this.animationSpeed);
        if (this.newFrame) {
            this.handleStateTransitions();
            this.setCurrentImage(this.imagesToUse);
            this.triggerFrameActions();
            this.checkDamage();
        }
    }

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

    finalizeDeath() {
        this.checkAnimation();
        if (this.currentAnimationFrame >= this.imagesToUse.length - 1) {
            this.currentAnimationFrame = this.imagesToUse.length - 1;
            setTimeout(() => {
                this.isGone = true;
                this.world.gameStopped = true;
            }, 2000);
        }
    }

    triggerFrameActions() {
        if (this.isLaying && (this.currentAnimationFrame == 1 || this.currentAnimationFrame == 4))
            this.shootEgg();
        if (this.isCallingChicken && (this.currentAnimationFrame == 3 || this.currentAnimationFrame == 6))
            this.world.level.spawnChicken();
        if (this.isStomping)
            if (this.currentAnimationFrame == 3 || this.currentAnimationFrame == 7) this.hasAttacked = true
            else this.hasAttacked = false;
    }

    checkDamage() {
        if (this.gotDamaged) {
            this.isHurt = true;
            this.hurtAnimationTimer = 0;
            this.gotDamaged = false;
        }
    }

    hurtAnimation() {
        this.getAnimationFrame('hurtAnimationTimer', this.animationSpeed);
        this.setCurrentImage(bossChickenImages.hurtImages)
        if (this.currentAnimationFrame == bossChickenImages.hurtImages.length - 1) {
            this.isHurt = false;
        }
    }

    moveChicken() {
        if (this.isDead) return;
        this.x -= this.speed;
    }

    shootEgg() {
        let distance = this.x - this.world.character.x;
        let distanceInRange = Math.max(100, Math.min(800, distance));
        let flightTime = 60;
        let targetSpeedX = distanceInRange / flightTime;
        let egg = new BossEgg(this.x, this.y + 150, targetSpeedX);
        this.world.throwableObjects.push(egg);
    }

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

    drawManual(ctx, cameraOffset) {
        if (this.facingLeft) {
            ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        } else {
            ctx.save();
            ctx.translate(this.x + cameraOffset + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    drawHitbox(ctx, cameraOffset) {
        ctx.beginPath();
        ctx.rect(this.x + this.collisionOffset.left + cameraOffset, this.y + this.collisionOffset.top,
            this.width - this.collisionOffset.left - this.collisionOffset.right,
            this.height - this.collisionOffset.top - this.collisionOffset.bottom);
        ctx.stroke();
    }
}