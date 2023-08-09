\c government;

INSERT INTO public."User"
("Name", "Login", "Password", "Type", "CreatedAt", "UpdatedAt", "Email")
VALUES('admin', 'admin', '$2b$10$.Z6QCr5rODUW5Bz1zUoV9ehzQhbeQ5iWIlw9z.yvEwB44vsIalVa.', 'admin'::public.user_types, '2023-06-28 11:23:10.437', '2023-06-28 11:23:10.437', 'admin@gmail.com');

INSERT INTO public."Module"
("Name")
VALUES('news');
INSERT INTO public."Module"
("Name")
VALUES('user');
INSERT INTO public."Module"
("Name")
VALUES('register');

INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 1, true, true, NULL, '2023-08-02 09:14:46.077', '2023-08-02 09:14:46.077');
INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 2, true, true, NULL, '2023-08-02 09:14:46.081', '2023-08-02 09:14:46.081');
INSERT INTO public."User_Access"
("Fk_User", "Fk_Module", "Read", "Write", "Description", "CreatedAt", "UpdatedAt")
VALUES(1, 3, true, true, NULL, '2023-08-02 09:14:46.084', '2023-08-02 09:14:46.084');
