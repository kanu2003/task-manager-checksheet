const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4000; // This runs separately from your main form server

// Setup MySQL connection
const pool = mysql.createPool({
host: 'localhost',
user: 'root',
password: 'kashish@20',
database: 'platemill',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
secret: 'secret-approver-key', // Change to strong secret
resave: false,
saveUninitialized: true
}));

// Serve login UI from public/login directory
app.use(express.static(path.join(__dirname, '../public/login')));

// Simple middleware to protect routes
function requireLogin(req, res, next) {
if (req.session && req.session.approverId) {
next();
} else {
res.redirect('/login.html');
}
}

// Approver login route
app.post('/login', async (req, res) => {
const { loginId, password } = req.body;

try {
const [rows] = await pool.query(
'SELECT id FROM approvers WHERE login_id = ? AND password = ?',
[loginId, password]
);

if (rows.length > 0) {
  req.session.approverId = rows[0].id;
  res.redirect('/dashboard.html'); // Redirect to protected dashboard
} else {
  res.redirect('/login.html?error=invalid');
}
} catch (err) {
console.error('Login error:', err);
res.status(500).send('Internal Server Error');
}
});

// Logout route
app.get('/logout', (req, res) => {
req.session.destroy(() => {
res.redirect('/login.html');
});
});

// Example protected route
app.get('/dashboard.html', requireLogin, (req, res) => {
res.sendFile(path.join(__dirname, '../public/login/dashboard.html'));
});

// Start server
app.listen(port, () => {
console.log('Approver auth server running at http://localhost:${port}');
});

