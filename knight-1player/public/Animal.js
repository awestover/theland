function Animal(animal_traits)
{
  this.pos = animal_traits["pos"];
  this.name = animal_traits["name"];
  this.level = 1;

  var thInit = Math.random()*Math.PI*2;
  var xv = Math.cos(thInit);
  var yv = Math.sin(thInit);
  this.vel = [xv, yv];
  this.image=this.getImg();
}

Animal.prototype.getImg = function()
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

Animal.prototype.show = function()
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

Animal.prototype.getPos = function()
{
  return this.pos;
}

Animal.prototype.getDims = function()
{
  // should be same as animal_size
  return [this.image.width, this.image.height];
}

Animal.prototype.addPos = function(apos)
{
  this.pos[0] += apos[0];
  this.pos[1] += apos[1];
}

Animal.prototype.subPos = function(apos)
{
  this.pos[0] -= apos[0];
  this.pos[1] -= apos[1];
}


Animal.prototype.move = function()
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
