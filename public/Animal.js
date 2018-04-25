/*
Animal class

basic ideas for all animals

movement properties etc

*/

class Animal
{
  constructor(animal_traits)
  {
    // identification
    this.pos = animal_traits["pos"].slice() || [0,0];
    this.name = animal_traits["name"] || "circle";
    this.username = animal_traits["username"] || "NPC";

    // important statistics, change later
    this.level = animal_traits["level"] || 1;
    this.health = animal_traits["health"] || 10;
    this.sickPr = animal_traits["sickPr"] || 0.001;
    this.rebirthPr = animal_traits["rebirthPr"] || 0.001;
    this.strength = animal_traits["strength"] || 1; // weakens with damage??? show indicator...

    this.vel = this.randomHeading();
    this.image = this.getImg();

    this.w = animal_size[0];//this.image.width;
    this.h = animal_size[1];//this.image.height;
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

  randomHeading()
  {
    let thInit = Math.random()*Math.PI*2;
    return [Math.cos(thInit), Math.sin(thInit)];
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

  // later you should have animals have traits that kind of mutate and get passed down.
  createOffspring()
  {
    let newAnimal = new Animal({"pos":this.pos, "name":this.name, "username":this.username});
    newAnimal.addPos([3*random(), 3*random()]);
    return newAnimal;
  }

  move()
  {
    var th = (Math.random()-0.5);
    if (Math.random() < 0.5) {
      th = 0;
    }
    var nx = this.vel[0]*Math.cos(th) - this.vel[1]*Math.sin(th);
    var ny = this.vel[0]*Math.sin(th) + this.vel[1]*Math.cos(th);

    this.vel = [nx, ny];
    this.pos = [this.pos[0] + nx, this.pos[1] + ny];

  }

  getBox()
  {
    return [this.pos[0], this.pos[1], this.w, this.h];
  }

  attack()
  {
    // for now...
    return this.strength;
  }

  shouldDie()
  {
    if (this.health <=0)
    {
      return true;
    }
    else {
      if (this.sickPr > random())
      {
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
        this.levelUp();
      }
    }
    else {
      this.health -= otherAnimal.attack();
      // console.log(this.username == otherAnimal.username);
      // console.log(this.username + " " + otherAnimal.username);
    }
  }

}
