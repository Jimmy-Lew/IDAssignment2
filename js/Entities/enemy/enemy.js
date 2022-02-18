class Enemy {
    constructor(aName, aHealth, aFailureDamage, aConstantDamage, aAPICalls) {

        this.Name = aName;
        this.Health = aHealth;
        this.MaxHealth = aHealth;
        this.FailureDamage = aFailureDamage;
        this.ConstantDamage = aConstantDamage;
        this.APICalls = aAPICalls;
    }

    damage(damage) {
        this.Health -= damage;
        let remHealth = 1 - (this.Health / this.MaxHealth);
        $(".mana.fill .cover").css("height", `calc(clamp(24px, calc(24px + (140 - 24) * ((100vw - 320px) / (1800 - 320))), 140px) * ${remHealth})`);
    }
}