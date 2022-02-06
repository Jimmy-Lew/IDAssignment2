class Player {
    constructor(aHealth, aDamage){

        this.Health = aHealth;
        this.Damage = aDamage;
    }

    damage(damage) {
        this.Health -= damage;
    }
}