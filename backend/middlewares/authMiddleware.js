const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // Verifica se il token è presente nell'header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Estrai il token dall'header
      token = req.headers.authorization.split(" ")[1];

      // Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trova l'utente associato al token ed esclude la password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Errore di autenticazione:", error);
      res
        .status(401)
        .json({ message: "Autenticazione fallita, token non valido" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Autenticazione fallita, token non presente" });
  }
};

// Middleware per verificare il ruolo dell'utente
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Autenticazione fallita" });
    }

    if (!roles.includes(req.user.ruolo)) {
      return res.status(403).json({
        message: `Ruolo ${req.user.ruolo} non autorizzato per questa operazione`,
      });
    }

    next();
  };
};
