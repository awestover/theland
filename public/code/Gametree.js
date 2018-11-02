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

  // crumby comparison for now
  getCollisions()
  {
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

  getPredatorTargets()
  {
    let predatorIdxs = [];// idx of predators
    let targets = []; // for predator sight animal collisions, lists center coords
    for (let i in this.values)
    {
      let targetPos = [];
      let targetDist = false; // really squared distances...
      if (this.values[i].type == "predators")
      {
        for (let j in this.values)
        {
          if (i!=j && this.values[j].type=="personals")
          {
            if (rectInCircle(this.values[j].getBox(), [this.values[i].getCenter(), this.values[i].sightR]))
            {
              let cDist = centerSqaredDist(this.values[i], this.values[j]);
              if (targetDist==false || targetDist > cDist)
              {
                targetDist = cDist;
                targetPos = this.values[j].getCenter();
              }
            }
          }
        }
        if (targetPos.length == 2)
        {
          targets.push(targetPos);
          predatorIdxs.push(i);
        }
      }
    }
    return [predatorIdxs, targets];
  }

  // crumby comparison FOR NOW
  getCollisionsWith(box)
  {
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

  getTerritoryCollisions()
  {
    let collisions = [];
    for (let i = 0; i < this.values.length; i++)
    {
      for (let j = 0; j < numTerritories; j++)
      {
        if (rectInCircle(this.values[i].getBox(), [territoryLocs[j], territoryR]))
        {
          collisions.push([i,j]);
          break;
        }
      }
    }
    return collisions;
  }

}
