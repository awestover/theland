/*
Animal class

basic ideas for all animals
movement properties etc
*/

class Animal
{
  constructor(animal_traits)
  {
    // basic stats
    this.pos = animal_traits["pos"].slice() || [0,0];
    this.vel = [0, 0];
    this.name = animal_traits["name"];
    this.health = animal_traits["health"] || 10;

    // identification
    this.username = animal_traits["username"] || "NPC";
    this.th = animal_traits["th"] || 0;
    this.id = animal_traits["id"] || 0;

    this.dims = [66,50];
    this.showStats = false; //  animal_traits["showStats"] ||

    this.level = animal_traits["level"] || 1;

    this.type = "animals";
    this.image = this.getImg();
    this.boostedImage = this.getBoostedImg();

    this.rotated = 1; // + or - 1 for right and left (positive x vel and negative v vel)

    this.boosted = animal_traits["boosted"] || false;
    this.visitedUserTerritory = animal_traits["visitedUserTerritory"] || false;
  }

  getCenter()
  {
    return [this.pos[0]+this.dims[0]/2, this.pos[1]+this.dims[1]/2];
  }

  getBoosted()
  {
    if (!this.boosted)
    {
      this.boosted = true;
      this.health *= 2;
    }
  }

  getBoostedImg()
  {
    try{
      return animal_pictures[this.name+"0"];
    }
    catch(err)
    {
      return false;
    }
  }

  getImg()
  {
    try{
      return animal_pictures[this.name+this.level];
    }
    catch(err)
    {
      return false;
    }
  }

  getRepulsed(pos, dims)
  {
    let diffs = [(pos[0]+dims[0]/2) - (this.pos[0]+this.dims[0]/2), (pos[1]+dims[1]/2) - (this.pos[1]+this.dims[1]/2)];
    diffs = vecScalarMult(diffs, -this.speed/magv(diffs));
    this.addPos(diffs);
  }

  move()
  {
    let th = (Math.random()-0.5)*1.2;
    if (Math.random() < 0.5) {
      th = 0;
    }
    var nx = this.vel[0]*Math.cos(th) - this.vel[1]*Math.sin(th);
    var ny = this.vel[0]*Math.sin(th) + this.vel[1]*Math.cos(th);

    this.vel = [nx, ny];
    this.addPos(this.vel); // *dt

    this.rotated=Math.sign(this.vel[0]);
  }

  pushMotion(location, threshold)
  {
    if (!threshold)
    {
      threshold = 50;
    }
    let deltaV = [location[0]-this.pos[0]-this.dims[0]/2, location[1]-this.pos[1]-this.dims[1]/2];
    let cMag = magv(deltaV);
    if (cMag>threshold)
    {
      deltaV = vecScalarMult(deltaV, this.speed/cMag);
      this.vel = deltaV;
    }
    this.move(); // slightly alter current trajectory
  }

  statsConfigText()
  {
    stroke(0,0,0);
    strokeWeight(0.5);
    fill(0,0,0);
    textSize(12);
  }

  pStats(pp)
  {
    if (this.showStats)
    {
      this.statsConfigText();
      let ctx = "Name: "  +  this.name;
      ctx += "\n" + "Level: " + this.level;
      text(ctx, pp[0]+this.dims[0]/2, pp[1]+1.3*this.dims[1]);
    }
  }

  drawBar(size, clr, perRow, curY)
  {
    noStroke();
    fill(clr);
    let nrs = Math.floor(size/perRow);
    if (nrs>0)
    {
      curY -= barHeight*nrs;
      rect(-this.dims[0]/2, -this.dims[1]/2 + curY, this.dims[0], barHeight*nrs);
    }
    if ((size%perRow) != 0)
    {
      curY -= barHeight;
      rect(-this.dims[0]/2, -this.dims[1]/2 + curY, this.dims[0]*((size%perRow)/perRow), barHeight);
    }

    return curY;
  }

  show()
  {
    if (this.health>0)
    {
      push();
      translate(this.pos[0]+this.dims[0]/2, this.pos[1]+this.dims[1]/2);

      this.pStats([-this.dims[0]/2, -this.dims[1]/2]);

      let space = 0;
      let curY;
      //health bar
      curY = this.drawBar(this.health, color(200,50,50), 20, -2*barHeight);
      if (this.showStats)
      {
        this.statsConfigText();
        text("Health: " + this.health.toFixed(2), this.dims[0]*1.1, curY-this.dims[1]/2-space);
        space += 10;
      }

      //preys stats
      if (this.type == "preys")
      {
        let colors = [color(253, 106, 2), color(249, 241, 157)];
        let titles = ["health", "hunger"];
        for (let i = 0; i < titles.length; i++)
        {
          curY = this.drawBar(Math.abs(this.help[titles[i]]), colors[i], 5, curY);
        }
      }
      //predators stats
      else if (this.type == "predators")
      {
        let colors = [color(205, 15, 226), color(66, 134, 244)];
        curY = this.drawBar(this.speed, colors[0], 5, curY);
        curY = this.drawBar(this.power, colors[1], 5, curY);
      }
      // user stats
      else if (this.type == "personals")
      {
        //bars
        let titles = ["Strength: ", "Age: ", "Hunger: ", "Speed: "]
        let stats = [this.strength, this.age, this.hunger, this.speed];
        let colors = [color(66, 134, 244), color(82, 232, 55), color(224, 206, 13), color(205, 15, 226)];
        for (let i = 0; i < stats.length; i++)
        {
          curY = this.drawBar(stats[i], colors[i], 5, curY);
          if (this.showStats)
          {
            this.statsConfigText();
            text(titles[i] + stats[i].toFixed(2), this.dims[0]*1.1, curY-this.dims[1]/2-space);
            space += 10;
          }
        }

        noFill();
        stroke(thColors[this.th]);
        strokeWeight(3);
        ellipse(0, 0, this.dims[0]*1.3, this.dims[1]*1.3);
      }

      scale(this.rotated,1);
      try
      {
        if (!this.boosted)
        {
          image(this.image, -this.dims[0]/2, -this.dims[1]/2);
        }
        else {
          image(this.boostedImage, -this.dims[0]/2, -this.dims[1]/2);
        }
      }
      catch(err)
      {
        ellipse(-this.dims[0]/2, -this.dims[1]/2, this.dims[0]/2, this.dims[1]/2);
      }
      pop();
    }
    else {
      console.log("this.health=0 in an Animal... a bit sketchy");
    }
  }

  addPos(apos)
  {
    this.pos[0] += apos[0];
    this.pos[1] += apos[1];
  }

  subPos(apos)
  {
    this.pos[0] -= apos[0];
    this.pos[1] -= apos[1];
  }

  randomHeading(speed)
  {
    let thInit = Math.random()*Math.PI*2;
    return [Math.cos(thInit)*speed, Math.sin(thInit)*speed];
  }

  addVel(avel)
  {
    this.vel[0]+=avel[0];//*dt
    this.vel[1]+=avel[1];//*dt
  }

  scaleVel(k)
  {
    this.vel[0] *= k;
    this.vel[1] *= k;
  }

  velMag()
  {
    return Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  }

  getBox()
  {
    return [this.pos[0], this.pos[1], this.dims[0], this.dims[1]];
  }

  shouldDie()
  {
    if (this.health <=0)
    {
      return true;
    }
    else if (violateEdge(this.getBox()))
    {
      return true;
    }
    return false;
  }

  inEnemyTerritory()
  {
    // bad
    this.health = this.health -1;
  }

  inUserTerritory()
  {
    if (!this.visitedUserTerritory)
    {
      this.visitedUserTerritory = true;
    }
  }

}
