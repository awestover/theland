/*
Animal class

basic ideas for all animals

movement properties etc

*/

class Animal
{
  constructor(animal_traits)
  {
    this.pos = animal_traits["pos"].slice();
    this.name = animal_traits["name"];
    this.level = 1;

    var thInit = Math.random()*Math.PI*2;
    var xv = Math.cos(thInit);
    var yv = Math.sin(thInit);
    this.vel = [xv, yv];
    this.image=this.getImg();
  }

  getImg()
  {
    let path = "pictures/";
    path += this.name;
    path += this.level;
    path += ".png";
    try {
      return loadImage(path);
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
    let offspringPr = 0.01;
    if (offspringPr > Math.random())
    {
      result = this.createOffspring();
    }
    return result;
  }

  show()
  {
    try
    {
      image(this.image, this.pos[0], this.pos[1], this.image.width, this.image.height);
    }
    catch(err)
    {
      ellipse(this.pos[0], this.pos[1], 10, 10);
    }
  }

  getPos()
  {
    return this.pos;
  }

  getDims()
  {
    // should be same as animal_size
    return [this.image.width, this.image.height];
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
    let newAnimal = new Animal({"pos":this.pos, "name":this.name});
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

}
