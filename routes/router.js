const express = require ('express')
const router = express.Router()
const methodOverride = require('method-override');
const isAuthenticated = require('../controllers/authController').isAuthenticated;
const editUserController = require('../controllers/editUserController');
const adminComicsController = require('../controllers/adminComicsController');
const authController = require('../controllers/authController')
const indexController = require('../controllers/indexController'); 
const adminUsersController = require('../controllers/adminUsersController');

// Importa la configuración de Multer desde app.js
const {app, upload } = require('../app');

// Configura el middleware para interpretar el método DELETE
router.use(methodOverride('_method'));

//router para las vistas 
// Ruta para la página principal
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const featuredComics = await indexController.getFeaturedComics(); // Asegúrate de tener esta función en tu controlador
        res.render('index', { user: req.user, featuredComics });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get ('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get ('/register', (req, res)=>{
    res.render('register')
})


// Ruta para la vista de administrador
router.get('/admin', authController.isAuthenticated, (req, res) => {
    res.render('admin'); // Ajusta esto según cómo manejas tus vistas
  });

//EDITAR PERFIL DE USUARIO
// Ruta para la vista de edición del perfil (debe estar autenticado)
router.get('/edit-profile', isAuthenticated, editUserController.editProfileView);

// Ruta para manejar la actualización del perfil (debe estar autenticado)
router.post('/update-profile', isAuthenticated, editUserController.updateProfile);

//ADMINISTRACION DE COMICS
// Ruta para acceder a la administración de cómics
router.get('/admin-comics', isAuthenticated, adminComicsController.adminComicsView);
// Definir ruta para búsqueda de cómics (método POST)
router.post('/admin-comics', isAuthenticated, adminComicsController.searchComics);
// Definir ruta para búsqueda de cómics
router.post('/search-comics', isAuthenticated, adminComicsController.searchComics);
// Ruta para acceder a la edición de un cómic
router.get('/edit-comic/:id', isAuthenticated, adminComicsController.editComicView);
// Ruta para manejar la actualización de un cómic
router.post('/update-comic/:id', upload.single('portada'), adminComicsController.updateComic);
// Ruta para eliminar cómics
router.post('/delete-comic/:id', isAuthenticated, adminComicsController.deleteComic);
// Ruta para renderizar la vista de agregar cómic
router.get('/add-comic', adminComicsController.renderAddComic);
// Ruta para agregar cómic a la base de datos
router.post('/add-comic', upload.single('portada'), adminComicsController.addComic);

//ADMINISTRACION DE USUARIOS 
// Ruta para acceder a la administración de usuarios
router.get('/admin-users', isAuthenticated, adminUsersController.adminUsersView);
// Ruta para manejar la búsqueda de usuarios (método POST)
router.post('/admin-users', isAuthenticated, adminUsersController.searchUsers);
// Ruta para la vista de creación de usuario en el panel de administración
router.get('/admin-create-user', isAuthenticated, (req, res) => {
    res.render('adminCreateUser');
  });
// Ruta para manejar la creación de usuario desde el panel de administración
router.post('/create-user', isAuthenticated, authController.register);
// Ruta para eliminar usuarios
router.post('/delete-user/:id', isAuthenticated, adminUsersController.deleteUser);
// Ruta para la vista de edición de un usuario (debe estar autenticado)
router.get('/edit-user/:id', isAuthenticated, adminUsersController.editUserView);
// Ruta para manejar la actualización de un usuario (debe estar autenticado)
router.post('/update-user/:id', isAuthenticated, adminUsersController.updateUser);

//Router para metodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router