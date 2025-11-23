const jwt = require('jsonwebtoken');

// Clave secreta
const JWT_SECRET = process.env.JWT_SECRET;


const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Debe enviar: Authorization: Bearer <token>'
      });
    }

    // Extraer el token 
    const token = authHeader.split(' ')[1]; 
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    // Verificar el token usando JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar los datos del usuario al request para uso posterior
    req.user = decoded; 

    next();
    
  } catch (error) {
    // Si el token es inválido, expirado o falsificado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Debe hacer login nuevamente.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o falsificado.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el token.'
      });
    }
  }
};

module.exports = {
  verifyToken
};

