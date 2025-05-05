// backend/models/Bin.js
const mongoose = require("mongoose");

const BinSchema = new mongoose.Schema(
  {
    codice_identificativo: {
      type: String,
      required: [true, "Il codice identificativo è obbligatorio"],
      unique: true,
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, "Il tipo di BIN è obbligatorio"],
      enum: ["Plastica", "Legno", "Metallo"],
      default: "Plastica",
    },
    capacita_kg: {
      type: Number,
      required: [true, "La capacità è obbligatoria"],
      min: [0, "La capacità non può essere negativa"],
    },
    tara_kg: {
      type: Number,
      required: [true, "La tara è obbligatoria"],
      min: [0, "La tara non può essere negativa"],
    },
    stato: {
      type: String,
      enum: ["vuoto", "pieno", "in_lavorazione"],
      default: "vuoto",
    },
    id_prodotto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProdottoAgricolo",
      validate: {
        validator: function () {
          return (
            this.stato === "vuoto" ||
            (this.stato !== "vuoto" && this.id_prodotto)
          );
        },
        message: "I BIN non vuoti devono avere un prodotto associato",
      },
    },
    prodotto_nome: {
      type: String,
      // Solo se il BIN è pieno o in lavorazione
      required: function () {
        return this.stato !== "vuoto";
      },
    },
    id_origine: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.stato !== "vuoto";
      },
      // La referenza può puntare sia ad Appezzamento che a Fornitore
    },
    origine_tipo: {
      type: String,
      enum: ["appezzamento", "fornitore"],
      required: function () {
        return this.stato !== "vuoto";
      },
    },
    origine_nome: {
      type: String,
      required: function () {
        return this.stato !== "vuoto";
      },
    },
    anno_raccolta: {
      type: Number,
      min: [2000, "Anno non valido"],
      max: [2100, "Anno non valido"],
      required: function () {
        return this.stato !== "vuoto";
      },
    },
    peso_netto_kg: {
      type: Number,
      min: [0, "Il peso netto non può essere negativo"],
      validate: {
        validator: function () {
          if (this.stato !== "vuoto") {
            return this.peso_netto_kg <= this.capacita_kg - this.tara_kg;
          }
          return true;
        },
        message: "Il peso netto non può superare la capacità disponibile",
      },
    },
    localizzazione: {
      type: String,
      trim: true,
    },
    data_acquisto: {
      type: Date,
      required: [true, "La data di acquisto è obbligatoria"],
    },
    data_carico: {
      type: Date,
      required: function () {
        return this.stato !== "vuoto";
      },
    },
    data_ultima_modifica_stato: {
      type: Date,
      default: Date.now,
    },
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
BinSchema.index({ codice_identificativo: 1 });
BinSchema.index({ stato: 1 });
BinSchema.index({ id_prodotto: 1 });

// Metodi virtuali
BinSchema.virtual("capacita_disponibile").get(function () {
  return this.capacita_kg - this.tara_kg;
});

BinSchema.virtual("peso_totale").get(function () {
  return this.peso_netto_kg ? this.peso_netto_kg + this.tara_kg : this.tara_kg;
});

// Pre-save hook per validazioni e aggiornamenti automatici
BinSchema.pre("save", function (next) {
  // Aggiorna data ultima modifica stato quando cambia lo stato
  if (this.isModified("stato")) {
    this.data_ultima_modifica_stato = new Date();
  }

  // Se il BIN viene svuotato, pulisce i dati del prodotto
  if (this.stato === "vuoto") {
    this.id_prodotto = null;
    this.prodotto_nome = null;
    this.id_origine = null;
    this.origine_tipo = null;
    this.origine_nome = null;
    this.anno_raccolta = null;
    this.peso_netto_kg = null;
    this.data_carico = null;
  }

  next();
});

// Metodo per svuotare il BIN
BinSchema.methods.svuota = function () {
  this.stato = "vuoto";
  this.id_prodotto = null;
  this.prodotto_nome = null;
  this.id_origine = null;
  this.origine_tipo = null;
  this.origine_nome = null;
  this.anno_raccolta = null;
  this.peso_netto_kg = null;
  this.data_carico = null;
  return this.save();
};

// Metodo per caricare il BIN
BinSchema.methods.carica = function (datiCarico) {
  this.stato = "pieno";
  this.id_prodotto = datiCarico.id_prodotto;
  this.prodotto_nome = datiCarico.prodotto_nome;
  this.id_origine = datiCarico.id_origine;
  this.origine_tipo = datiCarico.origine_tipo;
  this.origine_nome = datiCarico.origine_nome;
  this.anno_raccolta = datiCarico.anno_raccolta;
  this.peso_netto_kg = datiCarico.peso_netto_kg;
  this.data_carico = new Date();
  return this.save();
};

// Pre-remove hook per gestire relazioni
BinSchema.pre("remove", async function () {
  // Si potrebbe aggiungere logica per gestire BIN collegati a vendite
  // o altri documenti che devono essere notificati dell'eliminazione
});

module.exports = mongoose.model("Bin", BinSchema);
