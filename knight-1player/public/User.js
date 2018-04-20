function User(name, world, animal_type)
{
  this.name = name;
  this.world = world;
  this.animal_type = animal_type;

  this.knights = 0;
  // cost and level are probably going to be linked
  this.cost = 10;

  this.animals = [];
  this.addAnimal();

}

User.prototype.show = function()
{
  for (var an in user.animals)
  {
    this.animals[an].show();
  }
  fill(0, 0, 0);
  ellipse(screen_dims[0]/2, screen_dims[1]/2, 10, 10);
}

User.prototype.update = function()
{
  for (var an in user.animals)
  {
    this.animals[an].move();
  }
  this.addFrameKnights();
}

User.prototype.addFrameKnights = function()
{
  // later this can be variable or something
  if(Math.random() < 0.5)
  {
    this.knights += 1;
    this.setKnightsText();
  }
}

User.prototype.addAnimal = function()
{
  var randAnimal = new Animal({
    "pos":[screen_dims[0]/2, screen_dims[1]/2],
    "name": this.animal_type
  });
  this.animals.push(randAnimal);
  this.animals[this.animals.length-1].subPos([animal_size[0]/2,animal_size[1]/2]);
  this.setAnimalsText();
}

User.prototype.buyAnimal = function()
{
  if (this.knights >= this.cost)
  {
    this.knights -= this.cost;
    this.addAnimal();
  }
}


User.prototype.setKnightsText = function()
{
    $('#knights').text("Knights: " + this.knights);
}

User.prototype.setAnimalsText = function()
{
    $('#animals').text("Animals: " + this.animals.length);
}
