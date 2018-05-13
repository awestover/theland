/*
Animal class

basic ideas for all animals

movement properties etc

*/

class Animal
{
  constructor(animal_traits)
  {
    // basic stats
    this.pos = animal_traits["pos"].slice() || [0,0];
    this.vel = [0, 0];
    this.name = animal_traits["name"] || "circle";
    this.health = animal_traits["health"] || 10;

    // identification
    this.username = animal_traits["username"] || "NPC";

    this.dims=[66,50];
    this.showStats = false;
  }

  pStats()
  {
    if (this.showStats)
    {
      text(this.name, this.pos[0], this.pos[1]);
    }
  }

  show()
  {
    fill(0,0,0);
    ellipse(this.pos[0], this.pos[1], 10, 10);
  }

  addPos(apos)
  {
    this.pos[0] += apos[0];
    this.pos[1] += apos[1];
  }

  subPos(apos)
  {
    this.pos[0] -= apos[0];
    this.pos[1] -= apos[1];
  }

  randomHeading()
  {
    let thInit = Math.random()*Math.PI*2;
    return [Math.cos(thInit), Math.sin(thInit)];
  }

  addVel(avel)
  {
    this.vel[0]+=avel[0];//*dt
    this.vel[1]+=avel[1];//*dt
  }

  scaleVel(k)
  {
    this.vel[0] *= k;
    this.vel[1] *= k;
  }

  velMag()
  {
    return Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  }

  getBox()
  {
    return [this.pos[0], this.pos[1], this.dims[0], this.dims[1]];
  }

}
