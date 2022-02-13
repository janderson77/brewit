DROP DATABSE IF EXISTS brewit_db;
CREATE DATABASE brewit_db;

\c brewit_db;

CREATE TABLE "User" (
    "userid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "username" VARCHAR(20) NOT NULL,
    "email" TEXT   NOT NULL,
    "password" TEXT   NOT NULL,
    "firstname" TEXT   NOT NULL,
    "lastname" TEXT   NOT NULL,
    "profileimgurl" TEXT DEFAULT "https://media.npr.org/assets/img/2021/08/17/gettyimages-135773550-bb02ff79dd836d6e4170d4bc555423f24fa29d5e.jpg"
);

CREATE TABLE "Brews" (
    "brewid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewname" TEXT   NOT NULL,
    "brewstartdate" date   NOT NULL,
    "brewtype" INTEGER   NOT NULL,
    "brewprimarycontainer" INTEGER   NOT NULL,
    "brewsecondarycontainer" INTEGER,
    "brewyeast" TEXT   NOT NULL,
    "brewingredients" arr   NOT NULL,
    "brewadditives" arr   NOT NULL,
    "brewstartinggravity" float   NOT NULL,
    "brewstartingtemp" text
);

CREATE TABLE "User_Brews" (
    "userid" INTEGER   NOT NULL,
    "brewid" INTEGER   NOT NULL
);

CREATE TABLE "Brews_BrewSteps" (
    "brewid" INTEGER   NOT NULL,
    "brewstepid" INTEGER   NOT NULL
);

CREATE TABLE "Brews_BrewNotes" (
    "brewid" INTEGER   NOT NULL,
    "brewnotesid" INTEGER   NOT NULL
);

CREATE TABLE "BrewRatings" (
    "userid" INTEGER   NOT NULL,
    "brewid" INTEGER   NOT NULL,
    -- 1-5
    "brewstarrating" INTEGER   NOT NULL,
    "brewreview" TEXT   NOT NULL
);

CREATE TABLE "BrewSteps" (
    "stepid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- regular step or final step
    "steptype" TEXT NOT NULL,
    "stepdate" DATE DEFAULT NOW(),
    "stepstartgravity" FLOAT   NOT NULL,
    "stependgravity" FLOAT   NOT NULL,
    "stepnotes" TEXT   NOT NULL
);

CREATE TABLE "BrewTypes" (
    "brewtypeid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewtypename" TEXT   NOT NULL,
    "brewtypemainingredient" TEXT   NOT NULL
);

CREATE TABLE "BrewNotes" (
    "brewnotesid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewnotesbody" TEXT   NOT NULL
);

CREATE TABLE "Containers" (
    "containerid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "containername" TEXT   NOT NULL,
    "containersize" FLOAT   NOT NULL,
    "containerimgurl" TEXT   NOT NULL
);

ALTER TABLE "Brews" ADD CONSTRAINT "fk_Brews_brewtype" FOREIGN KEY("brewtype")
REFERENCES "BrewTypes" ("brewtypeid");

ALTER TABLE "Brews" ADD CONSTRAINT "fk_Brews_brewprimarycontainer" FOREIGN KEY("brewprimarycontainer")
REFERENCES "Containers" ("containerid");

ALTER TABLE "Brews" ADD CONSTRAINT "fk_Brews_brewsecondarycontainer" FOREIGN KEY("brewsecondarycontainer")
REFERENCES "Containers" ("containerid");

ALTER TABLE "User_Brews" ADD CONSTRAINT "fk_User_Brews_userid" FOREIGN KEY("userid")
REFERENCES "User" ("userid");

ALTER TABLE "User_Brews" ADD CONSTRAINT "fk_User_Brews_brewid" FOREIGN KEY("brewid")
REFERENCES "Brews" ("brewid");

ALTER TABLE "Brews_BrewSteps" ADD CONSTRAINT "fk_Brews_BrewSteps_brewid" FOREIGN KEY("brewid")
REFERENCES "Brews" ("brewid");

ALTER TABLE "Brews_BrewSteps" ADD CONSTRAINT "fk_Brews_BrewSteps_brewstepid" FOREIGN KEY("brewstepid")
REFERENCES "BrewSteps" ("stepid");

ALTER TABLE "Brews_BrewNotes" ADD CONSTRAINT "fk_Brews_BrewNotes_brewid" FOREIGN KEY("brewid")
REFERENCES "Brews" ("brewid");

ALTER TABLE "Brews_BrewNotes" ADD CONSTRAINT "fk_Brews_BrewNotes_brewnotesid" FOREIGN KEY("brewnotesid")
REFERENCES "BrewNotes" ("brewnotesid");

ALTER TABLE "BrewRatings" ADD CONSTRAINT "fk_BrewRatings_userid" FOREIGN KEY("userid")
REFERENCES "User" ("userid");

ALTER TABLE "BrewRatings" ADD CONSTRAINT "fk_BrewRatings_brewid" FOREIGN KEY("brewid")
REFERENCES "Brews" ("brewid");

