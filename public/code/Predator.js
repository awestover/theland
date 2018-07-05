// this can eat stuff
class Predator extends Animal
{
  constructor(animal_traits, sketch)
  {
    super(animal_traits, sketch);
    this.type="predators";
    for (let stat in predator_stats[this.name]) {
      this[stat] = animal_traits[stat] || predator_stats[this.name][stat];
    }

    this.vel = this.randomHeading(this.speed);
    this.health = animal_traits["health"] || Math.floor((2*Math.random()+1)*100);
    this.sightR = animal_traits["sightR"] || Math.floor(Math.random()*500+150);
    this.dims=[75,100];
  }

  show(sketch)
  {
    super.show(sketch);
    sketch.noFill();
    sketch.stroke(0,0,0);
    sketch.ellipse(this.pos[0]+this.dims[0]/2, this.pos[1]+this.dims[1]/2, this.sightR*2, this.sightR*2);
  }

  handleCollide(otherAnimal)
  {
    if (this.health <= 0 || otherAnimal.health <=0)
    {
      return false;
    }
    if (otherAnimal.type == "personals")
    {
      let deltaH = otherAnimal.interact(this);
      this.health += deltaH;
      if (this.health <= 0)
      {
        let data = {
          "world": this.world,
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
    return -this.power;
  }
}
