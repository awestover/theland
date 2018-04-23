// the animals have to eat this to stay alive. The predators can eat this to fufill their food quota
function Prey(animal_traits)
{
    Animal.call(this, animal_traits);
}

Prey.prototype = Object.create(Animal.prototype);
