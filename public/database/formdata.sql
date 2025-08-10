CREATE TABLE formdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    form_id INT NOT NULL,
    submission_id INT NOT NULL,
    header_id INT NOT NULL,
    line_id INT NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    item_value TEXT
);
