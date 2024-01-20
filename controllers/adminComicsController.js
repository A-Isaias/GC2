const connection = require('../database/db');
const multer = require('multer');
const notificationController = require('./notificationController'); // Ajusta la ruta según tu estructura de archivos

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos subidos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Vista para administrar comics
exports.adminComicsView = async (req, res) => {
    try {
        const comics = await getComics();
        res.render('adminComics', { comics });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para obtener todos los comics desde la base de datos
const getComics = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM comics', (error, results) => {
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

// Función para buscar cómics por criterios específicos
exports.searchComics = async (req, res) => {
    try {
        const { criterio, valor } = req.body;

        // Verifica que los datos estén presentes
        if (!criterio || !valor) {
            return res.status(400).send('Criterio y valor son obligatorios');
        }

        // Ajusta la consulta SQL según tus necesidades
        const query = `SELECT * FROM comics WHERE ${criterio} LIKE ?`;
        console.log('Query:', query);
        console.log('Values:', [`%${valor}%`]);

        const results = await queryComics(query, [`%${valor}%`]);

        // Formatea todas las fechas en "dd/mm/yyyy"
        results.forEach(comic => {
            comic.fecha_ingreso = new Date(comic.fecha_ingreso).toLocaleDateString('es-AR');
        });

        res.render('adminComics', { comics: results });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para ejecutar una consulta SQL en la base de datos
const queryComics = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Formatea todas las fechas en "dd/mm/yyyy"
                if (Array.isArray(results)) {
                    results.forEach(comic => {
                        comic.fecha_ingreso = new Date(comic.fecha_ingreso).toLocaleDateString('es-AR');
                    });
                }
                resolve(results);
            }
        });
    });
};

// Vista para editar un cómic
exports.editComicView = async (req, res) => {
    try {
        const comicId = req.params.id; // Obtén el ID del cómic de los parámetros de la URL
        const comic = await getComicById(comicId);

        if (comic) {
            res.render('editComic', { comic });
        } else {
            res.status(404).send('Cómic no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para obtener un cómic por su ID
const getComicById = (comicId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM comics WHERE id = ?', [comicId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Formatea la fecha en "dd/mm/yyyy"
                results[0].fecha_ingreso = new Date(results[0].fecha_ingreso).toLocaleDateString('es-AR');
                resolve(results[0]);
            }
        });
    });
};

// Función para actualizar un cómic en la base de datos
exports.updateComic = async (req, res) => {
    try {
        const comicId = req.params.id;
        const { nombre, numero, portada, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones } = req.body;

        // Convierte la fecha a un objeto Date y luego formatea
        const fechaIngreso = new Date(fecha_ingreso);
        const fechaIngresoFormateada = fechaIngreso.toISOString().split('T')[0];

        // Ajusta la consulta SQL según tus necesidades
        let query, values;

        if (req.file) {
            // Si se proporciona un nuevo archivo, actualiza la portada
            query = 'UPDATE comics SET nombre = ?, numero = ?, portada = ?, editorial = ?, coleccion = ?, fecha_ingreso = ?, novedad = ?, costo = ?, observaciones = ? WHERE id = ?';
            values = [nombre, numero, req.file.filename, editorial, coleccion, fechaIngresoFormateada, novedad, costo, observaciones, comicId];
        } else {
            // Si no se proporciona un nuevo archivo, conserva la portada existente
            query = 'UPDATE comics SET nombre = ?, numero = ?, editorial = ?, coleccion = ?, fecha_ingreso = ?, novedad = ?, costo = ?, observaciones = ? WHERE id = ?';
            values = [nombre, numero, editorial, coleccion, fechaIngresoFormateada, novedad, costo, observaciones, comicId];
        }

        await updateComic(query, values);

        console.log('Updated Successfully');

        // Redirige o responde según sea necesario
        res.redirect('/admin-comics'); // O la ruta que desees
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para ejecutar una consulta SQL para actualizar un cómic
const updateComic = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};
// Función para eliminar cómics
exports.deleteComic = async (req, res) => {
    try {
        const comicId = req.params.id;
        // Lógica para eliminar el cómic según el ID
        await deleteComicById(comicId);
        // Redirigir o responder según tus necesidades
        res.redirect('/admin-comics');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para eliminar un cómic por ID
const deleteComicById = (comicId) => {
    return new Promise((resolve, reject) => {
        // Lógica para realizar la eliminación en la base de datos
        connection.query('DELETE FROM comics WHERE id = ?', [comicId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
// Función para renderizar la vista de agregar cómics
exports.renderAddComic = (req, res) => {
    res.render('addComic');
};

// Función para agregar cómic a la base de datos
exports.addComic = async (req, res) => {
    try {
        const { nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones } = req.body;
        const portada = req.file.filename; // Cambia esto según tu configuración de multer

        // Verifica si la colección ya existe en la tabla colecciones
        const queryCheckCollection = 'SELECT * FROM colecciones WHERE nombre = ?';
        const valuesCheckCollection = [coleccion];
        const resultCheckCollection = await queryComics(queryCheckCollection, valuesCheckCollection);

        let coleccionId;

        if (resultCheckCollection.length === 0) {
            // Si la colección no existe, la inserta en la tabla colecciones
            const queryInsertCollection = 'INSERT INTO colecciones (nombre) VALUES (?)';
            const resultInsertCollection = await queryComics(queryInsertCollection, [coleccion]);

            // Obtiene el ID de la colección recién insertada
            coleccionId = resultInsertCollection.insertId;
        } else {
            // Si la colección ya existe, obtiene su ID
            coleccionId = resultCheckCollection[0].id;
        }

        // Ajusta la consulta SQL según tu esquema de base de datos
        const queryInsertComic = 'INSERT INTO comics (nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones, coleccion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const valuesInsertComic = [nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones, coleccionId];

         // Inserta el cómic en la tabla comics
    await queryComics(queryInsertComic, valuesInsertComic);

    // Obtén el cómic recién insertado
    const queryGetComic = 'SELECT * FROM comics WHERE id = LAST_INSERT_ID()';
    const newComic = await queryComics(queryGetComic);

    // Notifica a los suscriptores de la nueva colección
    await notificationController.notifySubscribers(newComic[0]);

    res.redirect('/admin-comics'); // Redirige a la vista de administrar cómics
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};