const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Il nome del cliente è obbligatorio"],
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, "Il tipo di cliente è obbligatorio"],
      enum: ["cooperativa", "gdo", "mercato", "esportatore", "altro"],
    },
    indirizzo: {
      type: String,
      required: [true, "L'indirizzo è obbligatorio"],
      trim: true,
    },
    citta: {
      type: String,
      required: [true, "La città è obbligatoria"],
      trim: true,
    },
    provincia: {
      type: String,
      required: [true, "La provincia è obbligatoria"],
      trim: true,
      uppercase: true,
      maxlength: [2, "La provincia deve essere di 2 caratteri"],
    },
    cap: {
      type: String,
      required: [true, "Il CAP è obbligatorio"],
      trim: true,
      match: [/^[0-9]{5}$/, "CAP non valido"],
    },
    codice_fiscale: {
      type: String,
      trim: true,
      uppercase: true,
    },
    partita_iva: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Validazione base per P.IVA italiana
          return !v || /^[0-9]{11}$/.test(v);
        },
        message: "Partita IVA non valida",
      },
    },
    telefono: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          // Validazione email opzionale
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Email non valida",
      },
    },
    pagamento_preferito: {
      type: String,
      enum: [
        "rimessa_diretta",
        "bonifico_30gg",
        "bonifico_60gg",
        "ricevuta_bancaria",
      ],
      default: "bonifico_30gg",
    },
    // Informazioni commerciali
    sconto_default: {
      type: Number,
      min: [0, "Lo sconto non può essere negativo"],
      max: [100, "Lo sconto non può superare il 100%"],
      default: 0,
    },
    limite_credito: {
      type: Number,
      min: [0, "Il limite di credito non può essere negativo"],
      default: 0,
    },
    // Statistiche
    totale_vendite: {
      type: Number,
      default: 0,
      min: [0, "Il totale vendite non può essere negativo"],
    },
    ultima_vendita: {
      type: Date,
    },
    // Contatti aggiuntivi
    contatti: [
      {
        nome: String,
        ruolo: String,
        telefono: String,
        email: String,
      },
    ],
    note: {
      type: String,
      trim: true,
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
ClienteSchema.index({ nome: 1 });
ClienteSchema.index({ tipo: 1 });
ClienteSchema.index({ email: 1 });
ClienteSchema.index({ partita_iva: 1 });

// Virtual per calcolare il credito corrente (da implementare)
ClienteSchema.virtual("credito_corrente").get(function () {
  // Questa sarà calcolata in base alle vendite non pagate
  return 0; // Placeholder
});

// Metodo per aggiornare la statistica dell'ultima vendita
ClienteSchema.methods.aggiornaUltimaVendita = function (importo) {
  this.totale_vendite += importo;
  this.ultima_vendita = new Date();
  return this.save();
};

// Pre-save hook per formattare dati
ClienteSchema.pre("save", function (next) {
  // Formatta la provincia sempre in maiuscolo
  if (this.provincia) {
    this.provincia = this.provincia.toUpperCase();
  }

  // Rimuovi spazi dalla partita IVA
  if (this.partita_iva) {
    this.partita_iva = this.partita_iva.replace(/\s/g, "");
  }

  next();
});

// Pre-remove hook per verificare le vendite collegate
ClienteSchema.pre("remove", async function () {
  const Vendita = mongoose.model("Vendita");
  const venditaCount = await Vendita.countDocuments({ id_cliente: this._id });

  if (venditaCount > 0) {
    throw new Error(
      "Impossibile eliminare il cliente: esistono vendite collegate"
    );
  }
});

module.exports = mongoose.model("Cliente", ClienteSchema);
