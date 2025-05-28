-- --------------------------------------------------------
-- Table structure for table `user`
-- --------------------------------------------------------

CREATE TABLE "users" (
  id_user SERIAL PRIMARY KEY,
  username VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(100) NOT NULL,
  roles SMALLINT NOT NULL DEFAULT 3 CHECK (roles IN (1, 2, 3)) -- 1=Staff BloodBank,2=Staff Rumah Sakit,3=Default
);

-- Dumping data for table `user`
INSERT INTO "users" (username, email, password, roles) 
VALUES
('admin bloodbank', 'adminbloodbank@admin.com', 'admin123', 1),
('admin rumah sakit', 'adminhospital@admin.com', 'admin123', 2);

-- --------------------------------------------------------
-- Table structure for table `admin`
-- --------------------------------------------------------

CREATE TABLE admin (
    id_admin SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL UNIQUE,
    accessedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES "users"(id_user) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Dumping data for table `admin`
INSERT INTO admin (id_user, accessedAt) 
VALUES
(1, '2025-05-06 00:00:00'),
(2, '2025-05-06 00:00:00');

-- --------------------------------------------------------
-- Table structure for table `donor`
-- --------------------------------------------------------

CREATE TABLE donor (
  id_donor SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  city VARCHAR(200) NOT NULL,
  province VARCHAR(100) NOT NULL,
  bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
  rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
  phoneNumber VARCHAR(50) NOT NULL,
  lastDonorDate DATE NOT NULL
);

-- Dumping data for table `donor`
INSERT INTO donor 
(firstName, lastName, email, city, province, bloodType, rhesus,phoneNumber, lastDonorDate)
VALUES
('John', 'Doe', 'johndoe@example.com', 'Jakarta', 'DKI Jakarta', 'A','-','081234567890', '2023-12-01'),
('Jane', 'Smith', 'janesmith@example.com', 'Bandung', 'Jawa Barat', 'B','+','082345678901', '2023-11-15'),
('Mark', 'Johnson', 'markjohnson@example.com', 'Surabaya', 'Jawa Timur', 'O','+', '083456789012', '2023-10-10'),
('Alice', 'Brown', 'alicebrown@example.com', 'Yogyakarta', 'DI Yogyakarta', 'AB','-', '084567890123', '2023-09-05'),
('Robert', 'Davis', 'robertdavis@example.com', 'Medan', 'Sumatera Utara', 'O','+', '085678901234', '2023-08-20');

-- --------------------------------------------------------
-- Table structure for table `bloodUnit`
-- --------------------------------------------------------

CREATE TABLE bloodUnit (
    id_unit SERIAL PRIMARY KEY,
    id_donor INTEGER NOT NULL,
    volume FLOAT NOT NULL,
    bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
    rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
    status SMALLINT NOT NULL DEFAULT 1 CHECK (status IN (1, 2)), -- 1 = in-stock, 2=out
    donorDate TIMESTAMP NOT NULL,
    expiryDate TIMESTAMP NOT NULL,
    FOREIGN KEY (id_donor) REFERENCES donor(id_donor) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Dumping data for table `bloodUnit`
INSERT INTO bloodUnit 
(id_donor, volume, bloodType,rhesus, status, donorDate, expiryDate)
VALUES
(1, 450.0,'A','+', 1, '2023-12-01 10:00:00', '2024-06-01 10:00:00'),
(2, 500.0,'B','-', 1, '2023-11-15 14:30:00', '2024-05-15 14:30:00'),
(3, 400.0,'O','+', 2, '2023-10-10 09:00:00', '2024-04-10 09:00:00'),
(4, 450.0,'AB','-', 1, '2023-09-05 11:00:00', '2024-03-05 11:00:00'),
(5, 500.0,'A','+', 1, '2023-08-20 08:30:00', '2024-02-20 08:30:00');

-- --------------------------------------------------------
-- Table structure for table `hospital`
-- --------------------------------------------------------

CREATE TABLE hospital (
  id_hospital SERIAL PRIMARY KEY,
  hospitalName VARCHAR(200) NOT NULL,
  hospitalNumber INTEGER NOT NULL,
  hospitalCity VARCHAR(200) NOT NULL,
  hospitalProvince VARCHAR(200) NOT NULL
);

-- Dumping data for table `hospital`
INSERT INTO hospital (hospitalName, hospitalNumber, hospitalCity, hospitalProvince)
VALUES 
('RSUP Dr. Sardjito', 274123456, 'Yogyakarta', 'DI Yogyakarta'),
('RSUD Dr. Soetomo', 315678901, 'Surabaya', 'Jawa Timur'),
('RSUP Dr. Hasan Sadikin', 222345678, 'Bandung', 'Jawa Barat'),
('RSUP Fatmawati', 213456789, 'Jakarta Selatan', 'DKI Jakarta'),
('RSUP Dr. Kariadi', 245678901, 'Semarang', 'Jawa Tengah');

-- --------------------------------------------------------
-- Table structure for table `doctor`
-- --------------------------------------------------------

CREATE TABLE doctor (
  id_doctor SERIAL PRIMARY KEY,
  id_hospital INTEGER NOT NULL,
  doctorName VARCHAR(200) NOT NULL,
  specialization VARCHAR(300) NOT NULL,
  email VARCHAR(200) NOT NULL,
  FOREIGN KEY (id_hospital) REFERENCES hospital(id_hospital) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Dumping data for table `doctor`
INSERT INTO doctor (id_hospital, doctorName, specialization, email)
VALUES
(1, 'dr. Anisa Putri', 'Spesialis Jantung', 'anisa.putri@example.com'),
(1, 'dr. Rudi Hartono', 'Spesialis Bedah Umum', 'rudi.hartono@example.com'),
(2, 'dr. Sari Dewi', 'Spesialis Anak', 'sari.dewi@example.com'),
(3, 'dr. Budi Santosa', 'Spesialis Saraf', 'budi.santosa@example.com'),
(2, 'dr. Lina Maharani', 'Spesialis Kulit & Kelamin', 'lina.maharani@example.com');

-- --------------------------------------------------------
-- Table structure for table `patient`
-- --------------------------------------------------------

CREATE TABLE patient (
  id_patient SERIAL PRIMARY KEY,
  id_hospital INTEGER NOT NULL,
  firstName VARCHAR(200) NOT NULL,
  lastName VARCHAR(200) NOT NULL,
  bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
  rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
  dateOfBirth DATE NOT NULL,
  gender VARCHAR(10),
  FOREIGN KEY (id_hospital) REFERENCES hospital(id_hospital) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Dumping data for table `patient`
INSERT INTO patient (id_hospital, firstName, lastName, bloodType, rhesus, dateOfBirth, gender)
VALUES
(1, 'John', 'Doe', 'O', '+', '1985-02-15', 'Male'),
(2, 'Jane', 'Smith', 'A', '-', '1990-06-30', 'Female'),
(1, 'Michael', 'Johnson', 'B', '+', '2000-11-25', 'Male'),
(3, 'Emily', 'Davis', 'AB', '-', '1988-07-10', 'Female'),
(2, 'Daniel', 'Brown', 'O', '+', '1975-03-14', 'Male');

-- --------------------------------------------------------
-- Table structure for table `bloodStock`
-- --------------------------------------------------------

CREATE TABLE bloodStock (
  id_stock SERIAL PRIMARY KEY,
  id_bloodUnit INTEGER NOT NULL,
  bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
  rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
  volume FLOAT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (id_bloodUnit) REFERENCES bloodUnit(id_unit) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Dumping data for table `bloodStock`
INSERT INTO bloodStock (id_bloodUnit, bloodType, rhesus, volume, quantity)
VALUES 
(1, 'A', '+', 450.0, 10),
(2, 'B', '-', 350.0, 5),
(3, 'O', '+', 500.0, 8),
(4, 'AB', '+', 450.0, 12),
(5, 'A', '-', 400.0, 15);

-- --------------------------------------------------------
-- Table structure for table `request`
-- --------------------------------------------------------

CREATE TABLE request (
  id_request SERIAL PRIMARY KEY,
  id_patient INTEGER NOT NULL,
  id_doctor INTEGER NOT NULL,
  bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
  rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
  quantity INTEGER NOT NULL,
  urgency SMALLINT NOT NULL DEFAULT 0 CHECK (urgency IN (1, 2, 3)), -- 1=low,2=normal,3=high
  status SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2,3)), -- 0=waiting,1=approved,2=rejected
  requestedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_patient) REFERENCES patient(id_patient) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Dumping data for table `request`
INSERT INTO request (id_patient, id_doctor, bloodType, rhesus, quantity, urgency, status)
VALUES
(1, 1, 'A', '+', 2, 3, 0), -- High urgency, waiting
(2, 3,'B', '-', 1, 2, 1), -- Normal urgency, approved
(3, 4,'O', '+', 3, 1, 2), -- Low urgency, rejected
(4, 2,'AB', '-', 2, 3, 0), -- High urgency, waiting
(5, 5,'A', '-', 4, 2, 1); -- Normal urgency, approved

-- --------------------------------------------------------
-- Table structure for table `confirmed`
-- --------------------------------------------------------

CREATE TABLE confirmed (
  id_confirmed SERIAL PRIMARY KEY,
  id_patient INTEGER NOT NULL,
  id_doctor INTEGER NOT NULL,
  bloodType VARCHAR(2) NOT NULL CHECK (bloodType IN ('O', 'A', 'B', 'AB')),
  rhesus VARCHAR(1) NOT NULL CHECK (rhesus IN ('+', '-')),
  quantity INTEGER NOT NULL,
  urgency SMALLINT NOT NULL DEFAULT 0 CHECK (urgency IN (1, 2, 3)), -- 1=low,2=normal,3=high
  status SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)), -- 0=waiting,1=approved,2=rejected
  requestedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_patient) REFERENCES patient(id_patient) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor) ON DELETE CASCADE ON UPDATE CASCADE
);

