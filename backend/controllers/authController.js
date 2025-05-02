const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Genera JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Registra un nuovo utente
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    // Verifica errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, cognome, email, password } = req.body;

    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Utente già registrato con questa email",
      });
    }

    // Crea il nuovo utente
    const user = await User.create({
      nome,
      cognome,
      email,
      password,
    });

    // Se l'utente è stato creato con successo, invia token e dati
    if (user) {
      res.status(201).json({
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({
      message: "Errore durante la registrazione",
      error: error.message,
    });
  }
};

// @desc    Autenticazione utente e generazione token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    // Verifica errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Trova l'utente nel database
    const user = await User.findOne({ email });

    // Verifica se l'utente esiste e la password è corretta
    if (user && (await user.verificaPassword(password))) {
      // Aggiorna la data dell'ultimo accesso
      user.ultimo_accesso = Date.now();
      await user.save();

      res.json({
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email o password non validi" });
    }
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({
      message: "Errore durante il login",
      error: error.message,
    });
  }
};

// @desc    Ottieni il profilo dell'utente
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json(user);
  } catch (error) {
    console.error("Errore nel recupero del profilo:", error);
    res.status(500).json({
      message: "Errore nel recupero del profilo",
      error: error.message,
    });
  }
};
