const connection = require('../database/db');
const nodemailer = require('nodemailer'); 
require('dotenv').config();

const transporter = nodemailer.createTransport({
    // Configura el transporte de nodemailer (puedes ajustar según tu proveedor de correo)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, htmlContent, attachments) => {
  // Configura y envía el correo electrónico
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to,
    subject,
    html: htmlContent, // Utiliza 'html' en lugar de 'text' para enviar contenido HTML
    attachments, // Añade los adjuntos al objeto de opciones
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

// Función para obtener suscriptores de una colección
const getSubscribers = async (coleccion) => {
  const query = `
    SELECT mail AS email
    FROM users
    WHERE id IN (
      SELECT user_id
      FROM user_collections
      WHERE collection = ?
    )
  `;
  const values = [coleccion];
  const subscribers = await queryDatabase(query, values);
  return subscribers;
};

// Función para notificar a los suscriptores sobre un nuevo cómic
exports.notifySubscribers = async (comic) => {
    try {
      // Obtén las suscripciones para la colección del cómic
      const subscribers = await getSubscribers(comic.coleccion);

  // Calcula el 10% OFF sin decimales
const discountPrice = Math.floor(comic.costo * 0.9);

// // Convierte la fecha de ingreso a un formato legible (puedes ajustar el formato según tus preferencias)
// const formattedDate = new Date(comic.fecha_ingreso).toLocaleDateString('es-AR');

// Configura el contenido HTML del correo electrónico con formato personalizado
const htmlContent = `
  <div style="display: flex; align-items: center;">
    <!-- Portada del cómic a la izquierda -->
    <img src="cid:portada" alt="Portada del cómic" style="max-width: 200px; max-height: 100%; margin-right: 20px;">


    <!-- Datos del cómic a la derecha -->
    <div style="font-size: 16px;">
      <h1>Nuevo cómic en la colección ${comic.coleccion}</h1>
      <p>¡Hola!</p>
      <p>Se ha agregado un nuevo cómic (${comic.nombre}) a la colección ${comic.coleccion}. ¡No te lo pierdas!</p>
      <p style="font-size: 18px; margin-bottom: 8px;"><strong>Detalles del cómic:</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Nombre:</strong> ${comic.nombre}</li>
        <li><strong>Número:</strong> ${comic.numero}</li>
        <li><strong>Colección:</strong> ${comic.coleccion}</li>
        <li><strong>Costo original:</strong> $ ${comic.costo}</li>
        <li style="color: red; font-size: 18px;">
          <strong>10% OFF PREVENTA: $ ${discountPrice}</strong>
        </li>
        <li><strong>Fecha de ingreso:</strong> ${comic.fecha_ingreso}</li>
      </ul>
    </div>
  </div>
`;
  
      // Obtén el nombre de la portada del cómic
      const portadaFileName = obtenerNombreDePortada(comic.portada);
  
      // Adjunta la portada del cómic al correo electrónico
      const attachments = [
        {
          filename: portadaFileName,
          path: `public/uploads/${portadaFileName}`,
          cid: 'portada',
        }
      ];
  
      // Envía notificaciones a los suscriptores
      subscribers.forEach((subscriber) => {
        const subject = `Nuevo cómic en la colección ${comic.coleccion}`;
        sendEmail(subscriber.email, subject, htmlContent, attachments);
        // Puedes agregar aquí la lógica para enviar mensajes de WhatsApp si es necesario
      });
    } catch (error) {
      console.error('Error en notifySubscribers:', error);
    }
  };
// Función para obtener el nombre de la portada del cómic
const obtenerNombreDePortada = (portada) => {
  try {
    // Supongo que la URL tiene un formato similar a 'public/uploads/nombre_del_archivo'
    const urlPartes = portada.split('/');
    const nombreDelArchivo = urlPartes[urlPartes.length - 1];

    return nombreDelArchivo;
  } catch (error) {
    console.error('Error al obtener el nombre de la portada:', error);
    return ''; // Devuelve un valor predeterminado en caso de error
  }
};

// Función para ejecutar una consulta SQL en la base de datos
const queryDatabase = (query, values) => {
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
