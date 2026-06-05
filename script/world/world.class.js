/**
 * Core orchestrator class of the game engine.
 * Manages the main game loop (fixed delta-time 60 FPS), input distribution, object spawning, 
 * multi-layered parallax backgrounds, complex AABB/Attack-box collision pipelines, and comprehensive status updates.
 */
class World {
    /** @type {number} Timestamp marking when the last evaluated frame was processed. */
    lastFrameTime = 0;

    /** @type {number} Target time allocation window per single frame iteration in milliseconds (~16.67ms). */
    fpsInterval = 1000 / 60;

    /** @type {HTMLCanvasElement} Direct DOM reference to the active rendering HTML canvas element. */
    canvas;

    /** @type {CanvasRenderingContext2D} Secondary structural canvas interface context handle for drawing commands. */
    ctx;

    /** @type {Character} Reference to the primary controllable player character entity. */
    character;

    /** @type {Background[]} Collection list containing instantiated multi-layered parallax backgrounds. */
    backgrounds = [];

    /** @type {Object} Hardware keyboard state observer interface processing user key down events. */
    keyboard;

    /** @type {number} Horizontal display offset modifier aligning active object positions with character movement. */
    cameraOffset = 0;

    /** @type {number} Tracking pointer defining the sequential X-coordinate for upcoming tile setups. */
    nextTileX = 0;

    /** * @type {Array<{name: string, parallax: number}>} 
     * Directory path mapping array configuring individual background image asset keys and separate layer parallax speeds.
     */
    layerPaths = [
        { name: '3_third_layer', parallax: 0.2 },
        { name: '2_second_layer', parallax: 0.5 },
        { name: '1_first_layer', parallax: 1.0 }
    ];

    /** @type {DrawableObject[]} General runtime storage collecting active thrown items and physics projectiles. */
    throwableObjects = [];

    /** @type {CollectableBottle[]} Dynamic collection tracking spawned ammunition bottles present on terrain. */
    collectableBottles = [];

    /** @type {CollectibleGoldNuggets[]} Dynamic collection tracking collectable score items scattered across the board. */
    collectableNuggets = [];

    /** @type {BackgroundRocks[]} Structural scenery list containing layout obstacles and interactive elements. */
    backgroundRocks = [];

    /** @type {Chicken[]|BossChicken[]} Master processing entity array housing all active enemies and bosses. */
    enemies = [];

    /** @type {number} Standard pixel floor level defining baseline placement rules. Default is 404. */
    groundLevel = 404;

    /** @type {number} Fixed canvas logic width sizing value in pixels. Default is 960. */
    WIDTH = 960;

    /** @type {number} Fixed canvas logic height sizing value in pixels. Default is 540. */
    HEIGHT = 540;

    /** @type {number} Absolute length pixel width definition of a standalone environmental background slice. */
    TILE_WIDTH = 1920;

    /** @type {IconBar} Top-left screen interface overlay element depicting user health points. */
    healthBar = new IconBar(20, 20, 'img/7_statusbars/3_icons/icon_health.png');

    /** @type {IconBar} Interface item tracker element depicting current player projectile storage stocks. */
    bottleBar = new IconBar(20, 70, 'img/7_statusbars/3_icons/45_bottle_rotation.png');

    /** @type {IconBar} Score and currency indicator interface panel counting picked up gold. */
    goldBar = new IconBar(20, 120, 'img/7_statusbars/3_icons/nugget1.png');

    /** @type {number|null} Animation callback cancellation token tracking active game loop requests. */
    animationFrameId = null;

    /** @type {Clouds} Dynamic weather overlay module managing moving cloud objects across upper screen limits. */
    clouds;

    /** @type {levelOne} Active structural script manager setting up wave progressions and pacing configurations. */
    level;

    /** @type {boolean} Core lifecycle breaker switch immediately freezing updates upon termination calls. */
    gameStopped;

    /**
     * Creates an instance of World.
     * Sets up canvas dimension footprints, contexts, and starts up initialization structures.
     * @param {HTMLCanvasElement} canvas - HTML graphic rendering canvas layer hook.
     * @param {Object} keyboard - Active listener monitoring hardware control logs.
     */
    constructor(canvas, keyboard) {
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.fpsInterval = 1000 / 60;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.initializeWorld();
    }

    /**
     * Sets up initial game configurations, builds up the level architecture, preloads backgrounds,
     * fills up initial item spawns, and activates the primary gameloop thread.
     */
    initializeWorld() {
        this.character = new Character(this);
        this.backgrounds = this.layerPaths.map(layer => {
            let bg = new Background(
                `img/5_background/layers/${layer.name}/full.png`,
                layer.parallax
            );
            return bg;
        });
        this.clouds = new Clouds(this.WIDTH, this.HEIGHT);
        this.spawnBottles();
        this.spawnRocks();
        this.level = new levelOne(this);
        this.lastFrameTime = 0;
        this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Populates the map layout with collectible ammunition objects distributed via staggered, randomized formulas.
     */
    spawnBottles() {
        for (let i = 0; i < 5; i++) {
            let xBottlePos = 400 + Math.random() * 400 + i * 1200;
            this.collectableBottles.push(new CollectableBottle(xBottlePos, this.groundLevel));
        }
    }

    /**
     * Populates the level scene with physical landscape rocks and hooks secondary 
     * randomized gold nugget spawns directly onto their calculated offset positions.
     */
    spawnRocks() {
        for (let i = 0; i < 11; i++) {
            let xRockPos = 200 + Math.random() * 400 + i * 500;
            let randomType = Math.floor(Math.random() * 3) + 1;
            let rock = new BackgroundRocks(xRockPos, this.groundLevel, randomType);
            this.backgroundRocks.push(rock);
            if (Math.random() < 0.5) {
                let nuggetX = rock.x + rock.nuggetOffset.x;
                let nuggetY = rock.y + rock.nuggetOffset.y;
                this.collectableNuggets.push(new CollectibleGoldNuggets(nuggetX, nuggetY));
            }
        }
    }

    /**
     * Primary game loop handling frame pacing. Ensures structural logic blocks and canvas drawing ticks execution
     * are synchronized against the targeted 60 FPS interval while validating active menu overlays.
     * @param {number} time - High-resolution timestamp provided by the requestAnimationFrame pipeline.
     */
    gameLoop(time) {
        if (this.gameStopped) return;
        if (!this.lastFrameTime) {
            this.lastFrameTime = time;
        }
        let elapsed = time - this.lastFrameTime;
        if (elapsed >= this.fpsInterval) {
            this.lastFrameTime = time - (elapsed % this.fpsInterval);
            this.limitFrames(time);
            if (!settingsWoodSign && !controlsWoodSign && !soundsWoodSign) {
                this.update();
                this.draw();
            }
        }
        this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Centralized execution hub updating state engines, tracking input fields, adjusting 
     * tracking cameras, computing multi-tier collisions, and checking collection updates.
     */
    update() {
        this.getKeyboardInput();
        this.moveMovableObjects();
        this.cameraOffset = 150 - this.character.x;
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkCollection(this.collectableBottles, () => this.character.bottleInventory++);
        this.checkCollection(this.collectableNuggets, () => this.character.nuggets++);
        this.updateStatusBars();
        this.level.spawnWaves();
        this.cleanUpObjects();
    }

    /**
     * Maps active boolean keystroke properties to concrete state changes on the player character instance.
     */
    getKeyboardInput() {
        if (this.keyboard.right) this.character.moveRight();
        else if (this.keyboard.left) this.character.moveLeft();
        else this.character.stopWalking();
        if (this.keyboard.up) this.character.jump();
        if (this.keyboard.attack) this.character.attack();
        if (this.keyboard.throw) this.character.throwBottle();
    }

    /**
     * Dynamic getter grouping the player character, enemies, and airborne projectiles into a combined array.
     * @readonly
     * @type {DrawableObject[]} Array containing all dynamic elements that process movement and logic loops.
     */
    get allMovableObjects() {
        return [
            this.character,
            ...this.enemies,
            ...this.throwableObjects
        ];
    }

    /**
     * Iterates through all dynamic movable objects to step through their custom spatial movement routines and updates cloud positions.
     */
    moveMovableObjects() {
        this.allMovableObjects.forEach(obj => {
            obj.animateObject()
        });
        this.clouds.moveClouds();
    }

    /**
     * Syncs numerical attributes from the player state container into the corresponding graphic screen bars.
     */
    updateStatusBars() {
        this.healthBar.count = this.character.health;
        this.bottleBar.count = this.character.bottleInventory;
        this.goldBar.count = this.character.nuggets;
    }


    /**
     * Checks projectile request states to safely instantiate thrown bottle objects based on character flags.
     */
    checkThrowObjects() {
        if (this.keyboard.throw && !this.character.isThrowing && !this.character.isJumping) {
            this.character.throwBottle();
            this.keyboard.throw = false;
        }
    }

    /**
     * Exhaustive verification loop validating interaction intersections between objects 
     * (e.g. character attacks vs enemies, enemy impact vs player, bottle splashes, boss egg crashes).
     */
    checkCollisions() {
        this.enemies.forEach((enemy) => {
            if (enemy.isDead) return;
            if (this.character.hasAttacked) {
                if (this.checkAttackCollision(this.character, enemy)) {
                    this.dealDamage(enemy)
                }
            }
            if (this.character.isColliding(enemy) && !this.character.invincibility) {
                this.character.recieveDamage();
            }
            if (enemy instanceof BossChicken && enemy.hasAttacked) {
                if (this.checkAttackCollision(enemy, this.character)) {
                    if (!this.character.invincibility) {
                        this.character.recieveDamage()
                    }
                }
            }
            this.throwableObjects.forEach(obj => {
                if (obj instanceof SalsaBottle) {
                    if (obj.isColliding(enemy) && !obj.isSplashing) {
                        this.dealDamage(enemy);
                        obj.isSplashing = true;
                    }
                }
                if (obj instanceof BossEgg) {
                    if (obj.isColliding(this.character) && !obj.isSplashing) {
                        this.character.recieveDamage();
                        obj.isSplashing = true;
                    }
                }
            });
        });
    }

    /**
     * Detailed intersection test measuring an attacker's offensive hit box metrics 
     * against a target receiver's padded structural boundary limits.
     * @param {DrawableObject} attacker - Entity initiating the offensive hitbox challenge.
     * @param {DrawableObject} recipient - Target entity processing incoming collision sweeps.
     * @returns {boolean} True if the calculated offensive box overlaps the recipient's boundary framework.
     */
    checkAttackCollision(attacker, recipient) {
        let box = attacker.attackBox;
        return (box.x + box.width > recipient.x + recipient.collisionOffset.left &&
            box.y + box.height > recipient.y + recipient.collisionOffset.top &&
            box.x < recipient.x + recipient.width - recipient.collisionOffset.right &&
            box.y < recipient.y + recipient.height - recipient.collisionOffset.bottom);
    }

    /**
     * Deducts health pools from targeted entities. Manages unique damage hooks, trigger sound setups, 
     * and manages transitions for the final boss state system.
     * @param {Chicken|BossChicken} enemy - Target enemy entity experiencing health point point deduction.
     */
    dealDamage(enemy) {
        if (enemy.isDead || enemy.gotDamaged) return;
        enemy.health -= 1;
        if (enemy.health <= 0) {
            chickenDeadSound.play();
            enemy.isDead = true;
        }
        if (enemy instanceof BossChicken) {
            if (enemy.health <= 0) {
                enemy.isHurt = false;
                enemy.animationTimer = 0;
                enemy.currentAnimationFrame = 0;
            } else {
                enemy.gotDamaged = true;
                bossChickenDamageSound.play();
            }
            enemy.checkAnimation();
        }
    }

    /**
     * Generic collision handler verifying character overlap against specific array item pools 
     * to update inventories and splice collected objects away.
     * @param {DrawableObject[]} items - Array registry full of collectable structural map assets.
     * @param {Function} putToInventory - Trigger callback adjusting internal player balance stats.
     */
    checkCollection(items, putToInventory) {
        items.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                collectSound.currentTime = 0;
                collectSound.play();
                putToInventory();
                items.splice(index, 1);
            }
        });
    }

    /**
     * Garbage collection module filtering out dead, spent, or trailing background entities 
     * that moved too far past the screen view window limits.
     */
    cleanUpObjects() {
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.isGone);
        this.enemies = this.enemies.filter(enemy => {
            let isOffScreenLeft = enemy.x < this.character.x - this.WIDTH * 3;
            return !enemy.isGone && !isOffScreenLeft;
        });
    }

    /**
     * Primary rendering pipeline handler clearing out stale frame screens, 
     * and redrawing static setups, parallax environments, moving layers, and UI overlays.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.drawBackgroundObjects();
        this.drawMovableObjects();
        this.drawStatusBars();
    }

    /**
     * Aggregates background components, scenery rocks, clouds, and collectible items into a unified sequence.
     * @readonly
     * @type {DrawableObject[]} Comprehensive array listing all passive and environmental graphic components.
     */
    get allBackgroundObjects() {
        return [
            ...this.backgrounds,
            ...this.backgroundRocks,
            this.clouds,
            ...this.collectableNuggets,
            ...this.collectableBottles
        ];
    }

    /**
     * Iterates through the background elements collection to draw textures adjusted for the current camera position.
     */
    drawBackgroundObjects() {
        this.allBackgroundObjects.forEach(bg => {
            bg.drawManual(this.ctx, this.cameraOffset);
        });
    }

    /**
     * Iterates through dynamic movable actors to draw their current frames, and appends debugging 
     * hitbox outlines when debug mode flags are activated.
     */
    drawMovableObjects() {
        this.allMovableObjects.forEach(obj => {
            obj.drawManual(this.ctx, this.cameraOffset);
            if (debugMode) {
                obj.drawHitbox(this.ctx, this.cameraOffset);
                obj.drawAttackBox(this.ctx, this.cameraOffset);
            }
        });
    }

    /**
     * Renders primary status screens, inventory count bars, and conditionally displays 
     * boss monster health frames based on level wave triggers.
     */
    drawStatusBars() {
        this.healthBar.draw(this.ctx);
        this.bottleBar.draw(this.ctx);
        this.goldBar.draw(this.ctx);
        if (this.level.bossWave) {
            this.level.bossHealthBar.draw(this.ctx, this.level.boss.health, 20);
        }
    }

    /**
     * Shuts down engine lifecycles, switches off operational loop flags, and disposes active animation handles.
     */
    stopGame() {
        this.gameStopped = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Safety delta check modifying structural system timers to clamp operational speeds down to target rate values.
     * @param {number} currentTime - High resolution loop timestamp component.
     */
    limitFrames(currentTime) {
        const elapsed = currentTime - this.lastFrameTime;
        if (elapsed >= this.fpsInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.fpsInterval);
        }
    }
}