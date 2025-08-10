DROP TABLE IF EXISTS shift_check_sheet_2;

CREATE TABLE form7_shift2 (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Form metadata
    form_date DATE NOT NULL,               -- "date"
    shift VARCHAR(10) NOT NULL,            -- "shift"
    technician VARCHAR(50) NOT NULL,       -- "technician"
    incharge VARCHAR(50) NOT NULL,         -- "incharge"

    -- Equipment Checklist items (20 rows × 2 fields each: drop1, rem1)
    eq1_drop1 VARCHAR(20),   eq1_rem1 TEXT,
    eq2_drop1 VARCHAR(20),   eq2_rem1 TEXT,
    eq3_drop1 VARCHAR(20),   eq3_rem1 TEXT,
    eq4_drop1 VARCHAR(20),   eq4_rem1 TEXT,
    eq5_drop1 VARCHAR(20),   eq5_rem1 TEXT,
    eq6_drop1 VARCHAR(20),   eq6_rem1 TEXT,
    eq7_drop1 VARCHAR(20),   eq7_rem1 TEXT,
    eq8_drop1 VARCHAR(20),   eq8_rem1 TEXT,
    eq9_drop1 VARCHAR(20),   eq9_rem1 TEXT,
    eq10_drop1 VARCHAR(20),  eq10_rem1 TEXT,
    eq11_drop1 VARCHAR(20),  eq11_rem1 TEXT,
    eq12_drop1 VARCHAR(20),  eq12_rem1 TEXT,
    eq13_drop1 VARCHAR(20),  eq13_rem1 TEXT,
    eq14_drop1 VARCHAR(20),  eq14_rem1 TEXT,
    eq15_drop1 VARCHAR(20),  eq15_rem1 TEXT,
    eq16_drop1 VARCHAR(20),  eq16_rem1 TEXT,
    eq17_drop1 VARCHAR(20),  eq17_rem1 TEXT,
    eq18_drop1 VARCHAR(20),  eq18_rem1 TEXT,
    eq19_drop1 VARCHAR(20),  eq19_rem1 TEXT,
    eq20_drop1 VARCHAR(20),  eq20_rem1 TEXT,

    -- Final multiline remark
    final_overalltext1 TEXT
);
