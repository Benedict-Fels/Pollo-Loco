/**
 * Class managing progression, wave mechanics, and enemy spawning triggers for the first level.
 * Monitors the player character's spatial coordinates to dynamically deploy sequential enemy waves
 * and instantiate the final boss encounter.
 */
class levelOne {
    /** @type {World} Reference to the main game world instance to access entities and camera data. */
    world;

    /** @type {boolean} Flag tracking if the second wave has been deployed. */
    wave2;

    /** @type {boolean} Flag tracking if the third wave has been deployed. */
    wave3;

    /** @type {boolean} Flag tracking if the fourth wave has been deployed. */
    wave4;

    /** @type {boolean} State flag indicating if the final boss wave is active. */
    bossWave;

    /** @type {BossChicken} Reference to the spawned final boss instance. */
    boss;

    /** @type {BossHealthBar} Reference to the dedicated UI status bar tracking the boss's health. */
    bossHealthBar;

    /**
     * Creates an instance of levelOne.
     * @param {World} world - The main game world context instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks for the player's initial input to trigger the start of the first wave
     * and transition the game state into active gameplay.
     */
    checkFirstMovement() {
        if (this.world.character.movingDirection !== 0 && !this.world.character.isPlaying) {
            this.world.character.isPlaying = true;
            this.startWave1();
            // this.startBossWave();
        }
    }

    /**
     * Instantiates the final Boss Chicken encounter just outside the viewport,
     * registers it in the active enemy collection, and initializes the boss UI.
     */
    startBossWave() {
        let xPos = -this.world.cameraOffset + this.world.WIDTH;
        this.boss = new BossChicken(this.world, xPos);
        this.world.enemies.push(this.boss);
        this.boss.world = this.world;
        this.bossWave = true;
        this.bossHealthBar = new BossHealthBar();
    }

    /**
     * Deploys the initial wave of 4 standard chickens with fixed spacing intervals.
     */
    startWave1() {
        for (let i = 0; i < 4; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + (i * 500);
            this.world.enemies.push(new Chicken(xPos));
        }
    }

    /**
     * Deploys the second wave consisting of 8 standard chickens, 
     * utilizing randomized horizontal offsets for unpredictable cluster formations.
     */
    startWave2() {
        for (let i = 0; i < 8; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 200;
            this.world.enemies.push(new Chicken(xPos));
        }
        this.wave2 = true;
    }

    /**
     * Deploys the third wave consisting of 8 chickens with randomized 
     * horizontal offsets and randomized individual movement speeds.
     */
    startWave3() {
        for (let i = 0; i < 8; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 200;
            let speed = 1.5 + 3 * Math.random();
            this.world.enemies.push(new Chicken(xPos, speed));
        }
        this.wave3 = true;
    }

    /**
     * Deploys the fourth wave consisting of 4 chickens configured with highly volatile, 
     * randomized individual velocity values.
     */
    startWave4() {
        for (let i = 0; i < 4; i++) {
            let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400 + i * 200;
            let speed = 1 + 4.5 * Math.random();
            this.world.enemies.push(new Chicken(xPos, speed));
        }
        this.wave4 = true;
    }

    /**
     * Spawns a single minion chicken at a randomized horizontal position just outside the view.
     * Typically invoked dynamically by external triggers (such as the boss's call action).
     */
    spawnChicken() {
        let xPos = -this.world.cameraOffset + this.world.WIDTH + Math.random() * 400;
        let speed = 2 + 2 * Math.random();
        this.world.enemies.push(new Chicken(xPos, speed));
    }

    /**
     * Primary tick monitor evaluating the character's progress on the X-axis 
     * to trigger game progression phases and transition waves sequentially.
     */
    spawnWaves() {
        this.checkFirstMovement();
        if (this.world.character.x > 2000 && !this.wave2) this.startWave2();
        if (this.world.character.x > 3500 && !this.wave3) this.startWave3();
        if (this.world.character.x > 5000 && !this.wave4) this.startWave4();
        if (this.world.character.x > 6000 && !this.bossWave) this.startBossWave();
    }
}