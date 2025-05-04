const mongoose = require("mongoose");

// Schema per movimenti di magazzino
const MovimentoSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: [true, "La data è obbligatoria"],
    default: Date.now,
  },
  tipo: {
    type: String,
    enum: ["carico", "scarico"],
    required: [true, "Il tipo di movimento è obbligatorio"],
  },
  quantita: {
    type: Number,
    required: [true, "La quantità è obbligatoria"],
    min: [0, "La quantità non può essere negativa"],
  },
  unita_misura: {
    type: String,
    required: [true, "L'unità di misura è obbligatoria"],
  },
  // Per movimenti di carico
  fornitore: String,
  documento: String,
  prezzo_unitario: {
    type: Number,
    min: [0, "Il prezzo non può essere negativo"],
  },
  // Per movimenti di scarico
  id_appezzamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appezzamento",
  },
  trattamento: String,
  note: String,
});

const ProdottoAgronomico = new mongoose.Schema(
  {
    codice: {
      type: String,
      required: [true, "Il codice è obbligatorio"],
      unique: true,
      trim: true,
    },
    nome_commerciale: {
      type: String,
      required: [true, "Il nome commerciale è obbligatorio"],
      trim: true,
    },
    principio_attivo: {
      type: String,
      required: [true, "Il principio attivo è obbligatorio"],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, "La categoria è obbligatoria"],
      enum: ["fitosanitario", "concime", "altro"],
    },
    sottocategoria: {
      type: String,
      enum: [
        // Per fitosanitari
        "fungicida",
        "insetticida",
        "acaricida",
        "erbicida",
        "disinfettante",
        "fitoregolatore",
        // Per concimi
        "azotato",
        "fosfatico",
        "potassico",
        "organico",
        "organo-minerale",
        "correttivo",
        // Altro
        "coadiuvante",
        "altro",
      ],
    },
    forma_formulazione: {
      type: String,
      enum: [
        "liquido",
        "granulare",
        "polvere",
        "pasta",
        "gel",
        "sospensione",
        "emulsione",
      ],
    },
    unita_misura: {
      type: String,
      required: [true, "L'unità di misura è obbligatoria"],
      enum: ["l", "kg", "g", "ml", "t"],
    },
    dosaggio_raccomandato: {
      minimo: Number,
      massimo: Number,
      note: String,
    },
    caratteristiche: {
      concentrazione: String,
      ph: {
        type: Number,
        min: [0, "PH non valido"],
        max: [14, "PH non valido"],
      },
      densita: Number,
      temperatura_conservazione: {
        minima: Number,
        massima: Number,
      },
    },
    giacenza: {
      quantita_attuale: {
        type: Number,
        default: 0,
        min: [0, "La giacenza non può essere negativa"],
      },
      scorta_minima: {
        type: Number,
        default: 0,
        min: [0, "La scorta minima non può essere negativa"],
      },
      localizzazione: String,
    },
    // Registrazione fitosanitaria/normativa
    registrazione: {
      numero_registrazione: String,
      scadenza_registrazione: Date,
      autorizzato_bio: {
        type: Boolean,
        default: false,
      },
    },
    // Sicurezza e manipolazione
    scheda_sicurezza: {
      dpi_richiesti: [String],
      tossicita: {
        type: String,
        enum: ["bassa", "media", "alta"],
        default: "bassa",
      },
      tempo_rientro: Number, // ore minime per rientro in campo
    },
    // Costi e prezzi
    prezzi: {
      ultimo_acquisto: {
        prezzo: Number,
        data: Date,
        fornitore: String,
      },
      prezzo_medio: Number,
    },
    // Tracking utilizzo
    movimenti: [MovimentoSchema],
    appezzamenti_utilizzati: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appezzamento",
      },
    ],
    note: String,
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
ProdottoAgronomico.index({ codice: 1 });
ProdottoAgronomico.index({ categoria: 1, sottocategoria: 1 });
ProdottoAgronomico.index({ nome_commerciale: 1 });

// Virtual per calcolare il totale dei carichi
ProdottoAgronomico.virtual("totale_carichi").get(function () {
  return this.movimenti
    .filter((m) => m.tipo === "carico")
    .reduce((total, m) => total + m.quantita, 0);
});

// Virtual per calcolare il totale degli scarichi
ProdottoAgronomico.virtual("totale_scarichi").get(function () {
  return this.movimenti
    .filter((m) => m.tipo === "scarico")
    .reduce((total, m) => total + m.quantita, 0);
});

// Metodo per verificare se la giacenza è sotto la scorta minima
ProdottoAgronomico.methods.isScortaMinima = function () {
  return this.giacenza.quantita_attuale <= this.giacenza.scorta_minima;
};

// Pre-save hook per aggiornare la giacenza in base ai movimenti
ProdottoAgronomico.pre("save", function (next) {
  if (this.movimenti && this.movimenti.length > 0) {
    const totaleCarichi = this.movimenti
      .filter((m) => m.tipo === "carico")
      .reduce((total, m) => total + m.quantita, 0);

    const totaleScarichi = this.movimenti
      .filter((m) => m.tipo === "scarico")
      .reduce((total, m) => total + m.quantita, 0);

    this.giacenza.quantita_attuale = totaleCarichi - totaleScarichi;
  }
  next();
});

module.exports = mongoose.model("ProdottoAgronomico", ProdottoAgronomico);
