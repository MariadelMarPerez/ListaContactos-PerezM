
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); 

const app = express();
const PORT = 3006;


app.use(cors());
app.use(express.json());

/* =Conexion BDD*/

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conexión:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

/* =API= */

//  GET → obtener contactos
app.get('/contactos', (req, res) => {
  db.query('SELECT * FROM contactos', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// POST → crear contacto
app.post('/contactos', (req, res) => {
  const { name, phone, city, address, gender } = req.body;

  db.query(
    'INSERT INTO contactos (name, phone, city, address, gender) VALUES (?, ?, ?, ?, ?)',
    [name, phone, city, address, gender],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ ok: true });
    }
  );
});

// PUT → actualizar contacto
app.put('/contactos/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, city, address, gender } = req.body;

  db.query(
    'UPDATE contactos SET name=?, phone=?, city=?, address=?, gender=? WHERE id=?',
    [name, phone, city, address, gender, id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ ok: true });
    }
  );
});

// DELETE → eliminar contacto
app.delete('/contactos/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM contactos WHERE id=?',
    [id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ ok: true });
    }
  );
});

/* =Inicar=*/

app.listen(PORT, () => {
  console.log(` API corriendo en http://localhost:${PORT}`);
});
