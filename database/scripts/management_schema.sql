CREATE DATABASE management;

\c management;

CREATE TABLE "Crop"(
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL,
    "Etr_Cycle_Total" VARCHAR(50) DEFAULT NULL,
    "Etp_Cycle_Total" VARCHAR(50) DEFAULT NULL,
    "Et0_Total" VARCHAR(50) DEFAULT NULL,
    "Etp_Cycle_Maximium" VARCHAR(50) DEFAULT NULL,
    "Location_Name" VARCHAR(50),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Soil"(
    "Id" serial PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL,
    "Location_Name" VARCHAR(50),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Crop_Cycle"(
    "FK_Crop" INTEGER NOT NULL REFERENCES "Crop"("Id")  ON DELETE CASCADE,
    "Stage_Title" VARCHAR(50) NOT NULL,
    "Start" SMALLINT NOT NULL,
    "End" SMALLINT NOT NULL,
    "KC" REAL NOT NULL,
    "Increment" SMALLINT DEFAULT 0
);

CREATE TABLE "Chemical_Characteristics"(
  "Id" INTEGER NOT NULL UNIQUE REFERENCES "Soil"("Id"),
  "Electrical_Conductivity" REAL,
  "Ph" REAL,
  "Carbon" REAL,
  "Phosphor" REAL,
  "Magnesium" REAL,
  "Sodium" REAL,
  "Aliminium_Catium" REAL,
  "Hydrogen" REAL,
  "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY("Id")
);

CREATE TABLE "Physics_Characteristics"(
  "Id" INTEGER NOT NULL UNIQUE REFERENCES "Soil"("Id"),
  "Calhaus" REAL,
  "Gravel" REAL,
  "Fine_Land" REAL,
  "Horizontal_Cementing_Degree" REAL,
  "Real_Density" REAL,
  "Natural_Clay" REAL,
  "Gross_Sand" REAL,
  "Fine_Sand" REAL,
  "Silite" REAL,
  "Clay" REAL,
  "Apparently_Density" REAL,
  "Relation_Textural" REAL,
  "Equivalent_Humidity" REAL,
  "Atm1_Humidity" REAL,
  "Atm2_Humidity" REAL,
  "Atm3_Humidity" REAL,
  "Residual_Humidity" REAL,
  "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY("Id")
);

-- CREATE TABLE "Studies"(
--   "Id_Basin" INTEGER NOT NULL,
--   "Crop" VARCHAR(50) NOT NULL,
--   "HarvestDuration" INTEGER NOT NULL,
--   "CultivationPeriod" INTEGER NOT NULL, 
--   "Consumption" REAL NOT NULL,
--   "Productivity" REAL NOT NULL 
-- );

-- CREATE TABLE "Weights"(
--   "Id_Basin" INTEGER NOT NULL,
--   "Crop" VARCHAR(50) NOT NULL,
--   "ProductivityPerHectare" REAL DEFAULT NULL,
--   "ProductivityPerMeters" REAL DEFAULT NULL,
--   "ProfitabilityPerMeters" REAL DEFAULT NULL,
--   "ProfitabilityPerHectare" REAL DEFAULT NULL,
--   "JobsPerHectare" REAL DEFAULT NULL,
--   "JobsPerMeters" REAL DEFAULT NULL,
--   "WaterConsumption" REAL DEFAULT NULL
-- );