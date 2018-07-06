// the animals have to eat this to stay alive. The predators can eat this to fufill their food quota
class Prey extends Animal
{
  constructor(animal_traits, sketch)
  {
    super(animal_traits, sketch);

    this.type = "preys";
    for (let stat in prey_stats[this.name]) {
      this[stat] = animal_traits[stat] || prey_stats[this.name][stat];
    }

    this.vel = this.randomHeading(this.speed);
    this.dims = [30,30];
  }

  handleCollide(otherAnimal, sketch)
  {
    if (this.health <=0 || otherAnimal.health <=0)
    {
      return false;
    }

    if (otherAnimal.type != "preys")
    {
      let deltaH = otherAnimal.interact(this);
      this.health += deltaH;
    }

    // you were alive, now you are dead
    if (this.health <= 0)
    {
      let data = {
        "world": this.world,
        "animal": otherAnimal,
        "type": "preys"
      };
      console.log(this.world);
      socket.emit('deathAlert', data);
    }

    return true;
  }

  interact()
  {
    return this.help;
  }

}
