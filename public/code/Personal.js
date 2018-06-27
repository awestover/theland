
// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);

    this.type="personals";
    for (let stat in personal_stats[this.name]) {
      this[stat] = animal_traits[stat] || personal_stats[this.name][stat];
    }

    this.age = animal_traits["age"] || 0;
    this.hunger = animal_traits["hunger"] || 0;
    this.vel = animal_traits["vel"] || super.randomHeading(this.speed);
    this.dims = [66, 50];
  }

  isHungry()
  {
    return (this.hunger > Math.floor(this.deadHunger/2));
  }

  healthAffects()
  {
    let fAge = 0.4;
    let ptemp = (fAge - Math.abs(this.age - fAge));

    this.health += ptemp * 0.025;
    this.speed +=  ptemp * 0.005;
    this.speed = Math.max(0.6, this.speed); // not negative

  }

  show()
  {
    super.show();
    this.healthAffects();
    this.hunger += this.dHunger;
    this.age += this.dAge;
  }

  sickDamage()
  {
    if (this.sickPr > random())
    {
      this.health = 0;
      // this.health = Math.floor(this.health/4);
    }
  }

  hasOffspring()
  {
    if (this.rebirthPr > Math.random())
    {
      return {"pos":this.pos.slice()};
    }
    return false;
  }

  interact()
  {
      return -this.strength;
  }

  levelUp()
  {
    this.level += 1;
    this.strength += 0.5;
    this.health += 5;
    this.deadHunger += 1;
    this.speed += 0.5;
    this.image = this.getImg();
  }

  handleCollide(otherAnimal)
  {
    if (otherAnimal.health <= 0 || this.health <=0)
    {
      return false;
    }

    if (otherAnimal.username == this.username && otherAnimal.type=="personals")
    {
      this.getRepulsed(otherAnimal.pos, otherAnimal.dims);
      if (this.level < max_lvls["personals"])
      {
        if (this.levelUpPr > random())
        {
          this.levelUp();
        }
      }
    }
    else if (otherAnimal.type == "personals" || otherAnimal.type == "predators"){
      let deltaH = otherAnimal.interact();
      this.health += deltaH;
    }
    else if (otherAnimal.type = "preys"){
      let deltas = otherAnimal.interact();
      for (let i in deltas)
      {
        this[i] += deltas[i];
      }
      this.hunger = Math.max(0, this.hunger);
    }
    if (this.health <=0)
    {
      let data = {
        "world": user.world,
        "animal": otherAnimal,
        "type": "personals"
      }
      socket.emit('deathAlert', data);
    }
    return true;
  }

  inUserTerritory()
  {
    if (!this.visitedUserTerritory)
    {
      this.visitedUserTerritory = true;
      this.strength *= 2;
    }
  }

  shouldDie()
  {
    if (super.shouldDie())
    {
      return true;
    }
    else if (this.hunger >= this.deadHunger)
    {
      return true;
    }
    return false;
  }

  doFeed()
  {
    this.hunger = Math.max(0, this.hunger-1);
  }

}
