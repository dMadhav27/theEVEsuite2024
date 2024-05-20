-- Create the event_management database if it doesn't exist
CREATE DATABASE IF NOT EXISTS event_management;

-- Use the event_management database
USE event_management;

-- Create the users table to store user information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the events table to store event details
CREATE TABLE IF NOT EXISTS events (
	field6 varchar(100) not null,
    field7 varchar(100) not null,
	field5 varchar(100) not null,
    username varchar(100) not null,
    loc varchar(100) not null,
    ppl varchar(100) not null,
    evetime varchar(100) not null,
    food varchar(100) not null,
    cmnt varchar(100) not null,
    cli_name VARCHAR(255) NOT NULL,
    cli_address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'madhav2711';
