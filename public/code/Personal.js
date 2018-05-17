// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="personals";

    // important statistics, change later
    this.sickPr = animal_traits["sickPr"] || 0.001;//0;
    this.rebirthPr = animal_traits["rebirthPr"] || 0.001;//0;
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

  attack()
  {
    // for now... kinda stupid to be honest though
    if(this.health > 0)
    {
      return this.strength;
    }
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

    //current reward system is trash
    if (otherAnimal.health <= 0)
    {
      return false;
    }

    // later apply damage buffer?
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
      if (otherAnimal.type == "personals")
      {
        let damage = otherAnimal.attack();
        if (!damage)
        {
          damage = 0;
        }
        this.health -= damage;

        // this is kind of really stupid
        user.triggerReward(rewards["personals"]);
      }
      else if (otherAnimal.type == "preys")
      {
        let help = otherAnimal.boost();
        if (!help)
        {
          help = 0;
        }
        this.health += help;
      }
      else if (otherAnimal.type == "predators")
      {
        let damage = otherAnimal.eat();
        if (!damage)
        {
          damage = 0;
        }
        this.health -= damage;

        // this is kind of really stupid
        user.triggerReward(rewards["predators"]);
      }
    }
    return true;

  }

}
