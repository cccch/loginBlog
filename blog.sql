CREATE DATABASE IF NOT EXISTS blog;

use blog;

CREATE TABLE users(
    id INT PRIMARY KEY auto_increment,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE articles(
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    time DATETIME NOT NULL,
    uid VARCHAR(20) NOT NULL
);

CREATE TABLE comments
(
  id INT PRIMARY KEY auto_increment,
  content TEXT NOT NULL,
  time DATETIME NOT NULL,
  uid VARCHAR(20) NOT NULL,
  aid INT NOT NULL
);

