const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: 'kashish@20',
  database: 'platemill'
});

module.exports = session({
  key: 'platemill_sid',
  secret: 'secure_secret_key_please_change',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
});
