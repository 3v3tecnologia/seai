\c equipments;

INSERT INTO "MetereologicalOrgan" ("Name")
VALUES ('INMET'), ('FUNCEME');

INSERT INTO "EquipmentType" ("Name")
VALUES ('station'), ('pluviometer');

INSERT INTO "MetereologicalEquipment" ("IdEquipmentExternal", "Name", "FK_Organ", "FK_Type", "Altitude")
VALUES ('32321', 'Fortaleza - Itaperi', 2, 1,30.4 );
