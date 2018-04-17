function Animal(animal_traits)
{
  this.pos = animal_traits["pos"];

  var thInit = Math.random()*Math.PI*2;
  var xv = Math.cos(thInit);
  var yv = Math.sin(thInit);
  this.vel = [xv, yv];
  // this.name = animal_traits["name"];
  this.name="dog";
  this.image = false;
  this.level = 1;
  if (this.name == "shark")
  {
    this.image = loadImage("pictures/batch/shark.png");
  }
  else if (this.name == "dog")
  {
    this.image = loadImage("pictures/batch/dog1.png");
  }
}

Animal.prototype.show = function()
{
  if (this.image)
  {
    image(this.image, this.pos[0], this.pos[1], this.image.width/2, this.image.height/2);
    // console.log(this.image);
  }
  else
  {
    ellipse(this.pos[0], this.pos[1], 10, 10);
  }
}

Animal.prototype.getPos = function()
{
  return this.pos;
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



//
