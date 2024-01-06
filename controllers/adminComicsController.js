const connection = require('../database/db');
const multer = require('multer');

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

// Función para agregar cómic a la base de datos
exports.addComic = async (req, res) => {
    try {
        const { nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones } = req.body;
        const portada = req.file.filename; // Corregir esta línea para obtener el nombre del archivo correctamente
        
        // Ajusta la consulta SQL según tu esquema de base de datos
        const query = 'INSERT INTO comics (nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await queryComics(query, [nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones]);

        res.redirect('/admin-comics'); // Redirige a la vista de administrar cómics
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

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
                resolve(results[0]);
            }
        });
    });
};

// Función para actualizar un cómic en la base de datos
exports.updateComic = async (req, res) => {
    try {
        console.log('Update Comic Called');
        const { id, nombre, numero, editorial, coleccion, fecha_ingreso, observaciones, portada, novedad } = req.body;

        // Formateamos la fecha en formato MySQL
        const formattedDate = new Date(fecha_ingreso).toISOString().slice(0, 19).replace('T', ' ');

        // Consulta SQL para actualizar el cómic
        const query = 'UPDATE comics SET nombre = ?, numero = ?, editorial = ?, coleccion = ?, fecha_ingreso = ?, observaciones = ?, portada = ?, novedad = ? WHERE id = ?';
        
        // Ejecutamos la actualización
        await updateComic(query, [nombre, numero, editorial, coleccion, formattedDate, observaciones, portada, novedad, id]);
        console.log('Updated Successfully');

        res.redirect('/admin-comics'); // Redirigimos después de la actualización
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
        
        // Ajusta la consulta SQL según tu esquema de base de datos
        const query = 'INSERT INTO comics (nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await queryComics(query, [nombre, numero, editorial, coleccion, fecha_ingreso, portada, novedad, costo, observaciones]);

        res.redirect('/admin-comics'); // Redirige a la vista de administrar cómics
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};
// // Exporta las funciones necesarias
// module.exports = {
//     // ... (Otras exportaciones)
//     renderAddComic,
//     addComic,
// };

