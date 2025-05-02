const mongoose = require("mongoose");

const ProdottoAgricoloSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Il nome del prodotto è obbligatorio"],
      trim: true,
    },
    varietà: {
      type: String,
      required: [true, "La varietà è obbligatoria"],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, "La categoria è obbligatoria"],
      enum: ["Frutta", "Verdura", "Cereali", "Legumi", "Altro"],
      trim: true,
    },
    descrizione: {
      type: String,
      trim: true,
    },
    stagionalità: {
      inizio: {
        type: String,
        enum: [
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
        ],
        required: [true, "Il mese di inizio stagione è obbligatorio"],
      },
      fine: {
        type: String,
        enum: [
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
        ],
        required: [true, "Il mese di fine stagione è obbligatorio"],
      },
    },
    prezzoMedio: {
      type: Number,
      required: [true, "Il prezzo medio è obbligatorio"],
      min: [0, "Il prezzo non può essere negativo"],
    },
    unitàMisura: {
      type: String,
      required: [true, "L'unità di misura è obbligatoria"],
      enum: ["kg", "q", "t", "unità", "cassetta"],
      default: "kg",
    },
    tempoColtura: {
      type: Number,
      comment: "Tempo di coltura in giorni",
    },
    fabbisognoIdrico: {
      type: String,
      enum: ["Basso", "Medio", "Alto"],
      default: "Medio",
    },
    fabbisognoNutritivo: {
      type: String,
      enum: ["Basso", "Medio", "Alto"],
      default: "Medio",
    },
    immagine: {
      type: String,
      default: "no-image.jpg",
    },
    attivo: {
      type: Boolean,
      default: true,
    },
    // Campo per tracciare in quali appezzamenti è coltivato questo prodotto
    appezzamenti: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appezzamento",
      },
    ],
    // Statistiche produttive
    statisticheProduttive: {
      resaMediaPerEttaro: {
        type: Number,
        default: 0,
      },
      ultimoRaccolto: {
        quantità: Number,
        data: Date,
      },
    },
    // Per tracciare eventuali trattamenti consigliati o richiesti
    trattamentiConsigliati: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProdottoAgronomico",
      },
    ],
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indice per migliorare le prestazioni delle ricerche
ProdottoAgricoloSchema.index({ nome: 1, varietà: 1 });

// Metodo virtuale per calcolare il periodo di coltivazione in mesi
ProdottoAgricoloSchema.virtual("periodoColtivazioneInMesi").get(function () {
  const mesi = [
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
  ];

  const inizioIndex = mesi.indexOf(this.stagionalità.inizio);
  const fineIndex = mesi.indexOf(this.stagionalità.fine);

  // Gestione del caso in cui il periodo attraversa il cambio dell'anno
  if (fineIndex < inizioIndex) {
    return 12 - inizioIndex + fineIndex + 1;
  } else {
    return fineIndex - inizioIndex + 1;
  }
});

// Pre-save hook per validazioni aggiuntive
ProdottoAgricoloSchema.pre("save", function (next) {
  // Se necessario, aggiungi validazioni personalizzate qui
  next();
});

module.exports = mongoose.model("ProdottoAgricolo", ProdottoAgricoloSchema);
