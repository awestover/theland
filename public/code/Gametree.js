// the game tree. checks all collisions


// this.w and this.h dont exist

class Gametree
{
  constructor()
  {
    this.values = [];
  }

  get(i)
  {
    return this.values[i];
  }

  clear()
  {
    this.values = [];
  }

  insert(animal)
  {
    this.values.push(animal);
  }

  insertUser(user)
  {
    for (let an in allAnimals)
    {
      for (let i in user[allAnimals[an]])
      {
        this.insert(user[allAnimals[an]][i]);
      }
    }
  }

  getCollisions()
  {
    // crummy comparison FOR NOW
    let collisions = [];
    for (var i = 0; i < this.values.length; i++)
    {
      for (var j = i+1; j < this.values.length; j++)
      {
          if (this.checkBoxCollide(this.values[i].getBox(), this.values[j].getBox()))
          {
            collisions.push([i, j]);
          }
      }
    }
    return collisions;
  }

  getCollisionsWith(box)
  {
    // crummy comparison FOR NOW
    let collisions = [];
    for (var i = 0; i < this.values.length; i++)
    {
      if (this.checkBoxCollide(this.values[i].getBox(), box))
      {
        collisions.push(i);
      }
    }
    return collisions;
  }

  // 1 d collision detection (real number line)
  collideX(a, b)
  {
    return ((b[0] < a[1]) && (b[1] > a[0]));
  }

  // do 2 boxes intersect?
  checkBoxCollide(a, b)
  {
    let xInt = this.collideX([a[0], a[0]+a[2]], [b[0], b[0]+b[2]]);
    let yInt = this.collideX([a[1], a[1]+a[3]], [b[1], b[1]+b[3]]);
    return (xInt && yInt);
  }
}
