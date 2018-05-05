/*
user class
*/

class User{

  constructor(user_info)
  {
    this.name = user_info["name"];
    this.world = user_info["world"];
    this.animal_type = user_info["animal_type"];

    this.th = user_info["th"];
    this.pos = user_info["pos"] || [0,0]; // where are you looking

    this.knights = 0;
    this.cost = 100; // may be variable later
    this.attractAnimals = true;

    if(!user_info["animals"])
    {
      this.animals = [];
    }
    else {
      this.animals = user_info["animals"];
    }
  }

  show()
  {
    for (var an=0; an<this.animals.length; an++)
    {
      this.animals[an].show();
    }
  }

  adjustAnimalLoc(pos)
  {
    return [-pos[0], -pos[1]];
  }

  update()
  {
    let results = [];
    for (var an in user.animals)
    {
      if (this.animals[an].shouldDie())
      {
        this.animals.splice(an, 1);
        an -= 1;
        this.setAnimalsText();
      }
      else
      {
        if (user.attractAnimals)
        {
          this.animals[an].pushMotion(this.pos);
        }
        else {
          this.animals[an].move();
        }
        let currentResult = this.animals[an].possibleOffspring();
        if (currentResult != false)
        {
          results.push(currentResult);
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

  addAnimal()
  {
    let newAnimal = new Personal({
      "pos":this.adjustAnimalLoc(this.pos),
      "name": this.animal_type,
      "username": this.name
    });
    this.animals.push(newAnimal);
    this.animals[this.animals.length-1].subPos([animal_size[0]/2,animal_size[1]/2]);
    this.setAnimalsText();
  }

  addOffspringAnimal(animal)
  {
    this.animals.push(animal);
    this.setAnimalsText();
  }

  buyAnimal()
  {
    if (this.knights >= this.cost)
    {
      this.knights -= this.cost;
      this.addAnimal();
    }
  }


  updateView(last_pos, current_pos)
  {
    let proposedPos = addV([current_pos[0]-last_pos[0], current_pos[1] - last_pos[1]], this.pos);
    if((proposedPos[0] > -gridSize || user.pos[0] < proposedPos[0]) && (proposedPos[0] < gridSize || user.pos[0] > proposedPos[0]))
    {
      this.pos[0] = proposedPos[0];
    }
    if ((proposedPos[1] > -gridSize || user.pos[1] < proposedPos[1]) && (proposedPos[1] < gridSize || user.pos[1] > proposedPos[1]))
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
      $('#animals').text("Animals: " + this.animals.length);
  }

  giveAnimalsName()
  {
    for(let an in this.animals)
    {
      this.animals[an].username = this.name;
    }
  }

  toggleAttractAnimals()
  {
    this.attractAnimals = ! this.attractAnimals;
  }

  getScore()
  {
    return Math.floor(this.animals.length*10+0.01*this.knights);
  }

}
