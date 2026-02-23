
class levelOne extends level {



    constructor() {
        super();
    }

    spawnChicken() {
        let chicken = new Chicken(this.cameraOffset + this.WIDTH, this.y);
        // this.chicken.world = this.world;
        this.world.enemies.push(chicken);
        this.world.chicken.chickenAnimation();
        this.world.chicken.moveChicken(this.cameraOffset);
    }
}