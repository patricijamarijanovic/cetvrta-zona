CREATE SEQUENCE users_seq
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;

CREATE SEQUENCE project_seq
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;

CREATE SEQUENCE prijava_seq
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;
	
CREATE TABLE users
(
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('users_seq'), 
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  UNIQUE (email)
);

CREATE TABLE admin
(
  id BIGINT NOT NULL PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE volunteers
(
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE organizations
(
  organization_name VARCHAR(255) NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (organization_name)
);

CREATE TABLE projects
(
  naziv VARCHAR(50) NOT NULL,
  opis VARCHAR(1000) NOT NULL,
  pocetak DATE NOT NULL,
  kraj DATE NOT NULL,
  lokacija VARCHAR(255) NOT NULL,
  brojPrijavljenihVolontera INT NOT NULL,
  maksBrojVolontera INT NOT NULL,
  status VARCHAR(10) CHECK (status IN ('OTVOREN', 'ZATVOREN', 'U_TIJEKU')) NOT NULL,
  projektID BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('users_seq'),
  hitan BOOLEAN NOT NULL,
  organizationID BIGINT NOT NULL,
  FOREIGN KEY (organizationID) REFERENCES organizations(id),
  CHECK(maksBrojVolontera >= brojPrijavljenihVolontera)
);

CREATE TABLE recenzije
(
  recenzijaID INT NOT NULL PRIMARY KEY,
  ocjena INT NOT NULL,
  komentar VARCHAR(500) NOT NULL,
  datumRecenzije DATE NOT NULL,
  projektID INT NOT NULL,
  organizationID BIGINT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projektID) REFERENCES projects(projektID),
  FOREIGN KEY (organizationID) REFERENCES organizations(id),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE prijava
(
  prijavaID BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('prijava_seq'),
  datumPrijave DATE NOT NULL,
  statusPrijave VARCHAR(50) NOT NULL,
  projektID INT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projektID) REFERENCES projects(projektID),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);
