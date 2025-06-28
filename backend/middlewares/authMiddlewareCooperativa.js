const jwt = require("jsonwebtoken");

const authMiddlewareCooperativa = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso no autorizado. Token faltante." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.tipo !== "cooperativa") {
      return res.status(403).json({ message: "Acceso restringido a cooperativas" });
    }

    req.cooperativaId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddlewareCooperativa;
