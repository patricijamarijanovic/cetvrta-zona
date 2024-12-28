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

CREATE SEQUENCE registration_seq
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
  verified BOOLEAN NOT NULL,
  verification_token VARCHAR(16) NOT NULL,
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
  contact_number VARCHAR(10),
  expertise VARCHAR(50),
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
  projectName VARCHAR(50) NOT NULL,
  projectDesc VARCHAR(1000) NOT NULL,
  typeOfWork VARCHAR(50) NOT NULL,
  beginningDate DATE NOT NULL,
  endDate DATE NOT NULL,
  projectLocation VARCHAR(255) NOT NULL,
  numRegisteredVolunteers INT NOT NULL,
  maxNumVolunteers INT NOT NULL,
  status VARCHAR(10) CHECK (status IN ('OPEN', 'CLOSED', 'IN_PROGRESS')) NOT NULL,
  projectID BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('project_seq'),
  urgent BOOLEAN NOT NULL,
  organizationID BIGINT NOT NULL,
  FOREIGN KEY (organizationID) REFERENCES organizations(id),
  CHECK(maxNumVolunteers >= numRegisteredVolunteers)

);

CREATE TABLE review
(
  reviewID INT NOT NULL PRIMARY KEY,
  rating INT NOT NULL,
  comment VARCHAR(500) NOT NULL,
  reviewDate DATE NOT NULL,
  projectID INT NOT NULL,
  organizationID BIGINT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projectID) REFERENCES projects(projectID),
  FOREIGN KEY (organizationID) REFERENCES organizations(id),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE registration
(
  registrationID BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('registration_seq'),
  registrationDate DATE NOT NULL,
  registrationStatus VARCHAR(50) NOT NULL,
  projectID INT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projectID) REFERENCES projects(projectID),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

INSERT INTO users (username, password, role, email)
VALUES ('admin', '$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a', 'ADMIN', 'admin@example.com');

