/**
 * Class representing a stylized user interface health bar for the boss enemy.
 * Renders a rounded background, a dynamic 3-color gradient health fill, a reflection overlay, and a text label.
 */
class BossHealthBar {
    /** @type {number} The maximum width of the health bar container in pixels. Default is 300. */
    width = 300;

    /** @type {number} The height of the health bar container in pixels. Default is 30. */
    height = 30;

    /** @type {number} The horizontal X-coordinate, centered based on a 960px baseline canvas width. */
    x = ((960 / 2)) - (300 / 2);

    /** @type {number} The vertical Y-coordinate layout position. Default is 60. */
    y = 60;

    /**
     * Renders the complete boss health bar interface onto the canvas.
     * Safely bypasses rendering if health values drop to or below zero.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} health - The current health points of the boss.
     * @param {number} maxHealth - The maximum health points of the boss.
     */
    draw(ctx, health, maxHealth) {
        if (health <= 0) return;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.fillStyle = "#333";
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.fill();
        ctx.shadowBlur = 0;
        let healthPercentage = Math.max(0, health / maxHealth);
        let barWidth = (this.width - 6) * healthPercentage;
        if (barWidth > 0) {
            let gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, "#ff4d4d");
            gradient.addColorStop(0.5, "#cc0000");
            gradient.addColorStop(1, "#800000");

            ctx.fillStyle = gradient;
            this.drawRoundedRect(ctx, this.x + 3, this.y + 3, barWidth, this.height - 6, 10);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.drawRoundedRect(ctx, this.x + 3, this.y + 3, barWidth, (this.height - 6) / 2, 8);
            ctx.fill();
        }
        ctx.font = "28px 'rye', Courier, monospace";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.strokeText("Pollo Loco", this.x + this.width / 2, this.y - 12);
        ctx.fillText("Pollo Loco", this.x + this.width / 2, this.y - 12);
        ctx.restore();
    }

    /**
     * Generates a rounded rectangle path template using quadratic curves on the canvas context.
     * Needs to be followed manually by a fill() or stroke() call.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} x - The starting X-coordinate position.
     * @param {number} y - The starting Y-coordinate position.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} radius - The corner radius value for the curvature smoothings.
     */
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}