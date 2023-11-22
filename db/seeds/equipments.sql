\c equipments;

INSERT INTO "EquipmentType" ("Name")
VALUES ('station'), ('pluviometer');

INSERT INTO "MetereologicalOrgan"
("Name", "Host", "User", "Password")
VALUES('INMET', NULL, NULL, NULL);

INSERT INTO "MetereologicalOrgan"
("Name", "Host", "User", "Password")
VALUES('FUNCEME', 'ftp.funceme.br', 'pcds.funceme', 'kDnQgk1h');

INSERT INTO "MetereologicalEquipment"
("IdEquipmentExternal", "Name", "Altitude", "FK_Organ", "FK_Type")
VALUES('32321', 'Fortaleza - Itaperi', 30.4, 2, 1);

INSERT INTO "MetereologicalEquipment"
("IdEquipmentExternal", "Name", "Altitude", "FK_Organ", "FK_Type")
VALUES('TESTE', 'PLUV', 1.0, 2, 2);

INSERT INTO "MetereologicalEquipment"
("IdEquipmentExternal", "Name", "Altitude", "FK_Organ", "FK_Type")
VALUES('23978', 'ABAIARA', 1.0, 2, 2);

INSERT INTO "MetereologicalEquipment"
("IdEquipmentExternal", "Name", "Altitude", "FK_Organ", "FK_Type")
VALUES('TEST', 'ESTACAO-TESTE', 1.0, 2, 1);

INSERT INTO "ReadStations"
("Time", "Hour", "TotalRadiation", "MaxRelativeHumidity", "MinRelativeHumidity", "AverageRelativeHumidity", "MaxAtmosphericTemperature", "MinAtmosphericTemperature", "AverageAtmosphericTemperature", "AtmosphericPressure", "WindVelocity", "FK_Organ", "FK_Equipment")
VALUES('2023-11-20', NULL, 255.68, 87.5, 52.41, 74.87, 32.97, 25.29, 28.31, 1008.94, 3.5, 2, 1);
INSERT INTO "ReadStations"
("Time", "Hour", "TotalRadiation", "MaxRelativeHumidity", "MinRelativeHumidity", "AverageRelativeHumidity", "MaxAtmosphericTemperature", "MinAtmosphericTemperature", "AverageAtmosphericTemperature", "AtmosphericPressure", "WindVelocity", "FK_Organ", "FK_Equipment")
VALUES('2023-11-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 6);

INSERT INTO "Et0"
("Value", "FK_Station_Read")
VALUES(4.911332, 1);
