DROP DATABASE IF EXISTS spheresScores;

CREATE DATABASE spheresScores;

USE spheresScores;

CREATE TABLE scores (
  id int NOT NULL AUTO_INCREMENT unique,
  player varchar(3),
  score int,
  PRIMARY KEY (id)
)

-- mysql -u root < server/schema.sql