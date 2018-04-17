function Animal(animal_traits)
{
  this.pos = animal_traits["pos"];
}

Animal.prototype.show = function()
{
  ellipse(this.pos[0], this.pos[1], 10, 10);
}

Animal.prototype.getPos = function()
{
  return this.pos;
}
