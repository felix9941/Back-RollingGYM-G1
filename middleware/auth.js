/* traemos JWT */
const jwt = require("jsonwebtoken");

/* Ahora vamos a exportar una funcion anonima, esto quiere decir que no la declaramos antes con un
const por ejemplo y de ahi recien abajo la exportamos, sino que directamente la pasamos en el exports.
y tiene doble funcion flecha porque la primera que tiene el role es para recibir algo y la segunda es
para el req, res y uno nuevo llamado next, que es un callback que lo usamos cuando esta todo bien y
pasamos a lo siguiente, es decir hacemos lo del controlador del endpoint, ya que recordemos que esto
es un middleware y esta entre la ruta y el controlador. En este caso vamos a recibir el role porque
la autorizacion que estamos haciendo es para saber si el usuario puede entrar a una ruta o no
dependiendo de su role */
module.exports = (role) => async (req, res, next) => {
  try {
    /* En postman tenemos algo que se llama header que esta en el mismo lugar que el body
    en este caso aca le vamos a pasar en el key la palabra auth y en el value el token, pero
    antes de este token debe ir Bearer y un espacio para que postman lo detecte. Por eso aca cuando
    vamos a guardar el valor del token que le pasamos en el header auth, antes de guardarlo debemos
    sacarle ese Bearer con el replace. Tener siempre en cuenta de poner "Bearer " y no "Bearer", es
    decir no te olvides del espacio, sino va a quedar el token con un espacio adelante y no va a
    funcionar. El ? antes del replace indica que si no encuentra el auth no haga lo siguiente. */
    const token = req.header("auth")?.replace("Bearer ", "");
    /* Si no nos envian el token no podemos seguir */
    if (!token) {
      return res.status(400).json({ message: "Error al encontrar el token" });
    }
    /* Ahora vamos a verificar si el token esta correcto. Usamos la funcion de jwt llamada verify,
    la cual recibe el token y la clave secreta, que en este caso nosotros tenemos guardada en una
    variable de estado. Esto de ser correcto nos devolvera el objeto payload que creamos en el
    controlador del login de usuario.Si verifyToken comprueba que esta mal va a tirar un error
    que se va a ir por el catch. */
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    /* Ahora vamos a verificar si el role que le pasamos es igual al role que nos trae el payload
    del token. Si es igual usaremos el next, es decir que terminara el auth de manera correcta y
    seguira con lo siguiente en el endpoint que es el controlador, si no nos devolvera un
    mensaje de error */
    if (role === verifyToken.prueba.role) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "No estas autorizado para este endpoint" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error: Token incorrecto" });
  }
};
