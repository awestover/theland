ALTER TABLE users ADD COLUMN pwd varchar(15);
ALTER TABLE users ADD COLUMN predatorsKilled integer;
ALTER TABLE users ADD COLUMN personalsKilled integer;
ALTER TABLE users ADD COLUMN preysKilled integer;
ALTER TABLE users ADD COLUMN userAnimalsKilled integer;
ALTER TABLE users ADD COLUMN maxStormlightHeld integer;
ALTER TABLE users ADD COLUMN maxScore integer;
ALTER TABLE users ADD COLUMN maxNumAnimals integer;

UPDATE Users SET predatorsKilled=0 WHERE name='alek';
UPDATE Users SET personalsKilled=0, preysKilled=0, userAnimalsKilled=0, maxStormlightHeld=0, maxScore=0, maxNumAnimals=0;


UPDATE Users SET quest='none' WHERE name='alek';
