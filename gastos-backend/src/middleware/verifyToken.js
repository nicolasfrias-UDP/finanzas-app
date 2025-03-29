const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Formato esperado: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Se guarda el usuario decodificado en el request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token no válido o expirado' });
  }
};

module.exports = verifyToken;
