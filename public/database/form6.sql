DROP TABLE IF EXISTS shift_check_sheet_plate_mill;

CREATE TABLE form6_shift (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Form header fields
    form_date DATE NOT NULL,
    shift VARCHAR(10) NOT NULL,
    technician VARCHAR(50) NOT NULL,
    incharge VARCHAR(50) NOT NULL,

    -- Lubrication systems (9 items × 3 fields each)
    lub1_text1 VARCHAR(100),
    lub1_drop1 VARCHAR(20),
    lub1_rem1 TEXT,

    lub2_text1 VARCHAR(100),
    lub2_drop1 VARCHAR(20),
    lub2_rem1 TEXT,

    lub3_text1 VARCHAR(100),
    lub3_drop1 VARCHAR(20),
    lub3_rem1 TEXT,

    lub4_text1 VARCHAR(100),
    lub4_drop1 VARCHAR(20),
    lub4_rem1 TEXT,

    lub5_text1 VARCHAR(100),
    lub5_drop1 VARCHAR(20),
    lub5_rem1 TEXT,

    lub6_text1 VARCHAR(100),
    lub6_drop1 VARCHAR(20),
    lub6_rem1 TEXT,

    lub7_text1 VARCHAR(100),
    lub7_drop1 VARCHAR(20),
    lub7_rem1 TEXT,

    lub8_text1 VARCHAR(100),
    lub8_drop1 VARCHAR(20),
    lub8_rem1 TEXT,

    lub9_text1 VARCHAR(100),
    lub9_drop1 VARCHAR(20),
    lub9_rem1 TEXT,

    -- Descaler Room (4 items × 3 fields each)
    des1_text1 VARCHAR(100),
    des1_text2 VARCHAR(100),
    des1_rem1 TEXT,

    des2_text1 VARCHAR(100),
    des2_text2 VARCHAR(100),
    des2_rem1 TEXT,

    des3_text1 VARCHAR(100),
    des3_text2 VARCHAR(100),
    des3_rem1 TEXT,

    des4_text1 VARCHAR(100),
    des4_text2 VARCHAR(100),
    des4_rem1 TEXT,

    -- DCW Area (3 items)
    dcw1_text1 VARCHAR(100),
    dcw1_drop1 VARCHAR(20),
    dcw1_rem1 TEXT,

    dcw2_text1 VARCHAR(100),
    dcw2_drop1 VARCHAR(20),
    dcw2_rem1 TEXT,

    dcw3_text1 VARCHAR(100),
    dcw3_drop1 VARCHAR(20),
    dcw3_rem1 TEXT,

    -- ICW Area (3 items)
    icw1_text1 VARCHAR(100),
    icw1_drop1 VARCHAR(20),
    icw1_rem1 TEXT,

    icw2_text1 VARCHAR(100),
    icw2_drop1 VARCHAR(20),
    icw2_rem1 TEXT,

    icw3_text1 VARCHAR(100),
    icw3_drop1 VARCHAR(20),
    icw3_rem1 TEXT,

    -- Hydraulic System (8 items)
    hyd1_text1 VARCHAR(100),
    hyd1_drop1 VARCHAR(20),
    hyd1_rem1 TEXT,

    hyd2_text1 VARCHAR(100),
    hyd2_drop1 VARCHAR(20),
    hyd2_rem1 TEXT,

    hyd3_text1 VARCHAR(100),
    hyd3_drop1 VARCHAR(20),
    hyd3_rem1 TEXT,

    hyd4_text1 VARCHAR(100),
    hyd4_drop1 VARCHAR(20),
    hyd4_rem1 TEXT,

    hyd5_text1 VARCHAR(100),
    hyd5_drop1 VARCHAR(20),
    hyd5_rem1 TEXT,

    hyd6_text1 VARCHAR(100),
    hyd6_drop1 VARCHAR(20),
    hyd6_rem1 TEXT,

    hyd7_text1 VARCHAR(100),
    hyd7_drop1 VARCHAR(20),
    hyd7_rem1 TEXT,

    hyd8_text1 VARCHAR(100),
    hyd8_drop1 VARCHAR(20),
    hyd8_rem1 TEXT,

    -- Ventilation & Blower (19 items × 3 fields each: drop1, drop2, rem1)
    vent1_drop1 VARCHAR(20),
    vent1_drop2 VARCHAR(20),
    vent1_rem1 TEXT,

    vent2_drop1 VARCHAR(20),
    vent2_drop2 VARCHAR(20),
    vent2_rem1 TEXT,

    vent3_drop1 VARCHAR(20),
    vent3_drop2 VARCHAR(20),
    vent3_rem1 TEXT,

    vent4_drop1 VARCHAR(20),
    vent4_drop2 VARCHAR(20),
    vent4_rem1 TEXT,

    vent5_drop1 VARCHAR(20),
    vent5_drop2 VARCHAR(20),
    vent5_rem1 TEXT,

    vent6_drop1 VARCHAR(20),
    vent6_drop2 VARCHAR(20),
    vent6_rem1 TEXT,

    vent7_drop1 VARCHAR(20),
    vent7_drop2 VARCHAR(20),
    vent7_rem1 TEXT,

    vent8_drop1 VARCHAR(20),
    vent8_drop2 VARCHAR(20),
    vent8_rem1 TEXT,

    vent9_drop1 VARCHAR(20),
    vent9_drop2 VARCHAR(20),
    vent9_rem1 TEXT,

    vent10_drop1 VARCHAR(20),
    vent10_drop2 VARCHAR(20),
    vent10_rem1 TEXT,

    vent11_drop1 VARCHAR(20),
    vent11_drop2 VARCHAR(20),
    vent11_rem1 TEXT,

    vent12_drop1 VARCHAR(20),
    vent12_drop2 VARCHAR(20),
    vent12_rem1 TEXT,

    vent13_drop1 VARCHAR(20),
    vent13_drop2 VARCHAR(20),
    vent13_rem1 TEXT,

    vent14_drop1 VARCHAR(20),
    vent14_drop2 VARCHAR(20),
    vent14_rem1 TEXT,

    vent15_drop1 VARCHAR(20),
    vent15_drop2 VARCHAR(20),
    vent15_rem1 TEXT,

    vent16_drop1 VARCHAR(20),
    vent16_drop2 VARCHAR(20),
    vent16_rem1 TEXT,

    vent17_drop1 VARCHAR(20),
    vent17_drop2 VARCHAR(20),
    vent17_rem1 TEXT,

    vent18_drop1 VARCHAR(20),
    vent18_drop2 VARCHAR(20),
    vent18_rem1 TEXT,

    vent19_drop1 VARCHAR(20),
    vent19_drop2 VARCHAR(20),
    vent19_rem1 TEXT,

    -- Final remark
    final_multi1 TEXT
);
