const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getVendite,
  getVendita,
  createVendita,
  updateVendita,
  deleteVendita,
  changeStatoVendita,
  getStatisticheVendite,
} = require("../controllers/venditeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Validazione per creazione/aggiornamento vendita
const validateVendita = [
  body("tipo_documento")
    .notEmpty()
    .withMessage("Il tipo documento è obbligatorio")
    .isIn(["fattura", "ddt", "preventivo"])
    .withMessage("Tipo documento non valido"),
  body("data").optional().isISO8601().withMessage("Formato data non valido"),
  body("id_cliente")
    .notEmpty()
    .withMessage("Il cliente è obbligatorio")
    .isMongoId()
    .withMessage("ID cliente non valido"),
  body("stato")
    .optional()
    .isIn([
      "da_consegnare",
      "consegnato",
      "pagato",
      "annullato",
      "da_confermare",
    ])
    .withMessage("Stato non valido"),
  body("pagamento")
    .notEmpty()
    .withMessage("Il metodo di pagamento è obbligatorio")
    .isIn([
      "rimessa_diretta",
      "bonifico_30gg",
      "bonifico_60gg",
      "ricevuta_bancaria",
    ])
    .withMessage("Metodo di pagamento non valido"),
  body("data_consegna")
    .optional()
    .isISO8601()
    .withMessage("Formato data consegna non valido"),
  body("data_pagamento")
    .optional()
    .isISO8601()
    .withMessage("Formato data pagamento non valido"),
  body("note").optional().trim(),
  body("righe")
    .isArray({ min: 1 })
    .withMessage("Deve essere presente almeno una riga"),
  body("righe.*.id_prodotto")
    .notEmpty()
    .withMessage("Il prodotto è obbligatorio")
    .isMongoId()
    .withMessage("ID prodotto non valido"),
  body("righe.*.quantita")
    .notEmpty()
    .withMessage("La quantità è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La quantità deve essere positiva"),
  body("righe.*.prezzo_unitario")
    .notEmpty()
    .withMessage("Il prezzo unitario è obbligatorio")
    .isFloat({ min: 0 })
    .withMessage("Il prezzo deve essere positivo"),
  body("righe.*.id_imballaggio")
    .optional()
    .isMongoId()
    .withMessage("ID imballaggio non valido"),
  body("righe.*.numero_pezzi")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Il numero di pezzi deve essere un intero positivo"),
  body("bins_associati")
    .optional()
    .isArray()
    .withMessage("I BINS associati devono essere un array"),
  body("bins_associati.*")
    .optional()
    .isMongoId()
    .withMessage("ID BIN non valido"),
];

// Validazione per cambio stato
const validateCambioStato = [
  body("stato")
    .notEmpty()
    .withMessage("Lo stato è obbligatorio")
    .isIn([
      "da_consegnare",
      "consegnato",
      "pagato",
      "annullato",
      "da_confermare",
    ])
    .withMessage("Stato non valido"),
];

// Route per statistiche (deve essere prima delle route con parametro)
router.get("/statistiche", protect, getStatisticheVendite);

// Route CRUD principali
router.get("/", protect, getVendite);
router.get("/:id", protect, getVendita);
router.post(
  "/",
  protect,
  authorize("admin", "manager", "user"),
  validateVendita,
  createVendita
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  validateVendita,
  updateVendita
);
router.delete("/:id", protect, authorize("admin"), deleteVendita);

// Route speciali
router.patch(
  "/:id/stato",
  protect,
  authorize("admin", "manager"),
  validateCambioStato,
  changeStatoVendita
);

module.exports = router;
