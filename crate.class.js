
class Crate extends DrawableObject {
    health = 1;
    constructor(x, y) {
        super();
        this.loadImage('img/objects/crate.png');
        this.x = x;
        this.y = y; // Auf dem Boden
        this.width = 50;
        this.height = 50;
        this.collisionOffset = { top: 0, left: 0, right: 0, bottom: 0 };
    }
}