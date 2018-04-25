// the game tree. checks all collisions

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
    this.values.push(animal.getBox());
  }

  insertUser(user)
  {
    for (var an in user.animals)
    {
      this.insert(user.animals[an]);
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
          if (this.checkBoxCollide(this.values[i], this.values[j]))
          // if (this.values[i].checkCollide(this.values[j]))
          {
            // console.log(this.get(i) + ", "+this.get(j));
            collisions.push([i, j]);
          }
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
