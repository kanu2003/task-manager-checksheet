CREATE TABLE master_config_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,       -- 'Credentials'
    label VARCHAR(100),                  -- login ID (used only for credentials)
    value VARCHAR(255) NOT NULL,         -- password (or name for other categories)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
