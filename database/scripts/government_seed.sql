\c government;

INSERT INTO public."User" ("Name","Login","Email","Password","Type","CreatedAt","UpdatedAt","Status","Code") VALUES
	 ('super-admin','super-admin','admin@gmail.com','$2b$10$TI5C2cUFWzeXFabq0IxFaOW4vmx49njQYWl581yic1GRzgPWwnXdy','admin','2023-06-28 11:23:10.437','2024-05-17 15:40:42.685','registered','c431ab3e43c5dc6f2c57');


INSERT INTO public."Module"
("Name")
VALUES('news');
INSERT INTO public."Module"
("Name")
VALUES('user');
INSERT INTO public."Module"
("Name")
VALUES('register');
INSERT INTO public."Module"
("Name")
VALUES('jobs');

INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 1, true, true, NULL, '2023-08-02 09:14:46.077', '2023-08-02 09:14:46.077');

INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 2, true, true, NULL, '2023-08-02 09:14:46.081', '2023-08-02 09:14:46.081');

INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 3, true, true, NULL, '2023-08-02 09:14:46.084', '2023-08-02 09:14:46.084');

INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 4, true, true, NULL, '2023-08-02 09:14:46.084', '2023-08-02 09:14:46.084');