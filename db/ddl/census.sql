CREATE DATABASE census;

\c census;

CREATE EXTENSION postgis;

CREATE TABLE "Contacts"(
	"Id" SERIAL PRIMARY KEY,
	"Address" VARCHAR(100),
	"County"  VARCHAR(50),
	"Number" VARCHAR(5),
	"CEP" VARCHAR(12),
	"Complement" VARCHAR(100),
	"Neighborhood" VARCHAR(100),
	"Email" VARCHAR(5),
	"Phone" VARCHAR(30)
);

CREATE TABLE "Pit_Company"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Location" INTEGER NOT NULL REFERENCES "Contacts"("Id"),
	"Company" VARCHAR(100),
	"CNPJ" VARCHAR(20),
	"Responsible" VARCHAR(100),
	"CREA" VARCHAR(30)
);

CREATE TYPE well_nature_enum AS ENUM(
	'Pending'
);

CREATE TYPE revetment_enum AS ENUM(
	'Pending'
);

CREATE TYPE finish_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Pit"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Company" INTEGER NOT NULL REFERENCES "Pit_Company"("Id"),
	"Pit_Nature" well_nature_enum,
	"Depth" REAL,
	"Mounth_Height" REAL,
	"Diameter" REAL,
	"From" REAL,
	"Until" REAL,
	"Installation_Date" REAL,
	"Quota_Terrain" REAL,
	"Filter" REAL,
	"Revetment" revetment_enum,
	"finish" finish_enum
);

/*FK_Reponsible aponta para quem?*/
CREATE TABLE "Register"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Responsible" INTEGER NOT NULL,
	"FK_Pit" INTEGER REFERENCES "Pit"("Id"),
	"FK_Location" INTEGER REFERENCES "Contacts"("Id"),
	"Register_Number"  VARCHAR(10),
	"Name_Register" VARCHAR(100),
	"Description"  VARCHAR(500)
);

/*Id image é a url???*/
CREATE TABLE "Images"(
	"Id" SERIAL PRIMARY KEY,
	"Id_Image" VARCHAR(20), 
	"Fk_Register" INTEGER NOT NULL  REFERENCES "Register"("Id"),
	"Coordenates" GEOMETRY,
	"Description" VARCHAR(1000)
);

CREATE TYPE enterprise_type_enum as ENUM(
	'Not informed',
	'Not applicable',
	'Public administration',
	'Farming',
	'Industry',
	'Commerce and Service',
	'Sanitation'
);

/*FK_Correspondence o que é isso?*/
CREATE TABLE "Legal_Entity"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Register" INTEGER NOT NULL REFERENCES "Register"("Id"),
	"FK_Correspondence" INTEGER REFERENCES "Contacts"("Id"),
	"Name" VARCHAR(100),
	"Fantasy_Name" VARCHAR(100),
	"CNAE" VARCHAR(100),
	"State_Enrollment" VARCHAR(100),
	"Number_Workers" SMALLINT,
	"Enterprise_Type" enterprise_type_enum,
	"Description"  VARCHAR(500)
);

CREATE TABLE "Physical_Person"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Register" INTEGER NOT NULL REFERENCES "Register"("Id"),
	"FK_Correspondence" INTEGER REFERENCES "Contacts"("Id"),
	"Name" VARCHAR(100),
	"RG"  VARCHAR(20),
	"CPF"  VARCHAR(20),
	"County"  VARCHAR(20),
	"Role" VARCHAR(30)
);

CREATE TYPE month_enum AS ENUM
(
    'January', 
    'February',
    'March', 
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
);

CREATE TABLE "Average_Catchment"(
	"Id" SERIAL PRIMARY KEY,
	"Month" month_enum,
	"Flow" VARCHAR(100),
	"Day_Hours" REAL,
	"Month_Volume" SMALLINT,
	"Register_Date" DATE
);

CREATE TYPE county_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Water_Resource"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Register" INTEGER NOT NULL REFERENCES "Register"("Id"),
	"Name" VARCHAR(100),
	"County"  county_enum,
	"Grant" VARCHAR(100),
	"Grant_Number" VARCHAR(100),
	"Coordenates" GEOMETRY
);

CREATE TABLE "Superficial"(
	"Fk_Water_Resource" INTEGER REFERENCES "Water_Resource"("Id"),
	"FK_Catchment" INTEGER REFERENCES "Average_Catchment"("Id"),
	"Mine_Origin" VARCHAR(100),
	"Basin" VARCHAR(20),
	"Lake_River_Stream" VARCHAR(100)
);

CREATE TYPE underground_type_enum AS ENUM(
	'Not informed',
	'Not applicable',
	'Cacimba or Pit',
	'Tubular Pit'
); 


CREATE TABLE "Underground"(
	"Fk_Water_Resource" INTEGER REFERENCES "Water_Resource"("Id"),
	"FK_Catchment" INTEGER REFERENCES "Average_Catchment"("Id"),
	"Underground_Type" underground_type_enum, 
	"Depth" SMALLINT,
	"LAU" VARCHAR(20)
);

CREATE TABLE "Use"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Register" INTEGER REFERENCES "Register"("Id")
);

CREATE TYPE creation_type_enum AS ENUM(
	'Birds',
	'Bovines',
	'Equines',
	'Caprines',
	'Ovines',
	'Swines',
	'Others'
);

CREATE TABLE "Animals"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER REFERENCES "Use"("Id"),
	"Heads_Number" INTEGER,
	"Creation_Type" creation_type_enum,
	"Commercialization" REAL,
	"PerCapta_Consumption" REAL
);

CREATE TABLE "Irrigation"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER REFERENCES "Use"("Id"),
	"Blade_Area" REAL,
	"Use_Reservoir" BOOLEAN DEFAULT NULL,
	"Depth_Average" REAL,
	"Profitability" REAL
);

CREATE TYPE provider_type_enum AS ENUM(
	'Not informed',
	'Not applicable',
	'Direct Administration',
	'Indirect Administration',
	'Authorized',
	'Dealership'
);

CREATE TABLE "Sanitation"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"District" VARCHAR(200),
	"Entity" VARCHAR(200),
	"County" VARCHAR(200),
	"PerCapita_Flow" REAL,
	"Served_Population" INTEGER,
	"Project_Horizon" INTEGER,
	"Forecast_Losses" REAL,
	"Concession_Number" INTEGER,
	"Population_Project" INTEGER,
	"Provider_Type" provider_type_enum
);

CREATE TABLE "Irrigated_Cultures"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Irrigation" INTEGER NOT NULL REFERENCES "Irrigation"("Id"),
	"Culture" VARCHAR(50) NOT NULL,
	"Irrigated_Area" REAL,
	"Per_Day" SMALLINT,
	"Cultivation_Period" REAL,
	"Irrigation_Type" VARCHAR(20)
);

CREATE TYPE creation_aquaculture_type_enum AS ENUM(
	'Pending'
);

CREATE TYPE structure_type_enum AS ENUM(
	'Not informed',
	'Not applicable',
	'Dam or weir in a water course',
	'Dam to tank network/gage'
);

CREATE TYPE local_structure_enum AS ENUM(
	'Not informed',
	'Not applicable'
);

CREATE TYPE activity_enum AS ENUM(
	'Not informed',
	'Not applicable'
);

CREATE TABLE "Aquaculture"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Number_Of_Tanks" SMALLINT,
	"Water_Blade" REAL,
	"Creation_Type" creation_aquaculture_type_enum,
	"Structure_Type" structure_type_enum,
	"Water_Mirror" REAL,
	"Depth_Average" REAL,
	"Local_Structure" local_structure_enum,
	"Species" VARCHAR(200),
	"Activity" activity_enum,
	"Prod1" REAL,
	"Prod2" REAL
);

CREATE TABLE "Industry"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Elaborated_Products" VARCHAR(100),
	"CNAE_Type" VARCHAR(20),
	"Industrial_Consume" REAL,
	"Forecast_Losses" REAL
);

CREATE TYPE establishment_type_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Human_Consume"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Establishment_Type" establishment_type_enum,
	"People_Quantity" INTEGER,
	"Day_Quantity" REAL
);

CREATE TYPE proccess_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Mineration"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Humidity" REAL,
	"Prop_Water_Pulp" REAL,
	"PerCapita_Contribuition" REAL,
	"CNAE" VARCHAR(20),
	"Product" VARCHAR(100),
	"ProdMax" REAL,
	"Proccess" proccess_enum
);

CREATE TABLE "Special_Destination"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Use" VARCHAR(200)
);

CREATE TABLE "Environmental_Control"(
	"Id" SERIAL PRIMARY KEY,
	"Type" VARCHAR(200),
	"Others" VARCHAR(200)
);

CREATE TYPE characteristics_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Affluent_Dilution"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"District" VARCHAR(200),
	"PerCapita_Contribuition" REAL,
	"Served_Population" INTEGER,
	"Created_Products" VARCHAR(200),
	"Daily_Prodction" REAL,
	"Flow" REAL,
	"Hours_Cap_Lanc_Day" REAL,
	"Characteristics" characteristics_enum,
	"Others" VARCHAR(200)
);

CREATE TABLE "Military"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Use" VARCHAR(200)
);

CREATE TABLE "Managed_RH"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Type" VARCHAR(200),
	"Others" VARCHAR(200)
);

CREATE TYPE fuel_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Thermoelectric"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Potential_Installed" INTEGER,
	"Production_Monthly" REAL,
	"Energy_Average" INTEGER,
	"Fuel" fuel_enum
);

CREATE TABLE "Vehicle_Wash"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Use" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Effluent_Tratament" BOOLEAN,
	"Recirculation" BOOLEAN,
	"Reuse" BOOLEAN,
	"Flow" REAL,
	"Vehicle_Day" REAL,
	"Daily_Volume" REAL
);

CREATE TYPE operation_type_enum AS ENUM(
	'Pending'
);

CREATE TYPE installation_type_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Pumps"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Pit" INTEGER NOT NULL REFERENCES "Pit"("Id"),
	"Operation_Type" operation_type_enum,
	"Installation_Type" installation_type_enum,
	"Quote_Suction" REAL,
	"Sieve" REAL,
	"Capacity" INTEGER,
	"Base" INTEGER,
	"Top" INTEGER,
	"Distance_Fosse" REAL,
	"Aquifer" VARCHAR(100),
	"Test_Date" DATE,
	"Test_Time" REAL
);

CREATE TABLE "Test_Flow"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Pump" INTEGER NOT NULL REFERENCES "Pumps"("Id"),
	"Static_Level" REAL,
	"Dynamic_Level" REAL,
	"Static_Column" REAL,
	"Dynamic_Column" REAL,
	"Lowering" REAL,
	"Flow_Stabilization" REAL
);

CREATE TYPE aquifer_penetration_enum AS ENUM(
	'Pending'
);

CREATE TYPE aquifer_conditions_enum AS ENUM(
	'Pending'
);

CREATE TYPE test_type_enum AS ENUM(
	'Pending'
);

CREATE TABLE "Test_Pumping"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Pump" INTEGER NOT NULL REFERENCES "Use"("Id"),
	"Pumping_Flow" REAL,
	"Storage_Coefficient" BOOLEAN,
	"Flow" BOOLEAN,
	"Permeability" REAL,
	"Transmissibility" REAL,
	"Hydraulic_Conductivity" REAL,
	"Test_Type" test_type_enum,
	"Aquifer_Penetration" aquifer_penetration_enum,
	"Aquifer_Conditions" aquifer_conditions_enum
);

CREATE TABLE "Hydrochemistry"(
	"Id" SERIAL PRIMARY KEY,
	"Fk_Pit" INTEGER NOT NULL REFERENCES "Pit"("Id"),
	"Collect_Date" DATE,
	"Analysis_Date" DATE,
	"Bicarbonate" REAL,
	"Calcium" REAL,
	"Carbonates" REAL,
	"Chlorides" REAL,
	"Conductivity" REAL,
	"Total_Hardiness" REAL,
	"Total_Iron" REAL,
	"Fluorides" REAL,
	"Phosphates" REAL,
	"Magnesium" REAL,
	"Nitrates" REAL,
	"Nitrites" REAL,
	"Ph" REAL,
	"Potassium" REAL,
	"Sodium" REAL,
	"Solid_Dissolved" REAL,
	"Sulfates" REAL,
	"Turbidity" REAL,
	"Temperature" REAL,
	"Fecal_Coliforms" REAL,
	"Total_Coliforms" REAL
);