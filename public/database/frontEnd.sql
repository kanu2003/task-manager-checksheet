CREATE TABLE frontend (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  header_id INT NOT NULL,
  header_title VARCHAR(255),
  header_desc TEXT,
  line_id INT NOT NULL,
  line_desc TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
