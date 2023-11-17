CREATE DATABASE logs;

\c logs;

CREATE TYPE log_status AS ENUM ('error', 'info','warning');

CREATE TYPE user_actions AS ENUM ('create', 'delete','update');

CREATE TABLE IF NOT EXISTS "User" (
	"Id" INTEGER GENERATED ALWAYS AS IDENTITY,
	"User" INTEGER DEFAULT NULL,
	"Action" user_actions,
	"Table" text NOT NULL,
	"Description" text NOT NULL,
	"Time" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY("Id")
);

CREATE TABLE IF NOT EXISTS "ETL" (
	"Id" INTEGER GENERATED ALWAYS AS IDENTITY,
	"Time" TIMESTAMP NOT NULL DEFAULT NOW(),
	"Status" log_status,
	"Operation" VARCHAR(25) DEFAULT NULL,
	"Message" TEXT NOT NULL,
	"FK_Equipment" INTEGER,
	PRIMARY KEY("Id")
);

CREATE TABLE IF NOT EXISTS "Newsletter" (
	"Id" INTEGER GENERATED ALWAYS AS IDENTITY,
	"Status" log_status,
	"Operation" VARCHAR(25) NOT NULL,
	"Message" TEXT NOT NULL,
	"Time" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY("Id")
);