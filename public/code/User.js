/*
user class
*/

class User {

  constructor(user_info)
  {
    this.name = user_info["name"];
    this.world = user_info["world"];
    this.animal_type = user_info["animal_type"];
    this.th = user_info["th"] || 0;

    this.pos = user_info["pos"] || [0,0]; // where are you looking

    this.knights = user_info["knights"] || 0;
    this.cost = user_info["cost"] || 100; // may be variable later
    this.attractAnimals = user_info["attractAnimals"] || true;

    for (let an in allAnimals)
    {
      if (!user_info[allAnimals[an]])
      {
        this[allAnimals[an]] = [];
      }
      else {
        this[allAnimals[an]] = user_info[allAnimals[an]];
      }
    }

    this.idCt = user_info["isCt"] || 0;

  }

  hideStats()
  {
    for (let i = 0; i < allAnimals.length; i++)
    {
      for (let an=0; an<this[allAnimals[i]].length; an++)
      {
        this[allAnimals[i]][an].showStats=false;
      }
    }
  }

  show()
  {
    for (let i = 0; i < allAnimals.length; i++)
    {
      for (let an=0; an<this[allAnimals[i]].length; an++)
      {
        this[allAnimals[i]][an].show();
      }
    }
  }

  adjustAnimalLoc(pos)
  {
    return [-pos[0], -pos[1]];
  }

  update()
  {
    let results = [];
    for (let an in this.personals)
    {
      if (this.personals[an].shouldDie())
      {
        this.personals.splice(an, 1);
        an -= 1;
        this.setAnimalsText();
      }
      else
      {
        if (this.attractAnimals)
        {
          this.personals[an].pushMotion(this.pos);
        }
        else {
          this.personals[an].move();
        }
        let currentResult = this.personals[an].possibleOffspring();
        if (currentResult != false)
        {
          results.push(currentResult);
        }
      }

      for (let i = 0; i < results.length; i++)
      {
        this.addOffspringAnimal(results[i]);
      }

      for (let an in this.preys)
      {
        if(this.preys[an].shouldDie())
        {
          this.preys.splice(an, 1);
          an -= 1;
        }
      }

    }

    this.addFrameKnights();

    return results;
  }

  addFrameKnights()
  {
    // later this can be variable or something
    if(Math.random() < 0.5)
    {
      this.knights += 1;
      this.setKnightsText();
    }
  }

  addPrey()
  {
    let newPrey = new Prey({
      "pos":[random(bounds[0][0], bounds[0][1]), random(bounds[1][0], bounds[1][1])],
      "name": this.animal_type,
      "username": this.name,
      "id": this.idCt
    });
    this.preys.push(newPrey);
    this.preys[this.preys.length-1].subPos([newPrey.dims[0]/2, newPrey.dims[1]/2]);
  }

  addPredator()
  {
    let newPredator = new Predator({
      "pos":[random(bounds[0][0], bounds[0][1]), random(bounds[1][0], bounds[1][1])],
      "name": this.animal_type,
      "username": this.name,
      "id":this.idCt
    });
    this.idCt += 1;
    this.predators.push(newPredator);
    this.predators[this.predators.length-1].subPos([newPredator.dims[0]/2, newPredator.dims[1]/2]);
  }

  addPersonal()
  {
    let newPersonal = new Personal({
      "pos":this.adjustAnimalLoc(this.pos),
      "name": this.animal_type,
      "username": this.name,
      "id": this.idCt
    });
    this.idCt += 1;
    this.personals.push(newPersonal);
    this.personals[this.personals.length-1].subPos([newPersonal.dims[0]/2,newPersonal.dims[1]/2]);
    this.setAnimalsText();
  }

  addOffspringAnimal(animal)
  {
    this.personals.push(animal);
    this.setAnimalsText();
  }

  buyAnimal()
  {
    if (this.knights >= this.cost)
    {
      this.knights -= this.cost;
      this.addPersonal();
    }
  }


  updateView(last_pos, current_pos)
  {
    let proposedPos = addV([current_pos[0]-last_pos[0], current_pos[1] - last_pos[1]], this.pos);
    if((proposedPos[0] > -gridSize || this.pos[0] < proposedPos[0]) && (proposedPos[0] < gridSize || this.pos[0] > proposedPos[0]))
    {
      this.pos[0] = proposedPos[0];
    }
    if ((proposedPos[1] > -gridSize || this.pos[1] < proposedPos[1]) && (proposedPos[1] < gridSize || this.pos[1] > proposedPos[1]))
    {
      this.pos[1] = proposedPos[1];
    }
  }

  shiftPos(pos)
  {
    this.pos = [this.pos[0] + pos[0], this.pos[1] + pos[1]];
  }

  // later only show things that are in our view
  inView(pos)
  {
    let sPos = this.shiftPos(pos);
    if (sPos[0]>0 && sPos[0] < screen_dims[0] && sPos[1]>0 && sPos[1]<screen_dims[1])
    {
      return true;
    }
    return false;
  }

  setKnightsText()
  {
      $('#knights').text("Knights: " + this.knights);
  }

  setAnimalsText()
  {
      $('#animals').text("Animals: " + this.personals.length);
  }

  setAnimalType()
  {
      $('#animalType').text("Animals Type: " + this.animal_type);
  }

  giveAnimalsName()
  {
    for(let an in this.personals)
    {
      this.personals[an].username = this.name;
    }
  }

  toggleAttractAnimals()
  {
    this.attractAnimals = ! this.attractAnimals;
  }

  getScore()
  {
    return Math.floor(this.personals.length*10+0.01*this.knights);
  }

}
