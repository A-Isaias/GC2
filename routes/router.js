const express = require ('express')
const router = express.Router()
const isAuthenticated = require('../controllers/authController').isAuthenticated;
const editUserController = require('../controllers/editUserController');

const authController = require('../controllers/authController')

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

//Router para metodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router