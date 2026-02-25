
class BossChicken extends DrawableObject {
    facingLeft = true;
    direction = 'left';
    currentAnimationFrame = 0;
    chickenDistance = 0;
    health = 2;
    speed = 2;
    groundY = 200;
    attackIndex = 1;
    isWalking = true;
    isStomping = false;
    isAlerting = false;
    isCallingChicken = false;
    hasAttacked = false;
    gotDamaged = false;
    isHurt = false;
    isDead = false;
    newFrame = false;
    damageInstance = 0;
    hurtAnimationTimer = 0;
    animationSpeed = 15;

    hurtImages = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    walkImages = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    alertImages = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    callChickenImages = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G13.png',
    ]

    stompImages = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19_effects.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19_effects.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ]

    deadImages = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ]

    constructor(startX = 1100) {
        super();
        this.x = startX;
        this.y = this.groundY;
        this.width = 300;
        this.height = 300;
        this.collisionOffset = { top: 70, left: 50, right: 50, bottom: 70 };
        this.loadImages(this.walkImages);
        this.loadImages(this.alertImages);
        this.loadImages(this.stompImages);
        this.loadImages(this.callChickenImages);
        this.loadImages(this.hurtImages);
        this.loadImages(this.deadImages);
        this.imagesToUse = this.walkImages;
        this.img = this.imageCache[this.imagesToUse[0]];
        this.checkAnimation();
    }

    checkAnimation() {
        this.facingLeft = true;
        // this.direction = 'left'
        if (this.isDead) this.imagesToUse = this.deadImages;
        else if (this.isHurt) this.imagesToUse = this.hurtImages;
        else if (this.isStomping) this.imagesToUse = this.stompImages;
        else if (this.isAlerting) {
            this.imagesToUse = this.alertImages;
            this.facingLeft = false;
            // this.direction = 'left'
        } else if (this.isCallingChicken) this.imagesToUse = this.callChickenImages;
        else if (this.isWalking) this.imagesToUse = this.walkImages;
    }

    getAttackPattern() {
        this.attackIndex++;
        if (this.attackIndex == 7) this.attackIndex = 1;
        this.isAlerting = false, this.isWalking = false, this.isStomping = false, this.isCallingChicken = false;
        this.animationTimer = 0;
        this.currentAnimationFrame = 0;
        if (this.attackIndex % 2 !== 0) { this.isWalking = true, this.speed = 1; return }
        if (this.attackIndex == 2) { this.isStomping = true, this.speed = 1; return }
        if (this.attackIndex == 4) { this.isAlerting = true, this.speed = 0; return }
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

    getAnimationFrame(timer, animateSpeed) {
        this[timer] = (this[timer] || 0) + 1;
        if (this[timer] % animateSpeed !== 0) {
            return this.newFrame = false
        }
        this.newFrame = true;
        this.currentAnimationFrame = (this[timer] / animateSpeed);
    }

    setCurrentImage(imagesToUse) {
        let path = imagesToUse[this.currentAnimationFrame];
        if (path) this.img = this.imageCache[path];
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
        if (this.isAlerting && (this.currentAnimationFrame == 1 || this.currentAnimationFrame == 4))
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
        this.setCurrentImage(this.hurtImages)
        if (this.currentAnimationFrame == this.hurtImages.length - 1) {
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