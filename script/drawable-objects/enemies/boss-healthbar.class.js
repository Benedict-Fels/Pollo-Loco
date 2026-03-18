
class BossHealthBar {
    width = 300;
    height = 30;
    x = ((960 / 2)) - (300 / 2);
    y = 60;

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