CREATE TABLE users
(
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY,
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
  FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE organizations
(
  organization_name VARCHAR(255) NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users(id),
  UNIQUE (organization_name)
);

CREATE TABLE projects
(
  naziv VARCHAR(50) NOT NULL,
  opis VARCHAR(1000) NOT NULL,
  pocetak DATE NOT NULL,
  kraj DATE NOT NULL,
  lokacija VARCHAR(255) NOT NULL,
  brojVolontera INT NOT NULL,
  status VARCHAR(10) CHECK (status IN ('otvoren', 'zatvoren', 'u tijeku')) NOT NULL,
  projektID INT NOT NULL PRIMARY KEY,
  hitnost VARCHAR(3) CHECK (hitnost IN ('da', 'ne')) NOT NULL,
  organization_id BIGINT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE recenzije
(
  recenzijaID INT NOT NULL PRIMARY KEY,
  ocjena INT NOT NULL,
  komentar VARCHAR(500) NOT NULL,
  datumRecenzije DATE NOT NULL,
  projektID INT NOT NULL,
  organization_id BIGINT NOT NULL,
  volunteer_id BIGINT NOT NULL,
  FOREIGN KEY (projektID) REFERENCES projects(projektID),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);

CREATE TABLE prijava
(
  prijavaID INT NOT NULL PRIMARY KEY,
  datumPrijave DATE NOT NULL,
  statusPrijave VARCHAR(50) NOT NULL,
  projektID INT NOT NULL,
  volunteer_id BIGINT NOT NULL,
  FOREIGN KEY (projektID) REFERENCES projects(projektID),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);
