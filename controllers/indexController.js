// indexController.js

const connection = require('../database/db');

// Función para obtener cómics de novedad
exports.getFeaturedComics = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM comics WHERE novedad = ?', ['si'], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Formatea todas las fechas en "dd/mm/yyyy"
                results.forEach(comic => {
                    comic.fecha_ingreso = new Date(comic.fecha_ingreso).toLocaleDateString('es-AR');
                });
                resolve(results);
            }
        });
    });
};

// Vista para la página principal
exports.indexView = async (req, res) => {
    try {
        const featuredComics = await exports.getFeaturedComics();
        res.render('index', { featuredComics });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};