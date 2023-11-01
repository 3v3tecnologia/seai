\c equipments;

INSERT INTO "EquipmentType" ("Name")
VALUES ('station'), ('pluviometer');

INSERT INTO "MetereologicalOrgan"
("Name", "Host", "User", "Password")
VALUES('INMET', NULL, NULL, NULL);

INSERT INTO "MetereologicalOrgan"
("Name", "Host", "User", "Password")
VALUES('FUNCEME', 'ftp.funceme.br', 'pcds.funceme', 'kDnQgk1h');

INSERT INTO "MetereologicalEquipment" ("IdEquipmentExternal", "Name", "FK_Organ", "FK_Type", "Altitude")
VALUES ('32321', 'Fortaleza - Itaperi', 2, 1,30.4 );
