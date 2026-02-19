class KeyboardInput {
    right = false;
    left = false;
    up = false;
    down = false;

    constructor() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        document.addEventListener('mousedown', (e) => this.handleLeftMouseDown(e));
        document.addEventListener('mouseup', (e) => this.handleLeftMouseUp(e));
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = true;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') this.up = true;
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = false;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') this.up = false;
    }

    handleLeftMouseDown(e) {
        if (e.button === 0) {
            this.attack = true;
        }
    }

    handleLeftMouseUp(e) {
        if (e.button === 0) {
            this.attack = false;
        }
    }
}
