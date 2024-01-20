const connection = require('../database/db');
const bcryptjs = require('bcryptjs');

// Vista para administrar usuarios
exports.adminUsersView = async (req, res) => {
    try {
        const users = await getUsers();
        res.render('adminUsers', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para obtener todos los usuarios desde la base de datos
const getUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, nombre, apellido, mail, tipo, fecha_nac, telefono, direccion, ciudad FROM users', (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Formatea la fecha de nacimiento en "dd/mm/yyyy"
                results.forEach(user => {
                    user.fecha_nac = new Date(user.fecha_nac).toLocaleDateString('es-AR');
                });
                resolve(results);
            }
        });
    });
};

// Función para buscar usuarios por criterios específicos
exports.searchUsers = async (req, res) => {
    try {
        const { criterio, valor } = req.body;

        // Verifica que los datos estén presentes
        if (!criterio || !valor) {
            return res.status(400).send('Criterio y valor son obligatorios');
        }

        // Ajusta la consulta SQL según tus necesidades
        const query = `SELECT * FROM users WHERE ${criterio} LIKE ?`;
        console.log('Query:', query);
        console.log('Values:', [`%${valor}%`]);

        const results = await queryUsers(query, [`%${valor}%`]);

        res.render('adminUsers', { users: results });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para ejecutar una consulta SQL en la base de datos
const queryUsers = (query, values) => {
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

// Vista para editar un usuario desde el panel de administración
exports.editUserView = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);
  
      if (user) {
        res.render('adminEditUser', { user });
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  };
  
  // Método para actualizar un perfil o usuario
exports.updateUser = async (req, res) => {
    try {
        const { nombre, apellido, fechaNacimiento, telefono, direccion, ciudad, password, tipo } = req.body;
        const userId = req.params.id;

        // Lógica para actualizar los datos del perfil o usuario en la base de datos
        await connection.query(
            'UPDATE users SET nombre=?, apellido=?, fecha_nac=?, telefono=?, direccion=?, ciudad=?, tipo=? WHERE id=?',
            [nombre, apellido, fechaNacimiento, telefono, direccion, ciudad, tipo, userId]
        );

        // Lógica para actualizar la contraseña si se proporciona
        if (password) {
            // Lógica para actualizar la contraseña en la base de datos
            const passHash = await bcryptjs.hash(password, 8);
            await connection.query(
                'UPDATE users SET password=? WHERE id=?',
                [passHash, userId]
            );
        }

        res.redirect('/admin-users');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para obtener un usuario por su ID
const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};


// Función para eliminar un usuario y sus colecciones relacionadas
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Elimina registros en user_collections relacionados con el usuario
        await queryUsers('DELETE FROM user_collections WHERE user_id = ?', [userId]);

        // Ahora puedes eliminar al usuario
        await queryUsers('DELETE FROM users WHERE id = ?', [userId]);

        res.redirect('/admin-users');
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.redirect('/admin-users');
    }
};