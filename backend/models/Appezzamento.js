// backend/models/Appezzamento.js
const mongoose = require("mongoose");

const ColturazioneSchema = new mongoose.Schema({
  id_prodotto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProdottoAgricolo",
    required: [true, "Il prodotto è obbligatorio"],
  },
  anno: {
    type: Number,
    required: [true, "L'anno è obbligatorio"],
    min: [1900, "Anno non valido"],
    max: [2100, "Anno non valido"],
  },
  superficie_ha: {
    type: Number,
    required: [true, "La superficie è obbligatoria"],
    min: [0, "La superficie non può essere negativa"],
  },
  data_inizio: {
    type: Date,
    required: [true, "La data di inizio è obbligatoria"],
  },
  data_fine_prevista: {
    type: Date,
    required: [true, "La data di fine prevista è obbligatoria"],
  },
  data_fine_effettiva: {
    type: Date,
  },
  stato: {
    type: String,
    enum: ["pianificata", "in_corso", "completata", "abbandonata"],
    default: "pianificata",
  },
  resa_quintal_ha: {
    type: Number,
    min: [0, "La resa non può essere negativa"],
  },
  note: {
    type: String,
  },
});

const AppezzamentoSchema = new mongoose.Schema(
  {
    codice: {
      type: String,
      required: [true, "Il codice è obbligatorio"],
      unique: true,
      trim: true,
    },
    nome: {
      type: String,
      required: [true, "Il nome è obbligatorio"],
      trim: true,
    },
    superficie_ha: {
      type: Number,
      required: [true, "La superficie è obbligatoria"],
      min: [0, "La superficie non può essere negativa"],
    },
    ubicazione: {
      type: String,
      required: [true, "L'ubicazione è obbligatoria"],
      trim: true,
    },
    coordinate: {
      latitudine: {
        type: Number,
        min: [-90, "Latitudine non valida"],
        max: [90, "Latitudine non valida"],
      },
      longitudine: {
        type: Number,
        min: [-180, "Longitudine non valida"],
        max: [180, "Longitudine non valida"],
      },
    },
    tipo_terreno: {
      type: String,
      required: [true, "Il tipo di terreno è obbligatorio"],
      enum: ["Argilloso", "Sabbioso", "Limoso", "Franco", "Torboso", "Altro"],
    },
    ph_terreno: {
      type: Number,
      min: [0, "PH non valido"],
      max: [14, "PH non valido"],
    },
    esposizione: {
      type: String,
      enum: [
        "Nord",
        "Sud",
        "Est",
        "Ovest",
        "Nord-Est",
        "Nord-Ovest",
        "Sud-Est",
        "Sud-Ovest",
      ],
    },
    pendenza: {
      type: String,
      enum: ["Pianeggiante", "Leggera", "Media", "Ripida"],
      default: "Pianeggiante",
    },
    irrigazione: {
      tipo: {
        type: String,
        enum: [
          "Nessuna",
          "A pioggia",
          "A goccia",
          "Per aspersione",
          "A scorrimento",
        ],
        default: "Nessuna",
      },
      fonte: {
        type: String,
        enum: ["Pozzo", "Acquedotto", "Lago", "Fiume", "Consorzio", "Altro"],
      },
      portata_max_lh: {
        type: Number,
        min: [0, "La portata non può essere negativa"],
      },
    },
    coltivazioni: [ColturazioneSchema],
    trattamenti: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trattamento",
      },
    ],
    note: {
      type: String,
    },
    attivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indici per migliorare le performance
AppezzamentoSchema.index({ codice: 1 });
AppezzamentoSchema.index({ nome: 1 });

// Metodo virtuale per calcolare la superficie totale in coltivazione per un anno
AppezzamentoSchema.virtual("superficie_in_coltivazione_anno").get(function () {
  return function (anno) {
    if (!this.coltivazioni) return 0;

    return this.coltivazioni
      .filter((c) => c.anno === anno && c.stato !== "abbandonata")
      .reduce((total, c) => total + c.superficie_ha, 0);
  };
});

// Metodo per ottenere le coltivazioni attive
AppezzamentoSchema.methods.getColtivazioniAttive = function () {
  return this.coltivazioni.filter(
    (c) => c.stato === "in_corso" || c.stato === "pianificata"
  );
};

// Pre-save hook per validazioni
AppezzamentoSchema.pre("save", function (next) {
  // Verifica che la somma delle superfici in coltivazione non superi la superficie totale
  const coltivazioniAnnoCorrente = this.coltivazioni.filter(
    (c) => c.anno === new Date().getFullYear() && c.stato !== "abbandonata"
  );

  const superficieTotaleColtivata = coltivazioniAnnoCorrente.reduce(
    (total, c) => total + c.superficie_ha,
    0
  );

  if (superficieTotaleColtivata > this.superficie_ha) {
    next(
      new Error(
        `La superficie totale in coltivazione (${superficieTotaleColtivata} ha) supera la superficie dell'appezzamento (${this.superficie_ha} ha)`
      )
    );
  }

  next();
});

module.exports = mongoose.model("Appezzamento", AppezzamentoSchema);
