// this can eat stuff
function Predator( animal_traits)
{
  Animal.call(this, animal_traits);
}

Predator.prototype = Object.create(Animal.prototype);
