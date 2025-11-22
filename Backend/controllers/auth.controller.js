const jwt = require('jsonwebtoken');

// Clave secreta para firmar el token JWT
const JWT_SECRET = process.env.JWT_SECRET;


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se envíen los datos necesarios
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Validar credenciales
    if (username === VALID_USER.username && password === VALID_USER.password) {
      // Generar token JWT
      const token = jwt.sign(
        { 
          username: username,
          userId: 1 // En producción, esto vendría de la base de datos
        },
        JWT_SECRET,
        { 
          expiresIn: '24h' // El token expira en 24 horas
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Login exitoso Nombre: Joel Narvaez Martinez',
        token: token,
        user: {
          username: username
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login
};

