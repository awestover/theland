-- ALTER TABLE users ADD COLUMN pwd varchar(15);
ALTER TABLE users ADD COLUMN pwd integer;
ALTER TABLE users ADD COLUMN predators_killed integer;
ALTER TABLE users ADD COLUMN personals_killed integer;
ALTER TABLE users ADD COLUMN preys_killed integer;

-- ALTER TABLE users ADD COLUMN user_animals_killed integer;
-- ALTER TABLE users ADD COLUMN max_stormlight_held integer;
-- ALTER TABLE users ADD COLUMN max_score integer;
-- ALTER TABLE users ADD COLUMN max_num_animals integer;

UPDATE Users SET predatorsKilled=0 WHERE name='alek';
UPDATE Users SET personalsKilled=0, preysKilled=0, userAnimalsKilled=0, maxStormlightHeld=0, maxScore=0, maxNumAnimals=0;


UPDATE Users SET quest='none' WHERE name='alek';


ALTER TABLE users DROP COLUMN pwd;
ALTER TABLE users DROP COLUMN quest;

ALTER TABLE users ADD COLUMN title varchar(15);


ALTER TABLE users ADD COLUMN antype varchar(32);
