const connection = require('../database/db');

// Método para obtener todos los cómics
exports.getAllComics = (req, res) => {
    connection.query('SELECT * FROM comics', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los cómics');
        } else {
            res.json(results);
        }
    });
};

// Método para agregar un cómic
exports.addComic = async (req, res) => {
    try {
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

        await connection.query(
            'INSERT INTO comics (portada, nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [portada, nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al agregar el cómic' });
    }
};

// Método para editar un cómic
exports.editComic = async (req, res) => {
    try {
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

        await connection.query(
            'UPDATE comics SET portada=?, nombre=?, numero=?, editorial=?, coleccion=?, fecha_ingreso=?, novedad=?, costo=?, observaciones=? WHERE id=?',
            [portada, nombre, numero, editorial, coleccion, fecha_ingreso, novedad, costo, observaciones, comicId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al editar el cómic' });
    }
};

// Método para borrar un cómic
exports.deleteComic = async (req, res) => {
    try {
        const comicId = req.params.id;

        await connection.query('DELETE FROM comics WHERE id=?', [comicId]);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al borrar el cómic' });
    }
};