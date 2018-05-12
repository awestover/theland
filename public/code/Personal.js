// the user controlled animals
class Personal extends Animal
{
  constructor(animal_traits)
  {
    super(animal_traits);

    // identification
    this.username = animal_traits["username"] || "NPC";

    // important statistics, change later
    this.level = animal_traits["level"] || 1;
    this.sickPr = animal_traits["sickPr"] || 0.002;
    this.rebirthPr = animal_traits["rebirthPr"] || 0.002;
    this.strength = animal_traits["strength"] || 1;
    this.speed = animal_traits["speed"] || 1.3;
    this.levelUpPr = animal_traits["levelUpPr"] || 0.002;

    this.vel = this.randomHeading();
    this.scaleVel(this.speed);
    this.image = this.getImg();

    this.dims = [66, 50];
  }

  getImg()
  {
    try{
      return animal_pictures[this.name+this.level];
    }
    catch(err)
    {
      console.log(err);
      return false;
    }
  }

  possibleOffspring()
  {
    let result = false;
    if (this.rebirthPr > Math.random())
    {
      result = this.createOffspring();
    }
    return result;
  }

  show()
  {
    fill(200, 50, 50);
    // health bar
    rect(this.pos[0], this.pos[1],5*this.health, 10);
    try
    {
      image(this.image, this.pos[0], this.pos[1], this.image.width, this.image.height);
    }
    catch(err)
    {
      ellipse(this.pos[0], this.pos[1], 10, 10);
    }
  }

  // later you should have animals have traits that kind of mutate and get passed down.
  createOffspring()
  {
    let newAnimal = new Personal({"pos":this.pos, "name":this.name, "username":this.username});
    newAnimal.addPos([3*random(), 3*random()]);
    return newAnimal;
  }

  pushMotion(location)
  {
    let deltaV = [-this.pos[0]-location[0]-this.dims[0]/2, -this.pos[1]-location[1]-this.dims[1]/2];
    let cMag = magv(deltaV);
    if (cMag>50)
    {
      deltaV = vecScalarMult(deltaV, 2.5*this.speed/cMag);
      this.vel = deltaV;
      this.addPos(deltaV);
    }
    this.move();
  }

  move()
  {
    var th = (Math.random()-0.5)*0.9;
    if (Math.random() < 0.5) {
      th = 0;
    }
    var nx = this.vel[0]*Math.cos(th) - this.vel[1]*Math.sin(th);
    var ny = this.vel[0]*Math.sin(th) + this.vel[1]*Math.cos(th);

    this.vel = [nx, ny];
    this.addPos(this.vel); // *dt

  }

  attack()
  {
    // for now... kinda stupid to be honest though
    if(this.health > 0)
    {
      return this.strength;
    }
  }

  shouldDie()
  {
    if (this.health <=0)
    {
      return true;
      // console.log("death death");
    }
    else if (violateEdge(this.getBox()))
    {
      return true;
      // console.log("edge death");
    }
    else {
      if (this.sickPr > random())
      {
        // console.log("random death");
        return true;
      }
      else {
        return false;
      }
    }
  }

  levelUp()
  {
    this.level += 1;
    // change other stats too later...
    this.health += 5;
    this.image = this.getImg();
  }

  handleCollide(otherAnimal)
  {
    // later will vary for predator prey personal etc
    // later apply damage buffer?
    // if ("NPC")?
    if (otherAnimal.username == this.username)
    {
      if (this.level < max_lvl)
      {
        if (this.levelUpPr > random())
        {
          this.levelUp();
        }
      }
    }
    else {
      let damage = otherAnimal.attack();
      if (!damage || otherAnimal.health == 0)
      {
        damage = 0;
      }
      this.health -= damage;
      // console.log(this.username == otherAnimal.username);
      // console.log(this.username + " " + otherAnimal.username);
    }
  }

}
