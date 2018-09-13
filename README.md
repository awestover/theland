# theland
It is kind of the best thing ever

# dependencies
npm install
NOT npm install package.json

# mongodb stuff

NOTE SQL is no respecter of capitalization
so the column names don't have camel casing...

single quotes for SQL stuff

SELECT * FROM information_schema.tables WHERE table_name='users';

please note postgresql and mysql ARE (subtly) different. ie INSERT command
INSERT INTO test VALUES('hmm')

# heroku:
to list hours left:
(i am not sure if this is a problematic thing... no credit card registered yet...)
heroku ps


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

notify.js is a fancier version of alerts
ie
alert("nasty");
versus
$.notify("pretty");

website at
<a href="https://theland.herokuapp.com">theland.herokuapp.com</a>

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


# the virtue of not implementing everything yourself (always look up solutions before making them)
https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_cleartimeout
clear timeout! I was going to make a hacky version of this myself... tracking times, it would have been very bad...

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

# atom stuff
control p to go through files
control shift p to do cooler stuff
control g to go to a line


# End
