DROP DATABASE IF EXISTS brewit_db;
CREATE DATABASE brewit_db;

\c brewit_db;

CREATE TABLE "users" (
    "userid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "username" VARCHAR(20) NOT NULL,
    "email" TEXT   NOT NULL,
    "password" TEXT   NOT NULL,
    "firstname" TEXT   NOT NULL,
    "lastname" TEXT   NOT NULL,
    "profileimgurl" TEXT DEFAULT "https://media.npr.org/assets/img/2021/08/17/gettyimages-135773550-bb02ff79dd836d6e4170d4bc555423f24fa29d5e.jpg",
    "is_admin" BOOLEAN DEFAULT false,
    UNIQUE("username", "email")
);

CREATE TABLE "brewtypes" (
    "brewtypeid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewtypename" TEXT   NOT NULL,
    "brewtypemainingredient" TEXT   NOT NULL
);

CREATE TABLE "containers" (
    "containerid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "containername" TEXT   NOT NULL,
    "containersize" FLOAT   NOT NULL,
    "containerimgurl" TEXT   NOT NULL
);

CREATE TABLE "brews" (
    "brewid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewname" TEXT NOT NULL,
    "brewstartdate" DATE DEFAULT NOW(),
    "brewtype" INTEGER NOT NULL,
    "brewprimarycontainer" INTEGER,
    "brewsecondarycontainer" INTEGER,
    "brewyeast" TEXT,
    "brewingredients" TEXT[],
    "brewadditives" TEXT[],
    "brewstartinggravity" float,
    "brewstartingtemp" text
);

CREATE TABLE "brewnotes" (
    "brewnotesid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "brewnotesbody" TEXT   NOT NULL
);

CREATE TABLE "brewsteps" (
    "stepid" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- regular step or final step
    "steptype" TEXT NOT NULL,
    "stepdate" DATE DEFAULT NOW(),
    "stepstartgravity" FLOAT   NOT NULL,
    "stependgravity" FLOAT   NOT NULL,
    "stepnotes" TEXT   NOT NULL
);

CREATE TABLE "user_brews" (
    "userid" INTEGER REFERENCES "users" ON DELETE CASCADE,
    "brewid" INTEGER REFERENCES "brews" ON DELETE CASCADE
);

CREATE TABLE "brews_brewsteps" (
    "brewid" INTEGER   NOT NULL,
    "brewstepid" INTEGER   NOT NULL
);

CREATE TABLE "brews_brewnotes" (
    "brewid" INTEGER   NOT NULL,
    "brewnotesid" INTEGER   NOT NULL
);

CREATE TABLE "brewratings" (
    "userid" INTEGER   NOT NULL,
    "brewid" INTEGER   NOT NULL,
    -- 1-5
    "brewstarrating" INTEGER   NOT NULL,
    "brewreview" TEXT   NOT NULL
);

ALTER TABLE "brews" ADD CONSTRAINT "fk_Brews_brewtype" FOREIGN KEY("brewtype")
REFERENCES "brewtypes" ("brewtypeid");

ALTER TABLE "brews" ADD CONSTRAINT "fk_Brews_brewprimarycontainer" FOREIGN KEY("brewprimarycontainer")
REFERENCES "containers" ("containerid");

ALTER TABLE "brews" ADD CONSTRAINT "fk_Brews_brewsecondarycontainer" FOREIGN KEY("brewsecondarycontainer")
REFERENCES "containers" ("containerid");

ALTER TABLE "brews_brewsteps" ADD CONSTRAINT "fk_Brews_BrewSteps_brewid" FOREIGN KEY("brewid")
REFERENCES "brews" ("brewid");

ALTER TABLE "brews_brewsteps" ADD CONSTRAINT "fk_Brews_BrewSteps_brewstepid" FOREIGN KEY("brewstepid")
REFERENCES "brewsteps" ("stepid");

ALTER TABLE "brews_brewnotes" ADD CONSTRAINT "fk_Brews_BrewNotes_brewid" FOREIGN KEY("brewid")
REFERENCES "brews" ("brewid");

ALTER TABLE "brews_brewnotes" ADD CONSTRAINT "fk_Brews_BrewNotes_brewnotesid" FOREIGN KEY("brewnotesid")
REFERENCES "brewnotes" ("brewnotesid");

ALTER TABLE "brewratings" ADD CONSTRAINT "fk_BrewRatings_userid" FOREIGN KEY("userid")
REFERENCES "users" ("userid");

ALTER TABLE "brewratings" ADD CONSTRAINT "fk_BrewRatings_brewid" FOREIGN KEY("brewid")
REFERENCES "brews" ("brewid");

