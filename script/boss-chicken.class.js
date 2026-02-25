
class BossChicken extends DrawableObject {
    direction = 'left';
    currentAnimationFrame = 0;
    chickenDistance = 0;
    health = 100;
    speed = 2;
    attackIndex = 1;
    isWalking = true;
    isStomping = false;
    isAlerting = false;
    isCallingChicken = false;
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
        this.y = 200;
        this.width = 300;
        this.height = 300;

        this.collisionOffset = { top: 70, left: 50, right: 50, bottom: 70 };
        this.loadImages(this.walkImages);
        this.loadImages(this.alertImages);
        this.loadImages(this.stompImages);
        this.loadImages(this.callChickenImages);
        this.loadImages(this.deadImages);
        this.imagesToUse = this.walkImages;
        this.img = this.imageCache[this.imagesToUse[0]];
        this.checkAnimation();
    }

    checkAnimation() {
        if (this.isStomping) {
            return this.imagesToUse = this.stompImages;
        } else if (this.isAlerting) {
            return this.imagesToUse = this.alertImages;
        } else if (this.isCallingChicken) {
            return this.imagesToUse = this.callChickenImages;
        } else if (this.isWalking) {
            return this.imagesToUse = this.walkImages;
        }
    }

    getAttackPattern() {
        this.attackIndex++;
        if (this.attackIndex == 7) this.attackIndex = 1;
        this.isAlerting = false, this.isWalking = false, this.isStomping = false, this.isCallingChicken = false;
        this.animationTimer = 0;
        this.currentAnimationFrame = 0;
        if (this.attackIndex % 2 !== 0) { this.isWalking = true, this.speed = 1; return }
        if (this.attackIndex == 2) { this.isAlerting = true, this.speed = 0; return }
        if (this.attackIndex == 4) { this.isStomping = true, this.speed = 1; return }
        if (this.attackIndex == 6) { this.isCallingChicken = true, this.speed = 0; return }
    }

    chickenAnimation() {
        if (this.isDead) {
            this.img = this.imageCache[this.deadImages];
            this.speed = 0;
            setTimeout(() => {
                this.isGone = true;
            }, 2000);
            return;
        }
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % 15 !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / 15));
        if (this.currentAnimationFrame == this.imagesToUse.length) {
            this.getAttackPattern();
            this.checkAnimation();
        }
        let path = this.imagesToUse[this.currentAnimationFrame];
        this.img = this.imageCache[path];
        if (this.isAlerting) {
            this.direction = 'right';
            if (this.currentAnimationFrame == 1 || this.currentAnimationFrame == 4) {
                this.shootEgg();
            }
        } else { this.direction = 'left' }
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

    drawManual(ctx, cameraOffset) {
    if (this.direction === 'right') {
        ctx.save();
        ctx.translate(this.x + cameraOffset + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    } else {
        ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
    }
}

    drawHitbox(ctx, cameraOffset) {
        ctx.beginPath();
        ctx.rect(this.x + this.collisionOffset.left + cameraOffset, this.y + this.collisionOffset.top,
            this.width - this.collisionOffset.left - this.collisionOffset.right,
            this.height - this.collisionOffset.top - this.collisionOffset.bottom);
        ctx.stroke();
    }

    recieveDamage() {
        this.isDead = true;
    }
}