function User(name, world)
{
  this.name = name;
  this.world = world;
  this.animals = [];
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
