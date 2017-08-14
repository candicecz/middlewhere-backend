DROP DATABASE IF EXISTS middlewhere;

CREATE DATABASE middlewhere;

USE middlewhere;

-- CREATE TABLE `org` (
--   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(60) NOT NULL DEFAULT '',
--   `payment` varchar(100) DEFAULT NULL,
--   `code` varchar(100) DEFAULT NULL,
--   `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`)




# Dump of table projects
# ------------------------------------------------------------

CREATE TABLE `projects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(140) DEFAULT NULL,
  `adminUserId` int(11) NOT NULL, --foreign key
  `deadline` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

  --make sql queries necesseries to generate progress
  ---- retrieve a list of all projects along with a % completion
  ---- retrieve a list of all projects where a certain userId has some tasks assigned




# Dump of table sessions
# ------------------------------------------------------------

CREATE TABLE `sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `token` varchar(100) NOT NULL DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)




# Dump of table subtasks
# ------------------------------------------------------------

-- CREATE TABLE `subtasks` (
--   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(100) NOT NULL DEFAULT '',
--   `milestones` varchar(100) NOT NULL DEFAULT '',
--   `completed` tinyint(1) NOT NULL,
--   `description` varchar(140) DEFAULT NULL,
--   `deadline` datetime DEFAULT NULL,
--   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `priority` tinyint(1) DEFAULT NULL,
--   `milestoneId` int(11) DEFAULT NULL,
--   PRIMARY KEY (`id`)




# Dump of table tasks
# ------------------------------------------------------------

CREATE TABLE `tasks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(140) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` enum('low', 'normal', 'high') DEFAULT 'normal',
  `projectId` int(11) NOT NULL, -- add foreign key
  `completed` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)




# Dump of table users
# ------------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(60) NOT NULL DEFAULT '',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)




# Dump of table usersForTask
# ------------------------------------------------------------

CREATE TABLE `usersForTask` (
  `userId` int(11) DEFAULT NULL,
  `taskId` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`taskId`) -- foreign keys for user and tasks



