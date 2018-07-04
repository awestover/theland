
// this can eat stuff, but won't eat everything
class Protector extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="protectors";
    for (let stat in protector_stats[this.name]) {
      this[stat] = animal_traits[stat] || protector_stats[this.name][stat];
    }

    this.vel = this.randomHeading(this.speed);
    this.health = animal_traits["health"] || Math.floor((2*random()+1)*200);
    this.dims=[75,100];
  }

  show()
  {
    super.show();
  }

  handleCollide(otherAnimal)
  {
    if (this.health <= 0 || otherAnimal.health <=0)
    {
      return false;
    }
    if (otherAnimal.type == "personals" && otherAnimal.username != this.username)
    {
      let deltaH = otherAnimal.interact(this);
      this.health += deltaH;
      if (this.health <= 0)
      {
        let data = {
          "world": user.world,
          "animal": otherAnimal,
          "type": "protectors"
        }
        socket.emit('deathAlert', data);
      }
    }
    return true;
  }

  interact(otherAnimal)
  {
    if (otherAnimal.username != this.username)
    {
      return -this.power;
    }
    else {
      return 0;
    }
  }
}
