/**
 * Input controller class capturing physical hardware events.
 * Listens for keyboard keystrokes and canvas mouse actions, mapping them to 
 * standardized boolean state flags used by the game engine for character interaction.
 */
class KeyboardInput {
    /** @type {boolean} Flag tracking if the move-right command is active (ArrowRight, D). */
    right = false;

    /** @type {boolean} Flag tracking if the move-left command is active (ArrowLeft, A). */
    left = false;

    /** @type {boolean} Flag tracking if the jump command is active (ArrowUp, W, Spacebar). */
    up = false;

    /** @type {boolean} Flag tracking if the duck or move-down command is active. */
    down = false;

    /** @type {boolean} Flag tracking if the projectile throwing action is triggered (Q). */
    throw = false;

    /** @type {boolean} Flag tracking if the melee attack strike is triggered (E, Left Mouse Click). */
    attack = false;

    /** @type {HTMLCanvasElement} DOM element container target bound to capture contextual mouse click vectors. */
    canvas = document.getElementById('canvasID');

    /**
     * Creates an instance of KeyboardInput.
     * Hooks up event listeners globally to the document object model and locally to the rendering canvas framework.
     */
    constructor() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleLeftMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleLeftMouseUp(e));
    }

    /**
     * Evaluates hardware downstroke signatures to activate interaction behaviors 
     * or alter global system debugging parameters.
     * @param {KeyboardEvent} e - Contextual native hardware keyboard log event structure.
     */
    handleKeyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = true;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') this.up = true;
        if (e.key === 'q') this.throw = true;
        if (e.key === 'e') this.attack = true;
        if (e.key === 'b') {
            debugMode = !debugMode;
            console.log("Debug Mode is: " + debugMode);
        }
    }

    /**
     * Evaluates hardware key release signatures to clear active movement and action behaviors.
     * @param {KeyboardEvent} e - Contextual native hardware keyboard log event structure.
     */
    handleKeyUp(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = false;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') this.up = false;
        if (e.key === 'q') this.throw = false;
        if (e.key === 'e') this.attack = false;
    }

    /**
     * Intercepts pointing click actions to translate left-clicks into offensive attack triggers.
     * @param {MouseEvent} e - Native canvas bounding context mouse trigger structure.
     */
    handleLeftMouseDown(e) {
        if (e.button === 0) {
            this.attack = true;
        }
    }

    /**
     * Intercepts pointer releases to disengage offensive strike flags.
     * @param {MouseEvent} e - Native canvas bounding context mouse trigger structure.
     */
    handleLeftMouseUp(e) {
        if (e.button === 0) {
            this.attack = false;
        }
    }
}
