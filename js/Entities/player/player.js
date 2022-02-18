class Player {
    constructor(aHealth, aDamage) {

        this.Health = aHealth;
        this.MaxHealth = aHealth;
        this.Damage = aDamage;
    }

    damage(damage) {
        this.Health -= damage;
        let remHealth = 1 - (this.Health / this.MaxHealth);
        $(".health.fill .cover").css("height", `calc(clamp(24px, calc(24px + (140 - 24) * ((100vw - 320px) / (1800 - 320))), 140px) * ${remHealth})`);
    }
}