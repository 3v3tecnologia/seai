CREATE DATABASE newsletter;

\c newsletter;

CREATE TABLE "Sender"(
    "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    "Email" VARCHAR(64) UNIQUE NOT NULL,
    "Organ" VARCHAR(26) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY("Id")
);

CREATE TABLE "Subscriber"(
    "Id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    "Name" VARCHAR(26) NOT NULL,
    "Email" VARCHAR(254) UNIQUE NOT NULL,
	"CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
   PRIMARY KEY("Id")
);

CREATE TABLE "News" (
	"Id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE),
	"Fk_Sender" int4 NOT NULL,
	"Title" varchar(50) NOT NULL,
	"Description" varchar(50) NOT NULL,
	"Content" bytea NOT NULL,
	"CreatedAt" timestamp NOT NULL DEFAULT now(),
	"UpdatedAt" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "News_pkey" PRIMARY KEY ("Id")
);

CREATE TABLE "NewsJob"(
    "Fk_Job" uuid NOT NULL,
    "Fk_News" int4 NOT NULL
);

-- public."News" foreign keys

ALTER TABLE "News" ADD CONSTRAINT "News_Fk_Sender_fkey" FOREIGN KEY ("Fk_Sender") REFERENCES "Sender"("Id");
