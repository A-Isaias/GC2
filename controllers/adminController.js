const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const connection = require('../database/db');

// Middleware para verificar autenticación y tipo de usuario
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === 'admin') {
    return next();
  }
  res.redirect('/login'); // Redirige al login si no es un administrador
}

// Ruta para agregar cómic
router.post('/add-comic', ensureAdmin, (req, res) => {
  const {
    portada,
    nombre,
    numero,
    editorial,
    coleccion,
    fecha_ingreso,
    novedad,
    costo,
    observaciones,
  } = req.body;

  const insertComicQuery = `
    INSERT INTO comics (portada, nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertComicQuery,
    [
      portada,
      nombre,
      numero,
      editorial,
      coleccion,
      fecha_ingreso,
      novedad,
      costo,
      observaciones,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al agregar cómic');
      } else {
        res.redirect('/admin');
      }
    }
  );
});

// Ruta para editar cómic
router.post('/edit-comic/:id', ensureAdmin, (req, res) => {
  const comicId = req.params.id;
  const {
    portada,
    nombre,
    numero,
    editorial,
    coleccion,
    fecha_ingreso,
    novedad,
    costo,
    observaciones,
  } = req.body;

  const updateComicQuery = `
    UPDATE comics
    SET portada=?, nombre=?, numero=?, editorial=?, coleccion=?, fecha_ingreso=?, novedad=?, costo=?, observaciones=?
    WHERE id=?
  `;

  connection.query(
    updateComicQuery,
    [
      portada,
      nombre,
      numero,
      editorial,
      coleccion,
      fecha_ingreso,
      novedad,
      costo,
      observaciones,
      comicId,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al editar cómic');
      } else {
        res.redirect('/admin');
      }
    }
  );
});

// Ruta para borrar cómic
router.post('/delete-comic/:id', ensureAdmin, (req, res) => {
  const comicId = req.params.id;

  const deleteComicQuery = `
    DELETE FROM comics
    WHERE id=?
  `;

  connection.query(deleteComicQuery, [comicId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al borrar cómic');
    } else {
      res.redirect('/admin');
    }
  });
});

// Otras rutas y configuraciones...
module.exports = router;