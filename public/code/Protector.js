// this can eat stuff, but won't eat everything



/*

Protector needs to be anchored to home, but can chase anything that comes into the base

smaller sigt radius

need pictures

*/


class Protector extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);
    this.type="protector";
    for (let stat in predator_stats[this.name]) {
      this[stat] = animal_traits[stat] || predator_stats[this.name][stat];
    }

    this.vel = this.randomHeading(this.speed);
    this.health = animal_traits["health"] || Math.floor((2*random()+1)*100);
    this.sightR = animal_traits["sightR"] || Math.floor(Math.random()*500+150);
    this.dims=[75,100];
  }

  show()
  {
    super.show();
    noFill();
    stroke(0,0,0);
    ellipse(this.pos[0]+this.dims[0]/2, this.pos[1]+this.dims[1]/2, this.sightR*2, this.sightR*2);
  }

  handleCollide(otherAnimal)
  {
    if (this.health <= 0 || otherAnimal.health <=0)
    {
      return false;
    }
    if (otherAnimal.type == "personals" && otherAnimal.username != this.username)
    {
      let deltaH = otherAnimal.interact();
      this.health += deltaH;
      if (this.health <= 0)
      {
        let data = {
          "world": user.world,
          "animal": otherAnimal,
          "type": "predators"
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
