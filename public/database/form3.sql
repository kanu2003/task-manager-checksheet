DROP TABLE IF EXISTS gauges_check_sheet_ims;

CREATE TABLE form3_gauge (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Form-level fields
    form_date DATE NOT NULL,                  -- date_gauges
    shift VARCHAR(10) NOT NULL,               -- shift_gauges
    technician VARCHAR(50) NOT NULL,          -- technician_gauges
    incharge VARCHAR(50) NOT NULL,            -- incharge_gauges

    -- X-Ray Profile Gauge (12 items)
    xray1_drop1 VARCHAR(20), xray1_rem1 TEXT,
    xray2_drop1 VARCHAR(20), xray2_rem1 TEXT,
    xray3_drop1 VARCHAR(20), xray3_rem1 TEXT,
    xray4_drop1 VARCHAR(20), xray4_rem1 TEXT,
    xray5_drop1 VARCHAR(20), xray5_rem1 TEXT,
    xray6_drop1 VARCHAR(20), xray6_rem1 TEXT,
    xray7_drop1 VARCHAR(20), xray7_rem1 TEXT,
    xray8_drop1 VARCHAR(20), xray8_rem1 TEXT,
    xray9_drop1 VARCHAR(20), xray9_rem1 TEXT,
    xray10_drop1 VARCHAR(20), xray10_rem1 TEXT,
    xray11_drop1 VARCHAR(20), xray11_rem1 TEXT,
    xray12_drop1 VARCHAR(20), xray12_rem1 TEXT,

    -- Final textarea inside first section (xray13)
    xray13_overalltext1 TEXT,

    -- Flatness Gauge (22 items)
    flat1_drop1 VARCHAR(20), flat1_rem1 TEXT,
    flat2_drop1 VARCHAR(20), flat2_rem1 TEXT,
    flat3_drop1 VARCHAR(20), flat3_rem1 TEXT,
    flat4_drop1 VARCHAR(20), flat4_rem1 TEXT,
    flat5_drop1 VARCHAR(20), flat5_rem1 TEXT,
    flat6_drop1 VARCHAR(20), flat6_rem1 TEXT,
    flat7_drop1 VARCHAR(20), flat7_rem1 TEXT,
    flat8_drop1 VARCHAR(20), flat8_rem1 TEXT,
    flat9_drop1 VARCHAR(20), flat9_rem1 TEXT,
    flat10_drop1 VARCHAR(20), flat10_rem1 TEXT,
    flat11_drop1 VARCHAR(20), flat11_rem1 TEXT,
    flat12_drop1 VARCHAR(20), flat12_rem1 TEXT,
    flat13_drop1 VARCHAR(20), flat13_rem1 TEXT,
    flat14_drop1 VARCHAR(20), flat14_rem1 TEXT,
    flat15_drop1 VARCHAR(20), flat15_rem1 TEXT,
    flat16_drop1 VARCHAR(20), flat16_rem1 TEXT,
    flat17_drop1 VARCHAR(20), flat17_rem1 TEXT,
    flat18_drop1 VARCHAR(20), flat18_rem1 TEXT,
    flat19_drop1 VARCHAR(20), flat19_rem1 TEXT,
    flat20_drop1 VARCHAR(20), flat20_rem1 TEXT,
    flat21_drop1 VARCHAR(20), flat21_rem1 TEXT,
    flat22_drop1 VARCHAR(20), flat22_rem1 TEXT,

    -- Final remark
    final_overalltext1 TEXT
);
