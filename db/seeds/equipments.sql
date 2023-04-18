\c equipments;

INSERT INTO "MetereologicalOrgan" ("Name")
VALUES ('INMET'), ('FUNCEME');

INSERT INTO "EquipmentType" ("Name")
VALUES ('station'), ('pluviometer');

INSERT INTO "MetereologicalEquipment" ("IdEquipmentExternal", "Name", "FK_Organ", "FK_Type")
VALUES ('A305', 'Fortaleza-CE', 1, 1);

