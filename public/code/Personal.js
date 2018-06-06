// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="personals";

    // important statistics, change later
    this.sickPr = animal_traits["sickPr"] || 0; // no more!!
    this.rebirthPr = animal_traits["rebirthPr"] || 0.002;
    this.strength = animal_traits["strength"] || 1;
    this.speed = animal_traits["speed"] || 3;
    this.levelUpPr = animal_traits["levelUpPr"] || 0.0005;

    this.vel = super.randomHeading(this.speed);

    this.dims = [66, 50];

    this.deadHunger = 5;

    this.age = animal_traits["age"] || 0;
    this.hunger = animal_traits["hunger"] || 0;

    this.dHunger = animal_traits["dHunger"] || 0.018;
    this.dAge = animal_traits["dAge"] || 0.01;
  }

  isHungry()
  {
    return (this.hunger > Math.floor(this.deadHunger/2));
  }

  healthAffects()
  {
    let fAge = 1.4;
    let ptemp = (fAge - Math.abs(this.age - fAge));

    this.health += ptemp * 0.05;
    this.speed +=  ptemp * 0.01;
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
        "reward": rewards["personals"]
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
