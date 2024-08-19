import 'dotenv/config.js'

const MYSQL_USER = process.env.DB_USERNAME
const MYSQL_PASSWORD = process.env.DB_PASSWORD
const MYSQL_HOST = process.env.DB_HOST
const PORT = process.env.PORT
const MYSQL_DATABASE = process.env.DB_DATABASE
const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const NODE_ENV = process.env.NODE_ENV
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const JWT_EXPIRATION = process.env.JWT_EXPIRATION

export {
  MYSQL_HOST,
 MYSQL_USER,
  MYSQL_PASSWORD,
 MYSQL_DATABASE,
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  NODE_ENV,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
  JWT_EXPIRATION
}
