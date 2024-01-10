const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcryptjs = require('bcryptjs');
// const { promisify } = require('util');
const connection = require('../database/db');
// const authController = require('../controllers/authController');
// const { upload } = require('../app');

// Middleware para verificar autenticación y tipo de usuario
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === 'admin') {
    return next();
  }
  res.redirect('/login'); // Redirige al login si no es un administrador
}

// Ruta para agregar cómic a la base de datos
// router.post('/add-comic', upload.single('portada'), async (req, res) => {
//   try {
//     const {
//       portada,
//       nombre,
//       numero,
//       editorial,
//       coleccion,
//       fecha_ingreso,
//       novedad,
//       costo,
//       observaciones,
//     } = req.body;

//     let coleccionId;

//     // Verificar si la colección ya existe en la tabla colecciones
//     const checkCollectionQuery = 'SELECT id FROM colecciones WHERE nombre = ?';
//     const [existingCollection] = await executeQuery(checkCollectionQuery, [coleccion]);

//     if (existingCollection) {
//       // Si la colección existe, utiliza su ID
//       coleccionId = existingCollection.id;
//     } else {
//       // Si la colección no existe, crea una nueva entrada y obtén su ID
//       const createCollectionQuery = 'INSERT INTO colecciones (nombre) VALUES (?)';
//       const { insertId } = await executeQuery(createCollectionQuery, [coleccion]);
//       coleccionId = insertId;
//     }

//     // Insertar cómic en la tabla comics con el ID de la colección
//     const insertComicQuery = `
//       INSERT INTO comics (portada, nombre, numero, editorial, coleccion_id, fecha_ingreso, novedad, costo, observaciones)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     await executeQuery(insertComicQuery, [
//       portada,
//       nombre,
//       numero,
//       editorial,
//       coleccionId,
//       fecha_ingreso,
//       novedad,
//       costo,
//       observaciones,
//     ]);

//     res.redirect('/admin');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error al agregar cómic');
//   }
// });

// // Ruta para editar cómic
// router.post('/edit-comic/:id', ensureAdmin, (req, res) => {
//   const comicId = req.params.id;
//   const {
//     portada,
//     nombre,
//     numero,
//     editorial,
//     coleccion,
//     fecha_ingreso,
//     novedad,
//     costo,
//     observaciones,
//   } = req.body;

//   const updateComicQuery = `
//     UPDATE comics
//     SET portada=?, nombre=?, numero=?, editorial=?, coleccion=?, fecha_ingreso=?, novedad=?, costo=?, observaciones=?
//     WHERE id=?
//   `;

//   connection.query(
//     updateComicQuery,
//     [
//       portada,
//       nombre,
//       numero,
//       editorial,
//       coleccion,
//       fecha_ingreso,
//       novedad,
//       costo,
//       observaciones,
//       comicId,
//     ],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error al editar cómic');
//       } else {
//         res.redirect('/admin');
//       }
//     }
//   );
// });

// // Ruta para borrar cómic
// router.post('/delete-comic/:id', ensureAdmin, (req, res) => {
//   const comicId = req.params.id;

//   const deleteComicQuery = `
//     DELETE FROM comics
//     WHERE id=?
//   `;

//   connection.query(deleteComicQuery, [comicId], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error al borrar cómic');
//     } else {
//       res.redirect('/admin');
//     }
//   });
// });

// Ejecuta una consulta SQL y devuelve los resultados
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Función para obtener la información para la vista de administrador
async function getAdminInfo(req, res) {
  try {
    // Consulta para obtener el total de usuarios registrados
    const totalUsersQuery = 'SELECT COUNT(*) AS totalUsers FROM users';
    const totalUsersResult = await executeQuery(totalUsersQuery);

    // Consulta para obtener los datos del último usuario
    const lastUserQuery = 'SELECT * FROM users ORDER BY id DESC LIMIT 1';
    const lastUserResult = await executeQuery(lastUserQuery);

    // Consulta para obtener el total de cómics
    const totalComicsQuery = 'SELECT COUNT(*) AS totalComics FROM comics';
    const totalComicsResult = await executeQuery(totalComicsQuery);

    // Consulta para obtener los datos del último cómic
    const lastComicQuery = 'SELECT * FROM comics ORDER BY id DESC LIMIT 1';
    const lastComicResult = await executeQuery(lastComicQuery);

    // Renderiza la vista con los datos obtenidos
    const totalUsers = totalUsersResult[0]?.totalUsers || 0;
    const lastUser = lastUserResult[0] || {};
    const totalComics = totalComicsResult[0]?.totalComics || 0;
    const lastComic = lastComicResult[0] || {};

    // Devuelve un objeto con todas las variables necesarias
    return {
      totalUsers,
      lastUser,
      totalComics,
      lastComic,
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener información de administrador');
  }
}

// Otras rutas y configuraciones...
module.exports = {
  getAdminInfo,
  ensureAdmin,
  // Agrega otras funciones si es necesario
};