// this can eat stuff
class Predator extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="predators";
    this.power = animal_traits["power"] || 1;

    this.health = animal_traits["health"] || Math.floor((2*random()+1)*100);

    this.speed = animal_traits["speed"] || 1.5;
    this.vel = super.randomHeading(this.speed);

    this.name=animal_traits["name"] || "dino";
    this.dims=[75,100];
  }

  handleCollide(otherAnimal)
  {
    if (this.health <= 0 || otherAnimal.health <=0)
    {
      return false;
    }
    if (otherAnimal.type == "personals")
    {
      let deltaH = otherAnimal.interact();
      this.health += deltaH;
      if (this.health <= 0)
      {
        let data = {
          "world": user.world,
          "animal": otherAnimal,
          "reward": rewards["predators"]
        }
        socket.emit('deathAlert', data);
      }
    }
    return true;
  }

  interact()
  {
    return -this.power;
  }
}
