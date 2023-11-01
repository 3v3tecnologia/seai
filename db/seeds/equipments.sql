\c equipments;

INSERT INTO "EquipmentType" ("Name")
VALUES ('station'), ('pluviometer');

INSERT INTO "MetereologicalEquipment" ("IdEquipmentExternal", "Name", "FK_Organ", "FK_Type", "Altitude")
VALUES ('32321', 'Fortaleza - Itaperi', 2, 1,30.4 );

INSERT INTO "MetereologicalOrgan"
("IdOrgan", "Name", "Host", "User", "Password")
VALUES(1, 'INMET', NULL, NULL, NULL);

INSERT INTO "MetereologicalOrgan"
("IdOrgan", "Name", "Host", "User", "Password")
VALUES(2, 'FUNCEME', 'ftp.funceme.br', 'pcds.funceme', 'kDnQgk1h');