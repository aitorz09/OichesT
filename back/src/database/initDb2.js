import { createConnection } from 'mysql2/promise.js'
import { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } from '../../env2.js'

const initDb = async () => {
  console.log(DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USERNAME)
  try {
    const db = await createConnection({
      host: DB_HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE
    })
    console.log('Creando tabla de usuarios')
    await db.query(`
    CREATE TABLE IF NOT EXISTS Usuarios(
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      avatar  VARCHAR(255),
      tipo ENUM('sala', 'grupo'),
      role ENUM('admin', 'normal') DEFAULT 'normal',
      active BOOLEAN DEFAULT false,
      createAd DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt DATETIME NULL
    )
    `)
    console.log('Creando tabla GenerosMusicales')
    await db.query(`
    CREATE TABLE IF NOT EXISTS GenerosMusicales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL
    )`)
    console.log('Creando tabla Grupos')
    await db.query(`
    CREATE TABLE IF NOT EXISTS Grupos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255),
      cantidad INT,
      descripcion TEXT,
      genero VARCHAR(255),
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
  
    )`)
    console.log('Creando tabla Salas')
    await db.query(`
    CREATE TABLE IF NOT EXISTS Salas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT,
      nombre VARCHAR(255) NOT NULL,
      direccion VARCHAR(255) NOT NULL,
      capacidad INT,
      descripcion TEXT,
      votes INT DEFAULT 0,
      valor DOUBLE,
      finalidad ENUM('ensayo', 'actuacion'),
      FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    )
`)
    await db.query(`
 CREATE TABLE IF NOT EXISTS Reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  sala_id INT,
  grupo_id INT,
  FOREIGN KEY (sala_id) REFERENCES Salas(id),
  FOREIGN KEY (grupo_ID) REFERENCES Grupos(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME  NULL,
  FOREIGN KEY (sala_id) REFERENCES Salas(id),
  FOREIGN KEY (grupo_id) REFERENCES Grupos(id)
)
`)
    console.log('Todas las tablas se han creado con exito')
    await db.end()
  } catch (error) {
    console.log(error)
    throw error
  }
}
initDb()
