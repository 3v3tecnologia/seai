CREATE DATABASE government;

\c government;

CREATE TYPE user_types AS ENUM ('admin', 'standard');

CREATE TABLE "User"(
   "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
   "Name" VARCHAR(30) DEFAULT NULL,
   "Login" VARCHAR(20) UNIQUE DEFAULT NULL,
   "Email" VARCHAR(254) UNIQUE NOT NULL,
   "Password" VARCHAR(254) DEFAULT NULL,
	"Type" user_types,
	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
   PRIMARY KEY("Id")
);

CREATE TABLE "Module"(
   "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
   "Name" VARCHAR(20) UNIQUE NOT NULL,
   PRIMARY KEY("Id")
);

-- CREATE TYPE permission_types AS ENUM ('1','2','3');

-- CREATE TABLE "User_Access"(
--    "Fk_User" INTEGER NOT NULL REFERENCES "User"("Id") ON DELETE CASCADE,
--    "Fk_Module" INTEGER NOT NULL REFERENCES "Module"("Id"),
--    "Permission" permission_types,
--    "Description" VARCHAR(50) NOT NULL,
-- 	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
-- 	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
-- );
CREATE TABLE "User_Access"(
   "Fk_User" INTEGER NOT NULL REFERENCES "User"("Id") ON DELETE CASCADE,
   "Fk_Module" INTEGER NOT NULL REFERENCES "Module"("Id"),
   "Read" BOOLEAN DEFAULT NULL,
   "Write" BOOLEAN DEFAULT NULL,
   "Description" VARCHAR(50) DEFAULT NULL,
	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "FAQ"(
   "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
   "Question" VARCHAR(60) UNIQUE NOT NULL,
   "Answer" TEXT NOT NULL,
   "Order" SMALLINT NOT NULL, 
	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
   PRIMARY KEY("Id")
);

CREATE TABLE "Category"(
   "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
   "Title" VARCHAR(50) UNIQUE NOT NULL,
   "Description" VARCHAR(50) NOT NULL,
	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
   PRIMARY KEY("Id")
);

CREATE TABLE "FAQ_Category"(
   "Fk_FAQ" INTEGER REFERENCES "FAQ"("Id")  ON DELETE CASCADE,
	"Fk_Category" INTEGER REFERENCES "Category"("Id")  ON DELETE CASCADE
);

CREATE TABLE "API_Key" (
	"Id" int4 NOT NULL,
	"Key" varchar(254) NOT NULL,
	"Type" varchar(20) NOT NULL DEFAULT 'EXTERNAL'::character varying,
	"Enabled" bool NULL,
	"CreatedAt" timestamp NOT NULL DEFAULT now(),
	"UpdatedAt" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "Api_Key_Key_key" UNIQUE ("Key"),
	CONSTRAINT "Api_Key_pkey" PRIMARY KEY ("Id")
);

CREATE TABLE "API_Key" (
	"Id" int4 NOT NULL,
	"Key" varchar(254) NOT NULL,
	"Type" varchar(20) NOT NULL DEFAULT 'EXTERNAL'::character varying,
	"Enabled" bool NULL,
	"CreatedAt" timestamp NOT NULL DEFAULT now(),
	"UpdatedAt" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "Api_Key_Key_key" UNIQUE ("Key"),
	CONSTRAINT "Api_Key_pkey" PRIMARY KEY ("Id")
);