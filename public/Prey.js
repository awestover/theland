// the animals have to eat this to stay alive. The predators can eat this to fufill their food quota
class Prey extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
  }

  // later you should have animals have traits that kind of mutate and get passed down.
  createOffspring()
  {
    let newAnimal = new Prey({"pos":this.pos, "name":this.name});
    newAnimal.addPos([3*random(), 3*random()]);
    return newAnimal;
  }
}
