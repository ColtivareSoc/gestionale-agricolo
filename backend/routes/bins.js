// backend/routes/bins.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getBins,
  getBin,
  createBin,
  createBinsBatch,
  updateBin,
  deleteBin,
  caricaBin,
  svuotaBin,
  setBinInLavorazione,
  getStatisticheBins,
} = require("../controllers/binsController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Validazione per creazione/aggiornamento BIN
const validateBin = [
  body("codice_identificativo")
    .notEmpty()
    .withMessage("Il codice identificativo è obbligatorio")
    .trim(),
  body("tipo")
    .optional()
    .isIn(["Plastica", "Legno", "Metallo"])
    .withMessage("Tipo non valido"),
  body("capacita_kg")
    .notEmpty()
    .withMessage("La capacità è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La capacità deve essere un numero positivo"),
  body("tara_kg")
    .notEmpty()
    .withMessage("La tara è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La tara deve essere un numero positivo"),
  body("localizzazione").optional().trim(),
  body("data_acquisto")
    .optional()
    .isISO8601()
    .withMessage("Formato data non valido"),
];

// Validazione per creazione batch
const validateBinsBatch = [
  body("prefisso").notEmpty().withMessage("Il prefisso è obbligatorio").trim(),
  body("numero_iniziale")
    .notEmpty()
    .withMessage("Il numero iniziale è obbligatorio")
    .isInt({ min: 1 })
    .withMessage("Il numero iniziale deve essere maggiore di 0"),
  body("quantita")
    .notEmpty()
    .withMessage("La quantità è obbligatoria")
    .isInt({ min: 1, max: 100 })
    .withMessage("La quantità deve essere tra 1 e 100"),
  body("tipo")
    .notEmpty()
    .withMessage("Il tipo è obbligatorio")
    .isIn(["Plastica", "Legno", "Metallo"])
    .withMessage("Tipo non valido"),
  body("capacita_kg")
    .notEmpty()
    .withMessage("La capacità è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La capacità deve essere un numero positivo"),
  body("tara_kg")
    .notEmpty()
    .withMessage("La tara è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La tara deve essere un numero positivo"),
  body("localizzazione").optional().trim(),
  body("data_acquisto")
    .notEmpty()
    .withMessage("La data di acquisto è obbligatoria")
    .isISO8601()
    .withMessage("Formato data non valido"),
];

// Validazione per carico BIN
const validateCaricoBin = [
  body("id_prodotto")
    .notEmpty()
    .withMessage("Il prodotto è obbligatorio")
    .isMongoId()
    .withMessage("ID prodotto non valido"),
  body("origine_tipo")
    .notEmpty()
    .withMessage("Il tipo di origine è obbligatorio")
    .isIn(["appezzamento", "fornitore"])
    .withMessage("Tipo di origine non valido"),
  body("id_origine")
    .notEmpty()
    .withMessage("L'ID origine è obbligatorio")
    .isMongoId()
    .withMessage("ID origine non valido"),
  body("anno_raccolta")
    .notEmpty()
    .withMessage("L'anno di raccolta è obbligatorio")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Anno non valido"),
  body("peso_netto_kg")
    .notEmpty()
    .withMessage("Il peso netto è obbligatorio")
    .isFloat({ min: 0 })
    .withMessage("Il peso netto deve essere un numero positivo"),
  body("localizzazione").optional().trim(),
];

// Route per statistiche (deve essere prima delle route con parametro)
router.get("/statistiche", protect, getStatisticheBins);

// Route CRUD di base
router.get("/", protect, getBins);
router.get("/:id", protect, getBin);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  validateBin,
  createBin
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  validateBin,
  updateBin
);
router.delete("/:id", protect, authorize("admin"), deleteBin);

// Route per creazione batch
router.post(
  "/batch",
  protect,
  authorize("admin", "manager"),
  validateBinsBatch,
  createBinsBatch
);

// Route per operazioni specifiche
router.post(
  "/:id/carica",
  protect,
  authorize("admin", "manager"),
  validateCaricoBin,
  caricaBin
);
router.post("/:id/svuota", protect, authorize("admin", "manager"), svuotaBin);
router.patch(
  "/:id/in-lavorazione",
  protect,
  authorize("admin", "manager"),
  setBinInLavorazione
);

module.exports = router;
