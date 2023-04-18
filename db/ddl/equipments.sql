CREATE DATABASE equipments;

\c equipments;

CREATE EXTENSION postgis;

CREATE TABLE "MetereologicalOrgan" (
	"IdOrgan" INT GENERATED ALWAYS AS IDENTITY,
	"Name" VARCHAR(50) NOT NULL,
	PRIMARY KEY("IdOrgan")
);

CREATE TABLE "EquipmentLocation" (
	"IdLocation" INT GENERATED ALWAYS AS IDENTITY,
	"Location" geometry(point),
	"Name" VARCHAR(50) NOT NULL,
	PRIMARY KEY("IdLocation")
);

CREATE TYPE equipment_type AS ENUM ('station', 'pluviometer');

CREATE TABLE "EquipmentType" (
	"IdType" INT GENERATED ALWAYS AS IDENTITY,
	"Name" equipment_type, 
	PRIMARY KEY("IdType")
); 

CREATE TABLE "MetereologicalEquipment" (
	"IdEquipment" INT GENERATED ALWAYS AS IDENTITY,
	"IdEquipmentExternal" VARCHAR(50) NOT NULL,
	"Name" VARCHAR(50) NOT NULL,
	"FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
	"FK_Location" INT REFERENCES "EquipmentLocation"("IdLocation"),
	"FK_Type" INT REFERENCES "EquipmentType"("IdType"),
	PRIMARY KEY("IdEquipment"),
	UNIQUE("FK_Organ", "IdEquipmentExternal")
);
