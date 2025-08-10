DROP TABLE IF EXISTS fm_motors_check_sheet;

CREATE TABLE form2_fm (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Header fields
    form_date DATE NOT NULL,               -- from "date_fm"
    shift VARCHAR(10) NOT NULL,            -- from "shift_fm"
    technician VARCHAR(50) NOT NULL,       -- from "technician_fm"
    incharge VARCHAR(50) NOT NULL,         -- from "incharge_fm"

    -- Checklist items: 32 rows, each with only rem1 (text field)
    fm1_rem1 TEXT,
    fm2_rem1 TEXT,
    fm3_rem1 TEXT,
    fm4_rem1 TEXT,
    fm5_rem1 TEXT,
    fm6_rem1 TEXT,
    fm7_rem1 TEXT,
    fm8_rem1 TEXT,
    fm9_rem1 TEXT,
    fm10_rem1 TEXT,
    fm11_rem1 TEXT,
    fm12_rem1 TEXT,
    fm13_rem1 TEXT,
    fm14_rem1 TEXT,
    fm15_rem1 TEXT,
    fm16_rem1 TEXT,
    fm17_rem1 TEXT,
    fm18_rem1 TEXT,
    fm19_rem1 TEXT,
    fm20_rem1 TEXT,
    fm21_rem1 TEXT,
    fm22_rem1 TEXT,
    fm23_rem1 TEXT,
    fm24_rem1 TEXT,
    fm25_rem1 TEXT,
    fm26_rem1 TEXT,
    fm27_rem1 TEXT,
    fm28_rem1 TEXT,
    fm29_rem1 TEXT,
    fm30_rem1 TEXT,
    fm31_rem1 TEXT,
    fm32_rem1 TEXT,

    -- Final observation
    final_overalltext1 TEXT
);
