const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3035;

const masterConfigPath = path.join(__dirname, 'master.config');
let MASTER_PASSWORD = '';
try {
  const masterConfigContent = fs.readFileSync(masterConfigPath, 'utf-8');
  const parsedMasterConfig = dotenv.parse(masterConfigContent);
  MASTER_PASSWORD = parsedMasterConfig.MASTER_PASSWORD;
  if (!MASTER_PASSWORD) {
    console.warn('SERVER: MASTER_PASSWORD not found in master.config or is empty. Settings login will not work as expected.');
  } else {
    console.log('SERVER: Master password loaded. Length:', MASTER_PASSWORD.length);
  }
} catch (error) {
  console.error(`SERVER: Error loading master.config at ${masterConfigPath}:`, error.message);
  console.warn('SERVER: Settings login will not be functional without master.config.');
}

app.use(session({
  secret: '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

const formFolderMap = {
  form1: 'ecr_tunnels_basements',
  form2: 'fm_main_drive',
  form3: 'gauge',
  form4: 'instrumentation',
  form5: 'motors',
  form6: 'shift_check_sheet',
  form7: 'roll_change_b'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Object.entries(formFolderMap).forEach(([urlFormId, folderName]) => {
  console.log(`Setting up static route: /${urlFormId} -> ${path.join(__dirname, `../public/${folderName}`)}`);
  app.use(`/${urlFormId}`, express.static(path.join(__dirname, `../public/${folderName}`)));
});
app.use(express.static(path.join(__dirname, '../public')));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'database name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('✅ Server is running. POST your forms to /submit/:formId');
});

app.post('/submit/:formId', async (req, res) => {
  const formParam = req.params.formId;
  const formId = parseInt(formParam.replace(/[^\d]/g, '')) || 0;

  try {
    const data = req.body;
    const timestamp = new Date();

    const date = data.date || null;
    const shift = data.shift || null;
    const technician_ic = data.technician || null;
    const shift_ic = data.incharge || null;

    const approval_status = 'NO';
    const filled_status = data.statusCheckbox === 'on' ? 'NO' : 'YES';
    const filling_remark = filled_status === 'NO' ? 'Not Filled' : (data.statusRemark || 'Filled');

    const multilineKey = Object.keys(data).find(k => k.includes('[multiline1]'));
    const overall_remark = multilineKey ? data[multilineKey] : null;

    const [submissionResult] = await pool.execute(
      `INSERT INTO submission
      (timestamp, date, shift, technician_ic, shift_ic, form_id, approval_status, filled_status, filling_remark, overall_remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [timestamp, date, shift, technician_ic, shift_ic, formId, approval_status, filled_status, filling_remark, overall_remark]
    );

    const submissionId = submissionResult.insertId;
    const insertValues = [];

    for (const [key, value] of Object.entries(data)) {
      const match = key.match(/^items\[(\d+)]\[(\d+)]\[(.+?)]$/);
      if (match) {
        const headerId = parseInt(match[1]);
        const lineId = parseInt(match[2]);
        const itemId = match[3];
        insertValues.push([timestamp, formId, submissionId, headerId, lineId, itemId, value]);
      }
    }

    if (insertValues.length > 0) {
      await pool.query(
        `INSERT INTO formdata 
        (timestamp, form_id, submission_id, header_id, line_id, item_id, item_value)
        VALUES ?`,
        [insertValues]
      );
    }

    const [existing] = await pool.query(
      `SELECT COUNT(*) as count FROM frontend WHERE form_id = ?`,
      [formId]
    );

    if (existing[0].count === 0) {
      const folderName = formFolderMap[formParam];
      if (!folderName) throw new Error(`No folder mapped for ${formParam}`);

      const configPath = path.join(__dirname, `../public/${folderName}/config.json`);
      if (!fs.existsSync(configPath)) {
        console.warn(`Config file not found: ${configPath}. Skipping frontend metadata insertion.`);
      } else {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const frontendValues = [];

        config.sections.forEach((section, headerIndex) => {
          const header_id = section.header_id || (headerIndex + 1);
          const header_title = section.title || '';
          const header_desc = section.description || '';

          section.items.forEach((item, lineIndex) => {
            const line_id = item.line_id || (lineIndex + 1);
            const line_desc = item.checkpoint || item.description || '';
            frontendValues.push([formId, header_id, header_title, header_desc, line_id, line_desc]);
          });
        });

        if (frontendValues.length > 0) {
          await pool.query(
            `INSERT INTO frontend 
             (form_id, header_id, header_title, header_desc, line_id, line_desc)
             VALUES ?`,
            [frontendValues]
          );
        }
      }
    }

    res.json({
      success: true,
      submissionId,
      insertCount: insertValues.length
    });

  } catch (err) {
    console.error('❌ Submission error:', err.message);
    res.status(500).json({
      error: 'Failed to submit data',
      details: err.message
    });
  }
});

function requireLogin(req, res, next) {
  if (!req.session.approver) {
    return res.status(401).send('Unauthorized');
  }
  next();
}

app.get('/api/public-submissions', async (req, res) => {
  try {
    const { dateFrom, dateTo, shift, technician, incharge, formId, approvalStatus, filledStatus } = req.query;

    let query = `SELECT submission.*, 
                 CASE
                    WHEN submission.form_id = 1 THEN 'ECR, Tunnels & Basements Check Sheet'
                    WHEN submission.form_id = 2 THEN 'FM Main Drive Check Sheet'
                    WHEN submission.form_id = 3 THEN 'Gauge Check Sheet'
                    WHEN submission.form_id = 4 THEN 'Instrumentation Check Sheet'
                    WHEN submission.form_id = 5 THEN 'Motors Check Sheet'
                    WHEN submission.form_id = 6 THEN 'Shift Check Sheet'
                    WHEN submission.form_id = 7 THEN 'Roll Change B Check Sheet'
                    ELSE 'Unknown Form'
                 END as form_name
                 FROM submission WHERE 1=1`;
    const params = [];

    if (dateFrom) query += ` AND date >= ?`, params.push(dateFrom);
    if (dateTo) query += ` AND date <= ?`, params.push(dateTo);
    if (shift) query += ` AND shift = ?`, params.push(shift);
    if (technician) query += ` AND technician_ic = ?`, params.push(technician);
    if (incharge) query += ` AND shift_ic = ?`, params.push(incharge);
    if (formId) query += ` AND form_id = ?`, params.push(parseInt(formId));
    if (approvalStatus) query += ` AND approval_status = ?`, params.push(approvalStatus);
    if (filledStatus) query += ` AND filled_status = ?`, params.push(filledStatus);

    query += ` ORDER BY timestamp DESC`;
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching public submissions:', err.message);
    res.status(500).json({ error: 'Failed to fetch submissions', details: err.message });
  }
});


app.get('/api/submission/:id', async (req, res) => {
  const submissionId = req.params.id;
  try {
    const [submissionRows] = await pool.execute(
      `SELECT * FROM submission WHERE submission_id = ?`,
      [submissionId]
    );

    if (submissionRows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const [formdataRows] = await pool.execute(
      `SELECT * FROM formdata WHERE submission_id = ? ORDER BY header_id, line_id`,
      [submissionId]
    );

    res.json({ submission: submissionRows[0], formdata: formdataRows });
  } catch (err) {
    console.error('❌ Error fetching single submission:', err.message);
    res.status(500).json({ error: 'Failed to fetch submission data', details: err.message });
  }
});

app.post('/api/approve/:id', async (req, res) => {
  const submissionId = req.params.id;
  const { approver_remark } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE submission 
       SET approval_status = 'YES', approver_remark = ?
       WHERE submission_id = ?`,
      [approver_remark || null, submissionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Submission not found or already approved' });
    }

    res.json({ success: true, message: 'Form approved and remark saved' });
  } catch (err) {
    console.error('❌ Error approving form:', err.message);
    res.status(500).json({ success: false, error: 'Failed to approve form', details: err.message });
  }
});

function requireSettingsLogin(req, res, next) {
  if (req.session.isSettingsAdmin) {
    next();
  } else {
    console.warn('SERVER: Unauthorized attempt to access settings API.');
    res.status(401).send('Unauthorized to access settings.');
  }
}

app.get('/api/master-config', requireSettingsLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category, GROUP_CONCAT(value ORDER BY value SEPARATOR ',') as items
      FROM master_config_values
      GROUP BY category
    `);
    const config = {};
    rows.forEach(row => {
      let key;
      switch (row.category) {
        case 'Technician Name':
          key = 'technicians';
          break;
        case 'Shift Incharge':
          key = 'shiftIncharges';
          break;
        case 'Approver Name':
          key = 'approvers';
          break;
        case 'Credentials':
          key = 'credentials';
          break;
        default:
          key = row.category.toLowerCase().replace(/\s+/g, '') + 's';
      }
      config[key] = row.items ? row.items.split(',') : [];
    });
    res.json(config);
  } catch (err) {
    console.error('❌ Error fetching master config:', err.message);
    res.status(500).json({ error: 'Failed to fetch config', details: err.message });
  }
});

// A new, unprotected API endpoint to get a subset of master config values
app.get('/api/public-master-config', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category, GROUP_CONCAT(value ORDER BY value SEPARATOR ',') as items
      FROM master_config_values
      WHERE category IN ('Technician Name', 'Shift Incharge')
      GROUP BY category
    `);
    const config = {};
    rows.forEach(row => {
      let key;
      switch (row.category) {
        case 'Technician Name':
          key = 'technicians';
          break;
        case 'Shift Incharge':
          key = 'shiftIncharges';
          break;
      }
      if (key) {
        config[key] = row.items ? row.items.split(',') : [];
      }
    });
    res.json(config);
  } catch (err) {
    console.error('❌ Error fetching public master config:', err.message);
    res.status(500).json({ error: 'Failed to fetch public config', details: err.message });
  }
});

app.post('/api/master-config', requireSettingsLogin, async (req, res) => {
  const { category, values } = req.body;
  if (!category || !Array.isArray(values)) {
    return res.status(400).json({ error: 'Invalid input format. Requires "category" and "values" array.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM master_config_values WHERE category = ?', [category]);

    if (values.length > 0) {
      const insertData = values.map(val => [category, val]);
      await conn.query('INSERT INTO master_config_values (category, value) VALUES ?', [insertData]);
    }

    await conn.commit();
    res.json({ success: true, message: `Category '${category}' updated successfully.` });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error saving master config:', err.message);
    res.status(500).json({ error: 'Failed to save config', details: err.message });
  } finally {
    conn.release();
  }
});

app.get('/:formId/index.html', (req, res) => {
  const formId = req.params.formId;
  const folderName = formFolderMap[formId];
  if (folderName) {
    res.sendFile(path.join(__dirname, `../public/${folderName}/index.html`));
  } else {
    res.status(404).send('Form not found');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query(
    `SELECT * FROM master_config_values WHERE category = 'Credentials' AND value = ?`,
    [`${username}:${password}`]
  );

  if (rows.length > 0) {
    req.session.approver = username;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials.' });
  }
});

app.post('/api/settings-login', (req, res) => {
  const { password } = req.body;
  console.log('SERVER: Attempting settings login.');
  console.log('SERVER: Entered password length:', password ? password.length : 0);
  console.log('SERVER: Expected master password length:', MASTER_PASSWORD.length);

  if (password === MASTER_PASSWORD) {
    console.log('SERVER: Master password matched. Setting session.');
    req.session.isSettingsAdmin = true;
    res.json({ success: true });
  } else {
    console.log('SERVER: Master password MISMATCH. Sending 401.');
    res.status(401).json({ success: false, message: 'Invalid master password.' });
  }
});

app.get('/api/check-session', (req, res) => {
  if (req.session.approver) {
    res.status(200).json({ loggedIn: true, user: req.session.approver });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get('/api/check-settings-session', (req, res) => {
  if (req.session.isSettingsAdmin) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.listen(port, '0.0.0.0',() => {
  console.log(`✅ Server is running at: http://0.0.0.0:${port}`);
});
