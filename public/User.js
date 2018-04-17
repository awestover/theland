function User(name, world)
{
  this.name = name;
  this.world = world;
  this.animals = [new Animal({"pos":[Math.random()*100, Math.random()*100]})];
}

User.prototype.show = function()
{
  return (name);
}


User.prototype.getWorld = function()
{
  return this.world;
}

User.prototype.getName = function()
{
  return this.name;
}
