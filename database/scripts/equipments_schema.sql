CREATE DATABASE equipments;

\c equipments;

CREATE EXTENSION postgis;

CREATE TABLE public."MetereologicalOrgan" (
        "IdOrgan" INT GENERATED ALWAYS AS IDENTITY,
        "Name" VARCHAR(50) NOT NULL,
        "Host" VARCHAR(50) DEFAULT NULL,
        "User" VARCHAR(50) DEFAULT NULL,
        "Password" VARCHAR(50) DEFAULT NULL,
        PRIMARY KEY("IdOrgan")
);

CREATE TYPE equipment_type AS ENUM ('station', 'pluviometer');

CREATE TABLE public."EquipmentType" (
        "IdType" INT GENERATED ALWAYS AS IDENTITY,
        "Name" equipment_type,
        PRIMARY KEY("IdType")
);

CREATE TABLE public."MetereologicalEquipment" (
        "IdEquipment" INT GENERATED ALWAYS AS IDENTITY,
        "IdEquipmentExternal" VARCHAR(50) NOT NULL,
        "Name" VARCHAR(50) NOT NULL,
        "Altitude" REAL DEFAULT NULL,
        "Location" geometry(point) DEFAULT NULL,
        "FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
        "FK_Type" INT REFERENCES "EquipmentType"("IdType"),
        "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "UpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "Enable" BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY("IdEquipment"),
        UNIQUE("FK_Organ", "IdEquipmentExternal")
);

CREATE TABLE public."LastUpdatedAt"(
    fk_organ INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
    completedon timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT fk_organ_pkey PRIMARY KEY (fk_organ)
);


CREATE TABLE public."ReadPluviometers" (
        "IdRead" INT GENERATED ALWAYS AS IDENTITY,
        "Value" REAL,
        "Time" DATE NOT NULL,
        "Hour" SMALLINT DEFAULT NULL,
        "FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
        "FK_Equipment" INT REFERENCES "MetereologicalEquipment"("IdEquipment") ON DELETE CASCADE,
        PRIMARY KEY("IdRead")
);

CREATE TABLE public."ReadStations" (
        "IdRead" INT GENERATED ALWAYS AS IDENTITY,
        "Time" DATE NOT NULL,
        "Hour" SMALLINT DEFAULT NULL,
        "TotalRadiation" REAL DEFAULT NULL,
        "MaxRelativeHumidity" REAL DEFAULT NULL,
        "MinRelativeHumidity" REAL DEFAULT NULL,
        "AverageRelativeHumidity" REAL DEFAULT NULL,
        "MaxAtmosphericTemperature" REAL DEFAULT NULL,
        "MinAtmosphericTemperature" REAL DEFAULT NULL,
        "AverageAtmosphericTemperature" REAL DEFAULT NULL,
        "AtmosphericPressure" REAL DEFAULT NULL,
        "WindVelocity" REAL DEFAULT NULL,
        "Et0" REAL DEFAULT NULL,
        "FK_Organ" INT REFERENCES "MetereologicalOrgan"("IdOrgan"),
        "FK_Equipment" INT REFERENCES "MetereologicalEquipment"("IdEquipment") ON DELETE CASCADE,
        PRIMARY KEY("IdRead")
);