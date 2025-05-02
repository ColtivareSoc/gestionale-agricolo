const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getProdottiAgricoli,
  getProdottoAgricolo,
  createProdottoAgricolo,
  updateProdottoAgricolo,
  deleteProdottoAgricolo,
  updateStatisticheProduttive,
} = require("../controllers/prodottiAgricoliController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Validazione per creazione e aggiornamento
const validateProdottoAgricolo = [
  body("nome").notEmpty().withMessage("Il nome del prodotto è obbligatorio"),
  body("varietà").notEmpty().withMessage("La varietà è obbligatoria"),
  body("categoria")
    .notEmpty()
    .withMessage("La categoria è obbligatoria")
    .isIn(["Frutta", "Verdura", "Cereali", "Legumi", "Altro"])
    .withMessage("Categoria non valida"),
  body("stagionalità.inizio")
    .notEmpty()
    .withMessage("Il mese di inizio stagione è obbligatorio")
    .isIn([
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ])
    .withMessage("Mese di inizio non valido"),
  body("stagionalità.fine")
    .notEmpty()
    .withMessage("Il mese di fine stagione è obbligatorio")
    .isIn([
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ])
    .withMessage("Mese di fine non valido"),
  body("prezzoMedio")
    .notEmpty()
    .withMessage("Il prezzo medio è obbligatorio")
    .isFloat({ min: 0 })
    .withMessage("Il prezzo deve essere un numero positivo"),
  body("unitàMisura")
    .notEmpty()
    .withMessage("L'unità di misura è obbligatoria")
    .isIn(["kg", "q", "t", "unità", "cassetta"])
    .withMessage("Unità di misura non valida"),
];

// Validazione per aggiornamento statistiche
const validateStatistiche = [
  body("resaMediaPerEttaro")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La resa media deve essere un numero positivo"),
  body("ultimoRaccolto.quantità")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La quantità deve essere un numero positivo"),
  body("ultimoRaccolto.data")
    .optional()
    .isISO8601()
    .withMessage("La data deve essere in formato valido"),
];

// Route pubbliche
router.get("/", getProdottiAgricoli);
router.get("/:id", getProdottoAgricolo);

// Route private (richiedono autenticazione)
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  validateProdottoAgricolo,
  createProdottoAgricolo
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  validateProdottoAgricolo,
  updateProdottoAgricolo
);
router.delete("/:id", protect, authorize("admin"), deleteProdottoAgricolo);
router.patch(
  "/:id/statistiche",
  protect,
  authorize("admin", "manager"),
  validateStatistiche,
  updateStatisticheProduttive
);

module.exports = router;
