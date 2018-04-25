// the user controlled animals
class Personal extends Animal
{

  constructor(animal_traits)
  {
    super(animal_traits);
  }

  // later you should have animals have traits that kind of mutate and get passed down.
  createOffspring()
  {
    let newAnimal = new Personal({"pos":this.pos, "name":this.name});
    newAnimal.addPos([3*random(), 3*random()]);
    return newAnimal;
  }

}
