//functions

function getGridSize(otherUsers)
{
  const spacePerExtrUsr = 500;
  const originalSpace = 1500;
  return originalSpace + spacePerExtrUsr*Object.keys(otherUsers).length;
}

function handleTextIncoming(data) {
  $.notify(data["txt"], {style: 'message'});
};

function adjustSize(s)
{
  gridSize = s;
  bounds = [[-s, s], [-s, s]];
  edgeRects = calculateEdge();
}

function randomWeightedChoice(arr, weights)
{
  let wSum = 0;
  for (w in weights)
  {
    wSum += weights[w];
  }

  let r = Math.floor(Math.random()*wSum);

  let ct = 0;
  for (let i in weights)
  {
    ct += weights[i];
    if (r < ct)
    {
      return arr[i];
    }
  }
};

function sendText(txt)
{
  socket.emit("textSent", {
    "world": "home",
    "txt": txt + " - home"
  });
}

function songLoaded()
{
	song.setVolume(0.3);
	song.rate(randInter(0.7, 1.2));
	song.loop();
}

function userDbToTxt()
{
	let t = "";
  for (let i in userDb)
  {
    t += i + ": " + userDb[i] + "   ";
  }
  return t;
}

function userQuestProgress()
{
  let gq = questsOrdered[userDb.quest];
	return ("Progress: " + userDb[gq[0]] + " " + gq[0]);
}

function centerSqaredDist(animalA, animalB)
{
	let dx = (animalA.pos[0]+animalA.dims[0]/2) - (animalB.pos[0]+animalB.dims[0]/2);
	let dy = (animalA.pos[1]+animalA.dims[1]/2) - (animalB.pos[1]+animalB.dims[1]/2);
	return (dx*dx + dy*dy);
}

function parseURL(url)
{
	var lastPart = url.split("?");
	lastPart = lastPart[lastPart.length-1];
	var terms = lastPart.split("&");
	var data = {};
	for (var t = 0; t < terms.length; t++)
	{
		var curt = terms[t].split("=");
		data[curt[0]] = curt[1];
	}
	return data;
}

function worldToColor(txt)
{
	const NUMCOLORS = 4;
	let colors = [[2, 124, 57], [124, 2, 57], [2, 57, 124], [57, 124, 57]];
	let val = 0;
	for (let i=0; i < txt.length; i++)
	{
		val = (val + txt.charCodeAt(i)) % NUMCOLORS;
	}
	return colors[val];
}

function rectInCircle(boxCoords, circleCoords)
{
  /*circle rectangle collision
  easier to think of circle running into rectangle, even though it is the other way arround
  Basic idea: if the point on the square which is closest to the circle isn't in the circle there is not collision
  otherwise there is collision.
  Clamp opperation: get the point in the sqare closest to the circles center X and Y
  */
  let x = boxCoords[0]; let y = boxCoords[1];
  let w = boxCoords[2]; let h = boxCoords[3];
  let xc = circleCoords[0][0]; let yc = circleCoords[0][1];
  let r = circleCoords[1];

  // gives center if circle is in rectangle, otherwise gives the coordinates of the closest side (x and y)
  let nearX = Math.max(x, Math.min(xc, x+w) );
  let nearY = Math.max(y, Math.min(yc, y+h) );

  let dx = nearX - xc; let dy = nearY - yc;

  return (dx*dx + dy*dy <= r*r);

}

function realPos(pos, user)
{
    return [pos[0] - screen_dims[0]/2 - user.pos[0], pos[1] - screen_dims[1]/2 - user.pos[1]];
}

function drawOrigin(sketch)
{
  sketch.noFill();
  sketch.stroke(0,0,0);
  sketch.ellipse(0,0,2*5,2*5);
}

function magv(v)
{
  return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

function randomMidish(damp)//damp is about 0.8
{
  return [randInter(bounds[0][0]*damp, bounds[0][1]*damp), randInter(bounds[1][0]*damp, bounds[1][1]*damp)];
}

function randInter(a, b)
{
  return Math.random()*(b-a)+a;
}

function vecScalarMult(x, k)
{
  let u = [];
  for (let i = 0; i < x.length; i++)
  {
    u.push(k*x[i]);
  }
  return u;
}

function negateV(v)
{
  let out = [];
  for (let i = 0; i < v.length; i++)
  {
    out.push(-1*v[i]);
  }
  return out;
}

function addV(a, b)
{
  let o = [];
  for (let i = 0; i < a.length; i++)
  {
    o.push(a[i]+b[i]);
  }
  return o;
}

function toggleScores()
{
  scoresVisible = ! scoresVisible;
}

function valInArr(arr, val)
{
  for (let i in arr)
  {
    if (arr[i] == val)
    {
      return true;
    }
  }
  return false;
}

function inMiddle(a, b, c)
{
  return ((a < b) && (b < c));
}


function violateEdge(boxa)
{
  return (Math.abs(boxa[0])>(gridSize-boundSize) || Math.abs(boxa[1]) > (gridSize -boundSize) ||
    Math.abs(boxa[1]+boxa[3])>(gridSize-boundSize) || Math.abs(boxa[0]+boxa[2])> (gridSize-boundSize));
}

function onEdge(boxa)
{
  for (let i = 0; i < edgeRects.length; i++)
  {
    if(gametree.checkBoxCollide(edgeRects[i], boxa))
    {
      return true;
    }
  }
  return false;
}

function mouseOn(boxa)
{
  return gametree.checkBoxCollide(boxa, [mouseX, mouseY, 5, 5])
}

function drawEdge(sketch)
{
  sketch.noStroke();
  sketch.fill(200, 20, 20,175);
  for (let i = 0; i<4; i++)
  {
    dRect(edgeRects[i], sketch);
  }
}

function dRect(arr, sketch)
{
  sketch.rect(arr[0], arr[1], arr[2], arr[3]);
}

function onCanvas(pos)
{
  let xIn = (pos[0] > 0 && pos[0] < screen_dims[0]);
  let yIn = (pos[1] > 0 && pos[1] < screen_dims[1]);
  return (xIn && yIn);
}

// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}

function drawTerritory(th, name, sketch)
{
	thColors[th].setAlpha(100);
	sketch.fill(thColors[th]);
  sketch.ellipse(territoryLocs[th][0], territoryLocs[th][1], 2*territoryR, 2*territoryR);
	thColors[th].setAlpha(255);
	sketch.fill(0,0,0);
  if (name)
  {
    sketch.text(name, territoryLocs[th][0], territoryLocs[th][1]);
  }
}

function calculateTerritory(th)
{
  /*
  note: divide into 12 parts, th is an index not an absoulte angle
  need to implement grid boundary with lava on the edge
  */
  return [Math.cos(th*Math.PI/6)*gridSize*0.6, Math.sin(th*Math.PI/6)*gridSize*0.6];
}

function boxInTerritory(boxCoords)
{
  for (let th = 0; th < territoryLocs.length; th++)
  {
    if(rectInCircle(boxCoords, [territoryLocs[th], territoryR]))
    {
      return true;
    }
  }
  return false;
}

function calculateEdge()
{
  /*
  NOTE: this is BROKEN currently. The screen is weird... + is to the left in x....
  it might not be broken though

  BROKEN

  A rectangular border arround the whole grid at the furthest locations from center
  */
  let brw = boundSize; let brh = boundSize;
  let brs = [[],[],[],[]];
  brs[0] = [bounds[0][0], bounds[1][0], brw, bounds[1][1]-bounds[1][0]];
  brs[1] = [bounds[0][0], bounds[1][0], bounds[0][1]-bounds[0][0], brh];
  brs[2] = [bounds[0][1]-brw, bounds[1][0], brw, bounds[1][1]-bounds[1][0]];
  brs[3] = [bounds[0][0], bounds[1][1]-brh, bounds[0][1]-bounds[0][0], brh];
  return brs;
}

function showMaxScores(sketch)
{
  // let tx = screen_dims[0]*0.2;
	let tx = screen_dims[0]/2-scoreWidth*1.2;
  let ty = -0.45*screen_dims[1];
  sketch.fill(10,10,10,50);
  sketch.rect(tx, ty, scoreWidth, 60*(numHighscores));
  sketch.fill(0,0,0);
	let dy = 50;
  let nameScores = myp5.getMaxScores();
  let ctxt;
  for (let i = 0; i < numHighscores; i++)
  {
    if(!nameScores[0][i])
    {
      nameScores[0][i] = "NONE";
      nameScores[1][i] = -1;
    }
    ctxt = nameScores[0][i] + ": " + nameScores[1][i];
    sketch.text(ctxt, tx, ty+(i+1)*dy, scoreWidth, dy);
  }
}

function encrypt(pwd)
{
  let o = 1;
  for(let i = 0; i < pwd.length; i++)
  {
    o *= pwd.charCodeAt(i);
    o = o % 7907;
  }
  return o;
};

function validate(pwd)
{
  if (encrypt(pwd) == 6769)
  {
    return "gold and power";
  }
  else if (encrypt(pwd) == 3845)
  {
    return "power";
  }
  return false;
};

function updateDbText()
{
  $("#progress").text(userQuestProgress());
  $("#title").text("Title: " + userDb.title);
  $("#level").text("Level: " + userDb.level);
  $("#quest").text("Quest: " + questText(userDb.quest));
};
