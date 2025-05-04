const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getProdottiAgronomici,
  getProdottoAgronomico,
  createProdottoAgronomico,
  updateProdottoAgronomico,
  deleteProdottoAgronomico,
  createMovimento,
  getMovimenti,
  updateGiacenza,
  getProdottiScortaBassa,
} = require("../controllers/prodottiAgronomiciController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Validazione per prodotto agronomico
const validateProdottoAgronomico = [
  body("codice").notEmpty().withMessage("Il codice è obbligatorio").trim(),
  body("nome_commerciale")
    .notEmpty()
    .withMessage("Il nome commerciale è obbligatorio")
    .trim(),
  body("principio_attivo")
    .notEmpty()
    .withMessage("Il principio attivo è obbligatorio")
    .trim(),
  body("categoria")
    .notEmpty()
    .withMessage("La categoria è obbligatoria")
    .isIn(["fitosanitario", "concime", "altro"])
    .withMessage("Categoria non valida"),
  body("sottocategoria")
    .optional()
    .isIn([
      "fungicida",
      "insetticida",
      "acaricida",
      "erbicida",
      "disinfettante",
      "fitoregolatore",
      "azotato",
      "fosfatico",
      "potassico",
      "organico",
      "organo-minerale",
      "correttivo",
      "coadiuvante",
      "altro",
    ])
    .withMessage("Sottocategoria non valida"),
  body("unita_misura")
    .notEmpty()
    .withMessage("L'unità di misura è obbligatoria")
    .isIn(["l", "kg", "g", "ml", "t"])
    .withMessage("Unità di misura non valida"),
  body("giacenza.scorta_minima")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La scorta minima deve essere un numero positivo"),
  body("prezzi.prezzo_medio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Il prezzo medio deve essere un numero positivo"),
  body("caratteristiche.ph")
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage("Il pH deve essere tra 0 e 14"),
];

// Validazione per movimento
const validateMovimento = [
  body("data").optional().isISO8601().withMessage("Formato data non valido"),
  body("tipo")
    .notEmpty()
    .withMessage("Il tipo di movimento è obbligatorio")
    .isIn(["carico", "scarico"])
    .withMessage("Tipo movimento non valido"),
  body("quantita")
    .notEmpty()
    .withMessage("La quantità è obbligatoria")
    .isFloat({ min: 0 })
    .withMessage("La quantità deve essere un numero positivo"),
  body("unita_misura")
    .notEmpty()
    .withMessage("L'unità di misura è obbligatoria"),
  // Campi specifici per carico
  body("prezzo_unitario")
    .if(body("tipo").equals("carico"))
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Il prezzo unitario deve essere un numero positivo"),
  // Campi specifici per scarico
  body("id_appezzamento")
    .if(body("tipo").equals("scarico"))
    .notEmpty()
    .withMessage("L'appezzamento è obbligatorio per gli scarichi")
    .isMongoId()
    .withMessage("ID appezzamento non valido"),
  body("trattamento").if(body("tipo").equals("scarico")).optional().trim(),
];

// Validazione per giacenza manuale
const validateGiacenza = [
  body("quantita_attuale")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La quantità attuale deve essere un numero positivo"),
  body("scorta_minima")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La scorta minima deve essere un numero positivo"),
  body("localizzazione").optional().trim(),
  body("motivo").optional().trim(),
];

// Route per scorta bassa (posizionata prima delle route con parametro)
router.get("/scorta-bassa", protect, getProdottiScortaBassa);

// Route CRUD per prodotti agronomici
router.get("/", protect, getProdottiAgronomici);
router.get("/:id", protect, getProdottoAgronomico);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  validateProdottoAgronomico,
  createProdottoAgronomico
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  validateProdottoAgronomico,
  updateProdottoAgronomico
);
router.delete("/:id", protect, authorize("admin"), deleteProdottoAgronomico);

// Route per movimenti
router.get("/:id/movimenti", protect, getMovimenti);
router.post(
  "/:id/movimenti",
  protect,
  authorize("admin", "manager"),
  validateMovimento,
  createMovimento
);

// Route per gestione giacenza
router.patch(
  "/:id/giacenza",
  protect,
  authorize("admin"),
  validateGiacenza,
  updateGiacenza
);

module.exports = router;
