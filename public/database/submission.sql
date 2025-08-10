CREATE TABLE submission (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    date DATE NOT NULL,
    shift VARCHAR(5),
    technician_ic VARCHAR(100),
    shift_ic VARCHAR(100),
    form_id INT,
    approval_status VARCHAR(10) DEFAULT 'NO',
    approver_remark VARCHAR(255),
    filled_status VARCHAR(10) DEFAULT 'YES',
    filling_remark VARCHAR(255),
    overall_remark TEXT
);
