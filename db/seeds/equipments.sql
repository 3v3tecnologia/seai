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

-- INSERT INTO "Et0"
-- ("Value", "FK_Station_Read")
-- VALUES(4.911332, 1);

INSERT INTO "ReadStations"
("Time", "Hour", "TotalRadiation", "MaxRelativeHumidity", "MinRelativeHumidity", "AverageRelativeHumidity", "MaxAtmosphericTemperature", "MinAtmosphericTemperature", "AverageAtmosphericTemperature", "AtmosphericPressure", "WindVelocity","Et0", "FK_Organ", "FK_Equipment")
VALUES
    ('2022-10-01', 0, 95, 61, 71, 88, 82, 78, 32, 67, 64,32, 2, 4),
    ('2022-10-02', 1, 60, 33, 61, 38, 27, 67, 51, 82, 52,32, 2, 4)