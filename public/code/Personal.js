// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="personals";

    // important statistics, change later
    this.sickPr = animal_traits["sickPr"] || 0.001;
    this.rebirthPr = animal_traits["rebirthPr"] || 0.001;
    this.strength = animal_traits["strength"] || 1;
    this.speed = animal_traits["speed"] || 1.3;
    this.levelUpPr = animal_traits["levelUpPr"] || 0.002;

    this.vel = super.randomHeading(this.speed);

    this.dims = [66, 50];
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

  shouldDie()
  {
    if (this.health <=0)
    {
      return true;
    }
    else if (violateEdge(this.getBox()))
    {
      return true;
    }
    else {
      if (this.sickPr > random())
      {
        return true;
      }
    }
    return false;
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

}
