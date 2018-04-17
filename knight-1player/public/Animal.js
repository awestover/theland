function Animal(animal_traits)
{
  this.pos = animal_traits["pos"];
  // this.name = animal_traits["name"];
  this.name="shark";
  this.image = false;
  if (this.name == "shark")
  {
    this.image = loadImage("pictures/shark.png");
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
  var th = (Math.random()-0.5)/16;
  var nx = this.pos[0]*Math.cos(th) - this.pos[1]*Math.sin(th);
  var ny = this.pos[0]*Math.sin(th) + this.pos[1]*Math.cos(th);
  this.pos = [nx, ny];
}



//
