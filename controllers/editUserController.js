const connection = require('../database/db');
const bcryptjs = require ('bcryptjs')

// Vista para editar el perfil
exports.editProfileView = (req, res) => {
    // Lógica para obtener los datos del usuario y renderizar la vista de edición
    res.render('editProfile', { user: req.user });
};

// Método para actualizar el perfil
exports.updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, fechaNacimiento, telefono, direccion, ciudad, password } = req.body;
        const userId = req.user.id;

        // Lógica para actualizar los datos del perfil en la base de datos
        // Ignorar el campo 'mail'
        await connection.query(
            'UPDATE users SET nombre=?, apellido=?, fecha_nac=?, telefono=?, direccion=?, ciudad=? WHERE id=?',
            [nombre, apellido, fechaNacimiento, telefono, direccion, ciudad, userId]
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

        res.redirect('/'); // Puedes redirigir a la página del perfil actualizado
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


