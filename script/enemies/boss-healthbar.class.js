
class BossHealthBar {
    width = 300;
    height = 30;
    x = ((960 / 2)) - (300 / 2);
    y = 60;

    draw(ctx, health, maxHealth) {
        if (health <= 0) return;

        ctx.save();

        // 1. Äußerer Schatten (Glow-Effekt)
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

        // 2. Hintergrund (Dunkler Rahmen mit Rundung)
        ctx.fillStyle = "#333";
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.fill();

        // Schatten für den inneren Balken deaktivieren
        ctx.shadowBlur = 0;

        // 3. Der eigentliche Lebensbalken (mit Farbverlauf)
        let healthPercentage = Math.max(0, health / maxHealth);
        let barWidth = (this.width - 6) * healthPercentage;

        if (barWidth > 0) {
            // Farbverlauf von Dunkelrot zu Hellrot/Orange
            let gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, "#ff4d4d"); // Oben hell
            gradient.addColorStop(0.5, "#cc0000"); // Mitte rot
            gradient.addColorStop(1, "#800000"); // Unten dunkel

            ctx.fillStyle = gradient;
            this.drawRoundedRect(ctx, this.x + 3, this.y + 3, barWidth, this.height - 6, 10);
            ctx.fill();

            // 4. Glanzeffekt (Weißer Streifen oben im Balken)
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.drawRoundedRect(ctx, this.x + 3, this.y + 3, barWidth, (this.height - 6) / 2, 8);
            ctx.fill();
        }

        // 5. Boss-Name mit schickem Font
        ctx.font = "28px 'rye', Courier, monospace";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.strokeText("Pollo Loco", this.x + this.width / 2, this.y - 12);
        ctx.fillText("Pollo Loco", this.x + this.width / 2, this.y - 12);

        ctx.restore();
    }

    // Hilfsfunktion für abgerundete Rechtecke
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