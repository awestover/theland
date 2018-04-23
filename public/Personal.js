// the user controlled animals

function Personal(animal_traits)
{
  Animal.call(this, animal_traits);
}

Personal.prototype = Object.create(Animal.prototype);
