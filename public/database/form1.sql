DROP TABLE IF EXISTS form1_ecr;

CREATE TABLE form1_ecr (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Form metadata
    form_date DATE NOT NULL,                  -- date_ecr
    shift VARCHAR(10) NOT NULL,               -- shift_ecr
    technician VARCHAR(50) NOT NULL,          -- technician_ecr
    incharge VARCHAR(50) NOT NULL,            -- incharge_ecr

    -- 26 checklist items with 3 fields each
    ecr1_drop1 VARCHAR(20),  ecr1_drop2 VARCHAR(20),  ecr1_rem1 TEXT,
    ecr2_drop1 VARCHAR(20),  ecr2_drop2 VARCHAR(20),  ecr2_rem1 TEXT,
    ecr3_drop1 VARCHAR(20),  ecr3_drop2 VARCHAR(20),  ecr3_rem1 TEXT,
    ecr4_drop1 VARCHAR(20),  ecr4_drop2 VARCHAR(20),  ecr4_rem1 TEXT,
    ecr5_drop1 VARCHAR(20),  ecr5_drop2 VARCHAR(20),  ecr5_rem1 TEXT,
    ecr6_drop1 VARCHAR(20),  ecr6_drop2 VARCHAR(20),  ecr6_rem1 TEXT,
    ecr7_drop1 VARCHAR(20),  ecr7_drop2 VARCHAR(20),  ecr7_rem1 TEXT,
    ecr8_drop1 VARCHAR(20),  ecr8_drop2 VARCHAR(20),  ecr8_rem1 TEXT,
    ecr9_drop1 VARCHAR(20),  ecr9_drop2 VARCHAR(20),  ecr9_rem1 TEXT,
    ecr10_drop1 VARCHAR(20), ecr10_drop2 VARCHAR(20), ecr10_rem1 TEXT,
    ecr11_drop1 VARCHAR(20), ecr11_drop2 VARCHAR(20), ecr11_rem1 TEXT,
    ecr12_drop1 VARCHAR(20), ecr12_drop2 VARCHAR(20), ecr12_rem1 TEXT,
    ecr13_drop1 VARCHAR(20), ecr13_drop2 VARCHAR(20), ecr13_rem1 TEXT,
    ecr14_drop1 VARCHAR(20), ecr14_drop2 VARCHAR(20), ecr14_rem1 TEXT,
    ecr15_drop1 VARCHAR(20), ecr15_drop2 VARCHAR(20), ecr15_rem1 TEXT,
    ecr16_drop1 VARCHAR(20), ecr16_drop2 VARCHAR(20), ecr16_rem1 TEXT,
    ecr17_drop1 VARCHAR(20), ecr17_drop2 VARCHAR(20), ecr17_rem1 TEXT,
    ecr18_drop1 VARCHAR(20), ecr18_drop2 VARCHAR(20), ecr18_rem1 TEXT,
    ecr19_drop1 VARCHAR(20), ecr19_drop2 VARCHAR(20), ecr19_rem1 TEXT,
    ecr20_drop1 VARCHAR(20), ecr20_drop2 VARCHAR(20), ecr20_rem1 TEXT,
    ecr21_drop1 VARCHAR(20), ecr21_drop2 VARCHAR(20), ecr21_rem1 TEXT,
    ecr22_drop1 VARCHAR(20), ecr22_drop2 VARCHAR(20), ecr22_rem1 TEXT,
    ecr23_drop1 VARCHAR(20), ecr23_drop2 VARCHAR(20), ecr23_rem1 TEXT,
    ecr24_drop1 VARCHAR(20), ecr24_drop2 VARCHAR(20), ecr24_rem1 TEXT,
    ecr25_drop1 VARCHAR(20), ecr25_drop2 VARCHAR(20), ecr25_rem1 TEXT,
    ecr26_drop1 VARCHAR(20), ecr26_drop2 VARCHAR(20), ecr26_rem1 TEXT,

    -- Final remarks
    final_overalltext1 TEXT
);
