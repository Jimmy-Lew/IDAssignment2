class Enemy {
    constructor(aHealth, aFailureDamage, aConstantDamage, aAPICalls){

        this.Health = aHealth;
        this.FailureDamage = aFailureDamage;
        this.ConstantDamage = aConstantDamage;
        this.APICalls = aAPICalls;
    }

    damage(damage){
        this.Health -= damage;
    }
}