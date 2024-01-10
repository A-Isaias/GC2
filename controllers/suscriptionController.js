const connection = require('../database/db');

const queryDatabase = (query, values) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.obtenerColeccionesUsuario = async (userId) => {
  try {
    const query = 'SELECT * FROM user_collections WHERE user_id = ?';
    const values = [userId];
    const userCollections = await queryDatabase(query, values);
    return userCollections;
  } catch (error) {
    throw error;
  }
};

exports.suscribirColeccion = async (req, res) => {
  try {
    if (!req.user) {
      // Si el usuario no está autenticado, manejar el error o redirigir según sea necesario
      return res.json({ success: false, message: 'Usuario no autenticado' });
    }

    const { comicId, coleccion } = req.body;

    // Verifica si el usuario ya está suscrito a la colección
    const queryCheckSubscription = 'SELECT * FROM user_collections WHERE user_id = ? AND collection = ?';
    const valuesCheckSubscription = [req.user.id, coleccion];
    const resultCheckSubscription = await queryDatabase(queryCheckSubscription, valuesCheckSubscription);

    if (resultCheckSubscription.length === 0) {
      // Si no está suscrito, realiza la suscripción
      const queryInsertSubscription = 'INSERT INTO user_collections (user_id, collection) VALUES (?, ?)';
      const valuesInsertSubscription = [req.user.id, coleccion];
      await queryDatabase(queryInsertSubscription, valuesInsertSubscription);

      res.json({ success: true, message: 'Suscripción exitosa' });
    } else {
      // Si ya está suscrito, devuelve un mensaje de error
      res.json({ success: false, message: 'Ya estás suscrito a esta colección' });
    }
  } catch (error) {
    console.error('Error en suscribirColeccion:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.misColeccionesView = async (req, res) => {
  try {
    // Obtén las colecciones del usuario desde tu base de datos
    const userCollections = await exports.obtenerColeccionesUsuario(req.user.id);

    // Renderiza la vista con las colecciones del usuario
    res.render('suscripciones', { userCollections });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

// Eliminar Suscripcion
exports.eliminarSuscripcion = async (req, res) => {
    try {
      if (!req.user) {
        return res.json({ success: false, message: 'Usuario no autenticado' });
      }
  
      const suscripcionId = req.params.id;
  
      // Realiza la lógica para eliminar la suscripción (ajusta según tu esquema de base de datos)
      const queryEliminarSuscripcion = 'DELETE FROM user_collections WHERE id = ? AND user_id = ?';
      const valuesEliminarSuscripcion = [suscripcionId, req.user.id];
      await queryDatabase(queryEliminarSuscripcion, valuesEliminarSuscripcion);
  
      res.redirect('/mis-colecciones'); // Redirige a la página de suscripciones después de eliminar
    } catch (error) {
      console.error('Error al eliminar suscripción:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };