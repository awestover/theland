# cool games
These are some cool games

# dependencies

# mongodb stuff

sql tests:
SELECT * FROM information_schema.tables WHERE table_name='test';
(Created table test)

INSERT INTO test VALUES('hmm')

heroku:
https://devcenter.heroku.com/articles/heroku-postgresql#designating-a-primary-database

local install is good too

psql

very nice
heroku pg:psql

really nice forum
https://teamtreehouse.com/community/postgresql-database-deployed-on-heroku-possible-view-add-delete-rows-in-tables

the export command is good too.


# for socket games
npm
nodejs
stuff in pacakges.json or something

One player version at
<a href="https://awestover.github.io/coolGames/knight-1player/public/">https://awestover.github.io/coolGames/knight-1player/public/</a>

website at
<a href="https://theland.herokuapp.com">theland.herokuapp.com</a>

<a>http://localhost:8000/index.html</a>

You can't acess the repo for some reason when it is on heroku

so you should copy code to github when you are done

(not quite, this copies heroku remote too... manually copy all files...)
cp -r knight-rises/* knight-rises-code-github/

gitc "added code"
gitp

# socket io and general js lessons learned:

"rooms" for semi private communication (private within a group) are important
https://socket.io/docs/rooms-and-namespaces/


splice and slice

splice(x, length) deletes a section of an array
slice(x, length)  copies  a section of an array

ellipse(x,y,w,h) diameter NOT radius...

for links via button press do
window.location.href = "http://stackoverflow.com"; etc
DO NOT hack css into a <a> tag...


# for 3d open gl
    pip install numpy
    pip install pygame
    pip install opengl
or maybe
    sudo apt-get install python-opengl
or something similar

On windows it will be much harder
http://pyopengl.sourceforge.net/


# Interesting notes

In javascript you can write classes kind of like in java

class A
{
  constructor()
  {
    this.w=1;
  }
  x()
  {
    return this.w;
  }
}


class B extends A
{
  constructor()
  {
    super();
  }
  y()
  {
    return 3;
  }
}


Use indexOf for arrays
let x =[1,2,45,6];
x.indexOf(10) = -1
x.indexOf(1) = 0
kind of like python!

# End
