const transporter = require("../middleware/nodemailer");

const welcomeMessage = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: `"Administrador prueba BACKEND 👻" <${process.env.GMAIL_NODEMAILER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `Hola ${username}`, // Subject line
      text: "Hola Mundo? texto", // plain text body
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #ff6600;
            padding: 10px 0;
            color: #fff;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
          }
          .content {
            padding: 20px;
          }
          .content h2 {
            color: #ff6600;
          }
          .content p {
            line-height: 1.6;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenido a Power Gym</h1>
          </div>
          <div class="content">
            <h2>Hola, ${username}!</h2>
            <p>Estamos emocionados de tenerte en Power Gym. Esperamos que disfrutes de nuestros servicios y que tengas una excelente experiencia.</p>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros.</p>
            <p>¡Gracias por unirte!</p>
          </div>
          <div class="footer">
            <p>© 2024 Power Gym. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `, // html body
    });
    if (info.response.includes("OK")) {
      return 200;
    } else {
      return 500;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  welcomeMessage,
};
