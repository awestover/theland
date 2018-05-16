// the animals have to eat this to stay alive. The predators can eat this to fufill their food quota
class Prey extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type = "preys";
    this.help = animal_traits["help"] || 1;

    this.name = animal_traits["name"] || "pizza"; // for now...
    this.dims=[30,30];
  }

  handleCollide(otherAnimal)
  {
    if (otherAnimal.type == "personals")
    {
      let damage = otherAnimal.attack();
      if (!damage || otherAnimal.health <= 0)
      {
        damage = 0;
      }
      this.health -= damage;
    }
    else if (otherAnimal.type == "preys")
    {
      console.log("NO I am serious this really should not happen");
    }
    else if (otherAnimal.type == "predators")
    {
      console.log("I really Dunno man");
    }
    return true;
  }

  boost()
  {
    return this.help;
  }

}
