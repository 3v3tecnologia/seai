CREATE DATABASE management;

\c management;

CREATE TABLE "Crop"(
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL,
    "Etr_Cycle_Total" VARCHAR(50),
    "Etp_Cycle_Total" VARCHAR(50),
	"Et0_Total" VARCHAR(50),
    "Etp_Cycle_Maximium" VARCHAR(50),
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
    "Stage_Cycle" SMALLSERIAL PRIMARY KEY,
	"FK_Crop" INTEGER NOT NULL,
    "Stage_Title" VARCHAR(50) NOT NULL,
    "Duration_In_Days" SMALLINT NOT NULL,
    "KC" REAL NOT NULL
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

CREATE TABLE "Estudos"(
	"Id_Bacia" INTEGER NOT NULL,
	"Id_Cultura" INTEGER NOT NULL,
	"Safra" INTEGER NOT NULL,
	"Cultivo" INTEGER NOT NULL,
	"ProdutividadePorQuilo" REAL NOT NULL,
	"ProdutividadePorMetros" REAL NOT NULL
);

CREATE TABLE "Pesos"(
	"Id_Bacia" INTEGER NOT NULL,
	"Id_Cultura" INTEGER NOT NULL,
	"SegurancaProdutivaPorQuilo" REAL DEFAULT NULL,
	"SegurancaProdutivaPorMetros" REAL DEFAULT NULL,
	"SegurancaEconomicaPorMetros" REAL DEFAULT NULL,
	"SegurancaEconomicaPorHectar" REAL DEFAULT NULL,
	"SegurancaSocialPorMetros" REAL DEFAULT NULL,
	"SegurancaSocialPorHectar" REAL DEFAULT NULL,
	"SegurancaHidricaPorHectar" REAL DEFAULT NULL,
	"SegurancaHidricaPorMetros" REAL DEFAULT NULL
);