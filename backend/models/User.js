const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Il nome è obbligatorio"],
      trim: true,
    },
    cognome: {
      type: String,
      required: [true, "Il cognome è obbligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email è obbligatoria"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Inserisci un indirizzo email valido",
      ],
    },
    password: {
      type: String,
      required: [true, "La password è obbligatoria"],
      minlength: [6, "La password deve contenere almeno 6 caratteri"],
    },
    ruolo: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    dataRegistrazione: {
      type: Date,
      default: Date.now,
    },
    ultimo_accesso: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Metodo pre-save per hashare la password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metodo per verificare la password
UserSchema.methods.verificaPassword = async function (passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

module.exports = mongoose.model("User", UserSchema);
