-- go to theland. run heroku pg:psql then run this

-- old
-- CREATE TABLE Users (name varchar(15), quest varchar(100), level integer, password varchar(15));

CREATE TABLE Users (name varchar(64), quest integer,
level integer, pwd_hash integer, title varchar(64),
personals_killed integer, predators_killed integer, preys_killed integer);
