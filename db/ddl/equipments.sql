CREATE DATABASE equipments;

\c equipments;

CREATE EXTENSION postgis;

CREATE TABLE "MetereologicalOrgan" (
	"IdOrgan" INT GENERATED ALWAYS AS IDENTITY,
	"Name" VARCHAR(50) NOT NULL,
	PRIMARY KEY("IdOrgan")
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
	"FK_Type" INT REFERENCES "EquipmentType"("IdType"),
	PRIMARY KEY("IdEquipment"),
	UNIQUE("FK_Organ", "IdEquipmentExternal")
);

CREATE TABLE "EquipmentLocation" (
	"IdLocation" INT GENERATED ALWAYS AS IDENTITY,
	"Location" geometry(point),
	"Name" VARCHAR(50) NOT NULL,
	"FK_Equipment" INT REFERENCES "MetereologicalEquipment"("IdEquipment"),
	PRIMARY KEY("IdLocation")
);

CREATE TABLE "ReadTime" (
	"IdTime" INT GENERATED ALWAYS AS IDENTITY,
	"Time" TIMESTAMP NOT NULL, 
	PRIMARY KEY("IdTime")
);


CREATE TABLE "ReadPluviometers" (
	"IdRead" INT GENERATED ALWAYS AS IDENTITY,
	"Value" REAL NOT NULL,
	"FK_Time" INT REFERENCES "ReadTime"("IdTime"),	
	"FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
	"FK_Equipment" INT REFERENCES "MetereologicalEquipment"("IdEquipment"),
	PRIMARY KEY("IdRead"),
	UNIQUE("FK_Organ", "FK_Time", "FK_Equipment")
);

CREATE TABLE "ReadStations" (
	"IdRead" INT GENERATED ALWAYS AS IDENTITY,
	"TotalRadiation" REAL NOT NULL,
	"RelativeHumidity" REAL NOT NULL,
	"AtmosphericTemperature" REAL NOT NULL,
	"WindVelocity" REAL NOT NULL,
	"FK_Time" INT REFERENCES "ReadTime"("IdTime"),	
	"FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
	"FK_Equipment" INT REFERENCES "MetereologicalEquipment"("IdEquipment"),
	PRIMARY KEY("IdRead"),
	UNIQUE("FK_Organ", "FK_Time", "FK_Equipment")
);

CREATE TABLE "Et0" (
	"Value" REAL NOT NULL,
	"FK_Station_Read" INT REFERENCES "ReadStations"("IdRead"),	
	PRIMARY KEY("FK_Station_Read")
);
