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

  inMiddle(a, b, c)
  {
    return ((a < b) && (b < c));
  }

  checkBoxCollide(box1, box2)
  {
    let x0 = this.inMiddle(box1[0], box2[0], box1[0] + box1[2]);
    let y0 = this.inMiddle(box1[1], box2[1], box1[1] + box1[3]);
    let x1 = this.inMiddle(box1[0], box2[0] + box2[2], box1[0] + box1[2]);
    let y1 = this.inMiddle(box1[1], box2[1] + box2[3], box1[1] + box1[3]);

    return ((x0 || x1) && (y0 || y1));
  }

}
