// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="personals";

    // important statistics, change later
    this.sickPr = animal_traits["sickPr"] || 0.001;
    this.rebirthPr = animal_traits["rebirthPr"] || 0.0005;
    this.strength = animal_traits["strength"] || 1;
    this.speed = animal_traits["speed"] || 1.3;
    this.levelUpPr = animal_traits["levelUpPr"] || 0.0005;

    this.vel = super.randomHeading(this.speed);

    this.dims = [66, 50];

    this.deadHunger = 5;

    this.age = animal_traits["age"] || 0;
    this.hunger = animal_traits["age"] || 0;

    this.dHunger = 0.01;
    this.dAge = 0.01;
  }

  show()
  {
    super.show();
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
    // change other stats too later...
    this.health += 5;
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
      if (this.level < max_lvls["personals"])
      {
        if (this.levelUpPr > random())
        {
          this.levelUp();
        }
      }
    }
    else {
      let deltaH = otherAnimal.interact();
      this.health += deltaH;
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

}
