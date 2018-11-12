let myp5 = new p5(function(sketch) {
let animals = [];
sketch.setup = function()
{
  screen_dims = [sketch.windowWidth, sketch.windowHeight*0.9];
  canvas = sketch.createCanvas(screen_dims[0], screen_dims[1]);
  sketch.textAlign(sketch.CENTER);
  sketch.frameRate(10);

  zoom = sketch.createSlider(0.2, 5, 1, 0);// min, max, init, step
	zoom.style("width", "300px");
  zoom.position(200, 200);

  let k = 0;
  for (var i = 0; i < allAnimals.length; i++) {
    for (var c = 1; c <= max_lvls[allAnimals[i]]; c++) {
      for (var j = 0; j < animal_names[allAnimals[i]].length; j++) {
        animals.push(new Animal({"name": animal_names[allAnimals[i]][j], "level": c,
          "pos": [Math.random()*screen_dims[0]/10, Math.random()*screen_dims[1]/10]}, sketch));
        animals[k].vel = [5, 0];
        k++;
      }
    }
  }
}

sketch.draw = function()
{
  sketch.scale(zoom.value());

  // graphics basis
  sketch.background(bgColor);
  sketch.translate(screen_dims[0]/2, screen_dims[1]/2);  // center to 0,0

  for (var i = 0; i < animals.length; i++) {
    animals[i].show(sketch);
    animals[i].move();
    if (Math.abs(animals[i].pos[0])>1*screen_dims[0]) {
      animals[i].pos[0] = 0;
    }
    if (Math.abs(animals[i].pos[1])>1*screen_dims[1]) {
      animals[i].pos[1] = 0;
    }
  }

  sketch.pop();
};

});
