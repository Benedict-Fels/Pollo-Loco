
class levelOne {

    constructor() {
    }

    checkFirstMovement() {
        if (this.world.character.movingDirection !== 0 && !this.world.character.isPlaying) {
            this.world.character.isPlaying = true;
            this.startWave1();
        }
    }

    startBossWave() {
        let xPos = -this.world.cameraOffset + this.world.WIDTH;
        let boss = new BossChicken(xPos);
        this.world.enemies.push(boss);
        boss.world = this.world;
        this.bossWave = true;
    }

    startWave1() {
        for (let i = 0; i < 4; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + (i * 500);
            this.world.enemies.push(new Chicken(xPos));
        }
    }

    startWave2() {
        for (let i = 0; i < 8; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 200;
            this.world.enemies.push(new Chicken(xPos));
        }
        this.wave2 = true;
    }

    startWave3() {
        for (let i = 0; i < 8; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 100;
            let speed = 2 + 4 * Math.random();
            this.world.enemies.push(new Chicken(xPos, speed));
        }
        this.wave3 = true;
    }

    startWave4() {
        for (let i = 0; i < 4; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 100;
            let speed = 1 + 6 * Math.random();
            this.world.enemies.push(new Chicken(xPos, speed));
        }
        this.wave4 = true;
    }

    spawnChicken() {
        let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400;
        let speed = 3;
        this.world.enemies.push(new Chicken(xPos, speed));
    }

    update() {
        this.checkFirstMovement();
        if (this.world.character.x > 2000 && !this.wave2) this.startWave2();
        if (this.world.character.x > 3500 && !this.wave3) this.startWave3();
        if (this.world.character.x > 5000 && !this.wave4) this.startWave4();
        if (this.world.character.x > 6000 && !this.bossWave) this.startBossWave();
    }
}