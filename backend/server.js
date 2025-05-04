// Importa le dipendenze
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Inizializza l'app Express
const app = express();

// Connetti al database
connectDB();

// Middleware
app.use(helmet()); // Sicurezza
app.use(cors()); // Gestione CORS
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: false })); // Parsing form data
app.use(morgan("dev")); // Logging

// Definisci la route di base
app.get("/", (req, res) => {
  res.json({ message: "API Gestione Agricola" });
});

// Definisci le route API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/prodotti-agricoli", require("./routes/prodottiAgricoli"));
// app.use("/api/prodotti-agronomici", require("./routes/prodottiAgronomici"));
// Altre route verranno aggiunte successivamente
// app.use('/api/appezzamenti', require('./routes/appezzamenti'));
// app.use('/api/bins', require('./routes/bins'));
// app.use('/api/vendite', require('./routes/vendite'));
// app.use('/api/finanza', require('./routes/finanza'));
// app.use('/api/personale', require('./routes/personale'));

// Gestione errori
app.use((req, res, next) => {
  const error = new Error("Risorsa non trovata");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Avvia il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
