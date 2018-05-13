// this can eat stuff
class Predator extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="predators";
  }

  show()
  {
    super.pStats();
    super.show();
  }
}
