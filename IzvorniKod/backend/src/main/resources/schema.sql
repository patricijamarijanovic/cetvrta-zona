CREATE TABLE users
(
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  verified BOOLEAN NOT NULL,
  verification_token VARCHAR(16),
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
  projectlocation VARCHAR(255) NOT NULL,
  numRegisteredVolunteers INT NOT NULL,
  maxNumVolunteers INT NOT NULL,
  status VARCHAR(10) CHECK (status IN ('OPEN', 'CLOSED', 'IN_PROGRESS')) NOT NULL,
  projectID BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  urgent BOOLEAN NOT NULL,
  organizationID BIGINT NOT NULL,
  FOREIGN KEY (organizationID) REFERENCES organizations(id),
  CHECK(maxNumVolunteers >= numRegisteredVolunteers)

);

CREATE TABLE review
(
  reviewID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  rating INT NOT NULL,
  comment VARCHAR(500) NOT NULL,
  reviewDate DATE NOT NULL,
  projectID INT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projectID) REFERENCES projects(projectID),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE reviewResponse 
(
  responseID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  originalReviewID INT NOT NULL,
  comment VARCHAR(500) NOT NULL,
  responseDate DATE NOT NULL,
  FOREIGN KEY (originalReviewID) REFERENCES review(reviewID)
);

CREATE TABLE registration
(
  registrationID BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  registrationDate DATE NOT NULL,
  registrationStatus VARCHAR(50) NOT NULL,
  projectID INT NOT NULL,
  volunteerID BIGINT NOT NULL,
  FOREIGN KEY (projectID) REFERENCES projects(projectID),
  FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE complaints
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL
);

CREATE TABLE newsletter
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    volunteerId BIGINT NOT NULL,
    organizationId BIGINT NOT NULL,
    FOREIGN KEY (organizationId) REFERENCES organizations(id),
    FOREIGN KEY (volunteerId) REFERENCES volunteers(id)
);

CREATE TABLE applications (
    applicationId BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteerId BIGINT NOT NULL,
    projectId BIGINT NOT NULL,
    status VARCHAR(255),
    FOREIGN KEY (projectId) REFERENCES projects(projectID),
    FOREIGN KEY (volunteerId) REFERENCES volunteers(id)
);

CREATE TABLE image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    data BLOB,
    type VARCHAR(255)
);

CREATE TABLE volunteer_skills
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    volunteerID BIGINT NOT NULL,
    skill VARCHAR(100),
    FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE volunteer_picture
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    volunteerId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,
    FOREIGN KEY (volunteerId) REFERENCES volunteers(id),
    FOREIGN KEY (imageId) REFERENCES image(id)
);

CREATE TABLE organization_picture
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    organizationId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,
    FOREIGN KEY (organizationId) REFERENCES organizations(id),
    FOREIGN KEY (imageId) REFERENCES image(id)
);

CREATE TABLE project_picture
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    projectId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(projectId),
    FOREIGN KEY (imageId) REFERENCES image(id)
);

CREATE TABLE volunteer_interests
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    volunteerID BIGINT NOT NULL,
    interest VARCHAR(100),
    FOREIGN KEY (volunteerID) REFERENCES volunteers(id)
);

CREATE TABLE organization_areas
(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    organizationID BIGINT NOT NULL,
    area VARCHAR(100),
    FOREIGN KEY (organizationID) REFERENCES organizations(id)
);

INSERT INTO users (username, password, role, email, verified)
VALUES ('admin', '$2a$10$hd.K4YAUxErbA/F1IQvsAetXSaRHBG80cKTKFaJhUBuwGDhZDwu7a', 'ADMIN', 'admin@example.com', true);

