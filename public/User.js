//user class
function User(name, world, animal_type, animals)
{
  this.name = name;
  this.world = world;
  this.animal_type = animal_type;

  this.pos = [0,0]; // where are you looking

  this.knights = 0;
  // cost and level are probably going to be linked
  this.cost = 10;

  if(! animals)
  {
    this.animals = [];
    this.addAnimal();
  }
  else {
    this.animals = animals;
  }

}

User.prototype.show = function()
{
  for (var an=0; an<this.animals.length; an++)
  {
    this.animals[an].show();
  }
}

User.prototype.adjustAnimalLoc=function(pos)
{
  return [screen_dims[0]/2-pos[0], screen_dims[1]/2-pos[1]];
}

User.prototype.update = function()
{
  let results = [];
  for (var an in user.animals)
  {
    let deathPr = 0.01;
    if (random() < deathPr && this.animals.length > 1)
    {
      this.animals.pop(an);
      an -= 1;
    }
    else
    {
      this.animals[an].move();
      let currentResult = this.animals[an].possibleOffspring();
      if (currentResult != false)
      {
        results.push(currentResult);
      }
    }
  }
  this.addFrameKnights();

  return results;
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
    "pos":this.adjustAnimalLoc(this.pos),
    "name": this.animal_type
  });
  this.animals.push(randAnimal);
  this.animals[this.animals.length-1].subPos([animal_size[0]/2,animal_size[1]/2]);
  this.setAnimalsText();
}

User.prototype.addOffspringAnimal = function(animal)
{
  this.animals.push(animal);
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


User.prototype.updateView = function(last_pos, current_pos)
{
  this.shiftPos([current_pos[0]-last_pos[0], current_pos[1] - last_pos[1]]);
}

User.prototype.shiftPos = function(pos)
{
  this.pos = [this.pos[0] + pos[0], this.pos[1] + pos[1]];
  // console.log(this.pos);
}

// later only show things that are in our view
User.prototype.inView = function(pos)
{
  let sPos = this.shiftPos(pos);
  if (sPos[0]>0 && sPos[0] < screen_dims[0] && sPos[1]>0 && sPos[1]<screen_dims[1])
  {
    return true;
  }
  return false;
}

User.prototype.setKnightsText = function()
{
    $('#knights').text("Knights: " + this.knights);
}

User.prototype.setAnimalsText = function()
{
    $('#animals').text("Animals: " + this.animals.length);
}
