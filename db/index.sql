ALTER TABLE`website`.`categories` 
ADD COLUMN `categoryIcon` VARCHAR(255) NULL AFTER`categoryColor`;


ALTER TABLE`website`.`timelogs` 
ADD COLUMN `details` VARCHAR(2000) NULL AFTER`totalTime`;


ALTER TABLE `website`.`TimeLogs` 
ADD COLUMN `minutes` INT NOT NULL DEFAULT 0 AFTER `totalTime`;
