// this can eat stuff
class Predator extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="predators";
    this.power = animal_traits["power"] || 1;

    this.health = animal_traits["health"] || 100;

    this.speed = animal_traits["speed"] || 1.5;
    this.vel = super.randomHeading(this.speed);

    this.name=animal_traits["name"] || "dino";
    this.dims=[75,100];
  }

  handleCollide(otherAnimal)
  {
    if (otherAnimal.username == this.username)
    {
      return false;
    }

    if (otherAnimal.type == "personals")
    {
      let damage = otherAnimal.attack();
      if (!damage || otherAnimal.health == 0)
      {
        damage = 0;
      }
      this.health -= damage;
    }
    else if (otherAnimal.type == "preys")
    {
      console.log("Not sure yet what to do");
    }
    else if (otherAnimal.type == "predators")
    {
      console.log("I really Dunno man");
    }
    return true;
    
  }

  eat()
  {
    return this.power;
  }
}
