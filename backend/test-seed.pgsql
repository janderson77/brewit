DROP DATABASE IF EXISTS brewit_db_test;
CREATE DATABASE brewit_db_test;

\c brewit_db_test;

CREATE TABLE users (
    userid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(20) NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profileimgurl TEXT,
    is_admin BOOLEAN DEFAULT false,
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE brewtypes (
    brewtypeid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brewtypename TEXT NOT NULL,
    brewtypemainingredient TEXT NOT NULL
);

CREATE TABLE containers (
    containerid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    containername TEXT NOT NULL,
    containersize FLOAT NOT NULL, --In gallons
    containerdescription TEXT,
    containerimgurl TEXT NOT NULL
);

CREATE TABLE brews (
    brewid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brewname TEXT NOT NULL,
    brewstartdate DATE DEFAULT NOW(),
    brewtype INTEGER NOT NULL,
    brewprimarycontainer INTEGER,
    brewsecondarycontainer INTEGER,
    brewyeast TEXT,
    brewingredients TEXT[],
    brewadditives TEXT[],
    brewstartinggravity float,
    brewstartingtemp text
);

CREATE TABLE brewnotes (
    brewnotesid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brewnotesbody TEXT NOT NULL
);

CREATE TABLE brewsteps (
    stepid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    isfinalstep BOOLEAN NOT NULL, -- regular step is false, final step is true
    stepdate DATE DEFAULT NOW(),
    stepstartgravity FLOAT NOT NULL,
    stependgravity FLOAT NOT NULL,
    stepnotes TEXT NOT NULL
);

CREATE TABLE user_brews (
    userid INTEGER REFERENCES users ON DELETE CASCADE,
    brewid INTEGER REFERENCES brews ON DELETE CASCADE
);

CREATE TABLE brews_brewsteps (
    brewid INTEGER REFERENCES brews ON DELETE CASCADE,
    stepid INTEGER REFERENCES brewsteps ON DELETE CASCADE
);

CREATE TABLE brews_brewnotes (
    brewid INTEGER REFERENCES brews ON DELETE CASCADE,
    brewnotesid INTEGER REFERENCES brewnotes ON DELETE CASCADE
);

CREATE TABLE brewratings (
    userid INTEGER REFERENCES users,
    brewid INTEGER REFERENCES brews ON DELETE CASCADE,
    brewstarrating INTEGER NOT NULL, -- 1-5
    brewreview TEXT NOT NULL
);