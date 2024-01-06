const express = require ('express')
const router = express.Router()
const isAuthenticated = require('../controllers/authController').isAuthenticated;
const editUserController = require('../controllers/editUserController');
const adminComicsController = require('../controllers/adminComicsController');
const authController = require('../controllers/authController')

// Importa la configuración de Multer desde app.js
const {app, upload } = require('../app');

//router para las vistas 
router.get ('/', authController.isAuthenticated, (req, res)=>{
    res.render('index', {user: req.user});
});
router.get ('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get ('/register', (req, res)=>{
    res.render('register')
})
// Ruta para la vista de edición del perfil (debe estar autenticado)
router.get('/edit-profile', isAuthenticated, editUserController.editProfileView);

// Ruta para manejar la actualización del perfil (debe estar autenticado)
router.post('/update-profile', isAuthenticated, editUserController.updateProfile);

// Ruta para la vista de administrador
router.get('/admin', authController.isAuthenticated, (req, res) => {
    res.render('admin'); // Ajusta esto según cómo manejas tus vistas
  });
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


//Router para metodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router