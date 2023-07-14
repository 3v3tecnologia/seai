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