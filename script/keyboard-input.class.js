class KeyboardInput {
    right = false;
    left = false;
    up = false;
    down = false;

    constructor() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = true;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true;
        if (e.key === 'ArrowUp' || e.key === 'w') this.up = true;
        if (e.key === 'ArrowDown' || e.key === 's') this.down = true;
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = false;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false;
        if (e.key === 'ArrowUp' || e.key === 'w') this.up = false;
        if (e.key === 'ArrowDown' || e.key === 's') this.down = false;
    }
}
