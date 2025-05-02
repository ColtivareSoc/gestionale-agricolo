const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");

// Validazione per la registrazione
const validateRegistration = [
  body("nome").notEmpty().withMessage("Il nome è obbligatorio"),
  body("cognome").notEmpty().withMessage("Il cognome è obbligatorio"),
  body("email").isEmail().withMessage("Inserisci un indirizzo email valido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La password deve contenere almeno 6 caratteri"),
];

// Validazione per il login
const validateLogin = [
  body("email").isEmail().withMessage("Inserisci un indirizzo email valido"),
  body("password").notEmpty().withMessage("La password è obbligatoria"),
];

// Rotte pubbliche
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

// Rotte private (richiedono autenticazione)
router.get("/profile", protect, getUserProfile);

module.exports = router;
