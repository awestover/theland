ALTER TABLE users ADD COLUMN pwd varchar(15);
ALTER TABLE users ADD COLUMN predatorsKilled integer;
ALTER TABLE users ADD COLUMN personalsKilled integer;
ALTER TABLE users ADD COLUMN preysKilled integer;
ALTER TABLE users ADD COLUMN userAnimalsKilled integer;
ALTER TABLE users ADD COLUMN maxStormlightHeld integer;
ALTER TABLE users ADD COLUMN maxScore integer;
ALTER TABLE users ADD COLUMN maxNumAnimals integer;

-- this might be worth a shot...
-- ... SET DEFAULT 0;
