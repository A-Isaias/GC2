const jwt = require ('jsonwebtoken')
const bcryptjs = require ('bcryptjs')
const connection = require ('../database/db')
const {promisify} = require ('util')

// Método Register
exports.register = async (req, res) => {
    try {
      const { password, nombre, apellido, fechaNacimiento, mail, telefono, direccion, ciudad } = req.body;
      console.log('Datos recibidos:', req.body);
  
      // Verificar si el correo electrónico ya está registrado
      const existingUser = await promisify(connection.query).bind(connection)('SELECT * FROM users WHERE mail = ?', [mail]);
  
      if (existingUser.length > 0) {
        // El correo electrónico ya está registrado, mostrar mensaje de error en register.ejs
        return res.render('register', {
          alert: {
            type: 'error',
            message: "Este correo electrónico ya está registrado. Por favor, elija otro."
          }
        });
      }
  
      // Continuar con la inserción si el correo electrónico no está registrado
      let passHash = await bcryptjs.hash(password, 8);
      connection.query('INSERT INTO users (password, nombre, apellido, fecha_nac, mail, telefono, direccion, ciudad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [passHash, nombre, apellido, fechaNacimiento, mail, telefono, direccion, ciudad])
      // Verifica el referer de la solicitud
      const referer = req.header('Referer');
      if (referer && referer.includes('/admin-create-user')) {
          // Si viene de adminCreateUser.ejs, redirige a la página de administración de usuarios
          res.redirect('/admin-users');
      } else {
          // De lo contrario, redirige a la página principal
          res.redirect('/');
      }
    } catch (error) {
      console.log(error);
      res.render('register', {
        alert: {
          type: 'error',
          message: "Hubo un error al registrar el usuario."
        }
      });
    }
  }

//metodo login
exports.login = async (req,res)=> {
    try {
        const email = req.body.email
        const pass = req.body.pass
        console.log(email , pass);
        if (!email || !pass ) {
            res.render('login',{
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Debe ingresar email y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            })
        }else{
            connection.query('SELECT * FROM users WHERE mail = ?', [email], async (error, results) => {
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))){
                    res.render('login',{
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: "Usuario o Password erroneos",
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: 3000,
                        ruta: 'login'
                    })
                }else{
                    const id = results[0].id;
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    console.log("TOKEN: "+token+" para el usuario: "+email);

                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 *60 * 1000),
                        httpOnly:true
                    }
                    res.cookie('jwt', token,cookiesOptions)
                    res.render('login',{
                        alert: true,
                        alertTitle: "Conexion Exitosa!",
                        alertMessage: "Usuario Logueado Correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: ''
                    })
                }    
            })
        }
    }catch (error){
        console.log(error);
    }
    
}

//metodo para autenticar
exports.isAuthenticated = async(req, res, next)=>{
    if (req.cookies.jwt) {
        try{
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE id= ?', [decodificada.id],(error, results)=>{
                if(!results){return next()}
                req.user = results[0];
                return next()
            })
        }catch (error) {
            console.log(error)
            return next()

        }
    }else{
        res.redirect('/login')
    }
}

//Logout
exports.logout = (req, res)=>{
res.clearCookie('jwt')
return res.redirect('/')
}