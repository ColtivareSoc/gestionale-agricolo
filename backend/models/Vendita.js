const mongoose = require("mongoose");

// Schema per le righe della vendita
const RigaVenditaSchema = new mongoose.Schema({
  id_prodotto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProdottoAgricolo",
    required: [true, "Il prodotto è obbligatorio"],
  },
  prodotto_nome: {
    type: String,
    required: [true, "Il nome del prodotto è obbligatorio"],
  },
  quantita: {
    type: Number,
    required: [true, "La quantità è obbligatoria"],
    min: [0, "La quantità non può essere negativa"],
  },
  unita_misura: {
    type: String,
    required: [true, "L'unità di misura è obbligatoria"],
    enum: ["kg", "q", "t", "unità", "cassetta"],
  },
  prezzo_unitario: {
    type: Number,
    required: [true, "Il prezzo unitario è obbligatorio"],
    min: [0, "Il prezzo non può essere negativo"],
  },
  importo: {
    type: Number,
    required: [true, "L'importo è obbligatorio"],
    min: [0, "L'importo non può essere negativo"],
  },
  id_imballaggio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Imballaggio", // Assumendo che esista un modello Imballaggio
  },
  imballaggio_descrizione: String,
  numero_pezzi: {
    type: Number,
    min: [0, "Il numero di pezzi non può essere negativo"],
  },
});

const VenditaSchema = new mongoose.Schema(
  {
    numero_documento: {
      type: String,
      required: [true, "Il numero documento è obbligatorio"],
      unique: true,
      trim: true,
    },
    tipo_documento: {
      type: String,
      required: [true, "Il tipo documento è obbligatorio"],
      enum: ["fattura", "ddt", "preventivo"],
    },
    data: {
      type: Date,
      required: [true, "La data è obbligatoria"],
      default: Date.now,
    },
    id_cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: [true, "Il cliente è obbligatorio"],
    },
    cliente_nome: {
      type: String,
      required: [true, "Il nome del cliente è obbligatorio"],
    },
    stato: {
      type: String,
      required: [true, "Lo stato è obbligatorio"],
      enum: [
        "da_consegnare",
        "consegnato",
        "pagato",
        "annullato",
        "da_confermare",
      ],
      default: "da_consegnare",
    },
    pagamento: {
      type: String,
      required: [true, "Il tipo di pagamento è obbligatorio"],
      enum: [
        "rimessa_diretta",
        "bonifico_30gg",
        "bonifico_60gg",
        "ricevuta_bancaria",
      ],
    },
    data_consegna: {
      type: Date,
    },
    data_pagamento: {
      type: Date,
    },
    note: {
      type: String,
      trim: true,
    },
    righe: {
      type: [RigaVenditaSchema],
      validate: {
        validator: function () {
          return this.righe && this.righe.length > 0;
        },
        message: "La vendita deve avere almeno una riga",
      },
    },
    totale_netto: {
      type: Number,
      required: [true, "Il totale netto è obbligatorio"],
      min: [0, "Il totale non può essere negativo"],
    },
    // Per il collegamento con eventuale carico da bins
    bins_associati: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bin",
      },
    ],
    // Tracking modifiche
    utente_creazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    utente_ultima_modifica: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indici per migliorare le performance
VenditaSchema.index({ numero_documento: 1 });
VenditaSchema.index({ data: -1 });
VenditaSchema.index({ id_cliente: 1 });
VenditaSchema.index({ stato: 1 });

// Virtual per calcolare il totale dei righe prodotti
VenditaSchema.virtual("totale_calcolato").get(function () {
  return this.righe.reduce((total, riga) => total + riga.importo, 0);
});

// Pre-save hook per validare che il totale sia corretto
VenditaSchema.pre("save", function (next) {
  const totaleProdotti = this.righe.reduce(
    (total, riga) => total + riga.importo,
    0
  );

  // Aggiorna il totale netto con il totale calcolato
  this.totale_netto = totaleProdotti;

  // Calcola l'importo per ogni riga
  this.righe.forEach((riga) => {
    riga.importo = riga.quantita * riga.prezzo_unitario;
  });

  next();
});

// Pre-save hook per aggiornare la data di consegna quando lo stato cambia
VenditaSchema.pre("save", function (next) {
  if (this.isModified("stato") && this.stato === "consegnato") {
    if (!this.data_consegna) {
      this.data_consegna = new Date();
    }
  }

  if (this.isModified("stato") && this.stato === "pagato") {
    if (!this.data_pagamento) {
      this.data_pagamento = new Date();
    }
  }

  next();
});

module.exports = mongoose.model("Vendita", VenditaSchema);
