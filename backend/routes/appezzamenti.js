// backend/routes/appezzamenti.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getAppezzamenti,
  getAppezzamento,
  createAppezzamento,
  updateAppezzamento,
  deleteAppezzamento,
  addColtivazione,
  updateColtivazione,
  deleteColtivazione,
  getStatisticheAppezzamento,
} = require("../controllers/appezzamentiController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Validazione per appezzamento
const validateAppezzamento = [
  body("codice").notEmpty().withMessage("Il codice è obbligatorio"),
  body("nome").notEmpty().withMessage("Il nome è obbligatorio"),
  body("superficie_ha")
    .notEmpty()
    .withMessage("La superficie è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La superficie deve essere un numero positivo"),
  body("ubicazione").notEmpty().withMessage("L'ubicazione è obbligatoria"),
  body("tipo_terreno")
    .notEmpty()
    .withMessage("Il tipo di terreno è obbligatorio")
    .isIn(["Argilloso", "Sabbioso", "Limoso", "Franco", "Torboso", "Altro"])
    .withMessage("Tipo di terreno non valido"),
  body("coordinate.latitudine")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitudine non valida"),
  body("coordinate.longitudine")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitudine non valida"),
  body("ph_terreno")
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage("PH non valido"),
  body("irrigazione.portata_max_lh")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La portata deve essere un numero positivo"),
];

// Validazione per coltivazione
const validateColtivazione = [
  body("id_prodotto")
    .notEmpty()
    .withMessage("Il prodotto è obbligatorio")
    .isMongoId()
    .withMessage("ID prodotto non valido"),
  body("anno")
    .notEmpty()
    .withMessage("L'anno è obbligatorio")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Anno non valido"),
  body("superficie_ha")
    .notEmpty()
    .withMessage("La superficie è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La superficie deve essere un numero positivo"),
  body("data_inizio")
    .notEmpty()
    .withMessage("La data di inizio è obbligatoria")
    .isISO8601()
    .withMessage("Formato data non valido"),
  body("data_fine_prevista")
    .notEmpty()
    .withMessage("La data di fine prevista è obbligatoria")
    .isISO8601()
    .withMessage("Formato data non valido"),
  body("stato")
    .optional()
    .isIn(["pianificata", "in_corso", "completata", "abbandonata"])
    .withMessage("Stato non valido"),
  body("resa_quintal_ha")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La resa deve essere un numero positivo"),
];

// Route per appezzamenti
router.get("/", protect, getAppezzamenti);
router.get("/:id", protect, getAppezzamento);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  validateAppezzamento,
  createAppezzamento
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  validateAppezzamento,
  updateAppezzamento
);
router.delete("/:id", protect, authorize("admin"), deleteAppezzamento);

// Route per coltivazioni
router.post(
  "/:id/coltivazioni",
  protect,
  authorize("admin", "manager"),
  validateColtivazione,
  addColtivazione
);
router.put(
  "/:id/coltivazioni/:coltivazione_id",
  protect,
  authorize("admin", "manager"),
  validateColtivazione,
  updateColtivazione
);
router.delete(
  "/:id/coltivazioni/:coltivazione_id",
  protect,
  authorize("admin", "manager"),
  deleteColtivazione
);

// Route per statistiche
router.get("/:id/statistiche", protect, getStatisticheAppezzamento);

module.exports = router;
