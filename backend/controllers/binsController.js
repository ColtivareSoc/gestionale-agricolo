// backend/controllers/binsController.js
const Bin = require("../models/Bin");
const ProdottoAgricolo = require("../models/ProdottoAgricolo");
const Appezzamento = require("../models/Appezzamento");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutti i BINS
// @route   GET /api/bins
// @access  Private
exports.getBins = async (req, res) => {
  try {
    const { stato, tipo, search, page = 1, limit = 10 } = req.query;

    // Costruisci l'oggetto filtro
    const filtro = { attivo: true };
    if (stato) filtro.stato = stato;
    if (tipo) filtro.tipo = tipo;

    // Filtro per search
    if (search) {
      filtro.$or = [
        { codice_identificativo: { $regex: search, $options: "i" } },
        { prodotto_nome: { $regex: search, $options: "i" } },
        { localizzazione: { $regex: search, $options: "i" } },
      ];
    }

    // Esegui la query con paginazione
    const bins = await Bin.find(filtro)
      .populate("id_prodotto", "nome varieta categoria")
      .sort({ codice_identificativo: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Bin.countDocuments(filtro);

    res.json({
      bins,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero dei BINS:", error);
    res.status(500).json({
      message: "Errore nel recupero dei BINS",
      error: error.message,
    });
  }
};

// @desc    Ottieni un singolo BIN
// @route   GET /api/bins/:id
// @access  Private
exports.getBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate(
      "id_prodotto",
      "nome varieta categoria prezzoMedio"
    );

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    res.json(bin);
  } catch (error) {
    console.error("Errore nel recupero del BIN:", error);
    res.status(500).json({
      message: "Errore nel recupero del BIN",
      error: error.message,
    });
  }
};

// @desc    Crea un nuovo BIN
// @route   POST /api/bins
// @access  Private (admin/manager)
exports.createBin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bin = await Bin.create(req.body);

    res.status(201).json(bin);
  } catch (error) {
    console.error("Errore nella creazione del BIN:", error);
    res.status(500).json({
      message: "Errore nella creazione del BIN",
      error: error.message,
    });
  }
};

// @desc    Crea più BINS
// @route   POST /api/bins/batch
// @access  Private (admin/manager)
exports.createBinsBatch = async (req, res) => {
  try {
    const {
      prefisso,
      numero_iniziale,
      quantita,
      tipo,
      capacita_kg,
      tara_kg,
      localizzazione,
      data_acquisto,
    } = req.body;

    const bins = [];
    for (let i = 0; i < parseInt(quantita); i++) {
      const numero = (parseInt(numero_iniziale) + i)
        .toString()
        .padStart(3, "0");
      const codice = `${prefisso}${numero}`;

      bins.push({
        codice_identificativo: codice,
        tipo,
        capacita_kg: parseFloat(capacita_kg),
        tara_kg: parseFloat(tara_kg),
        localizzazione,
        data_acquisto,
      });
    }

    const createdBins = await Bin.insertMany(bins);

    res.status(201).json({
      message: `${createdBins.length} BINS creati con successo`,
      bins: createdBins,
    });
  } catch (error) {
    console.error("Errore nella creazione batch dei BINS:", error);
    res.status(500).json({
      message: "Errore nella creazione batch dei BINS",
      error: error.message,
    });
  }
};

// @desc    Aggiorna un BIN
// @route   PUT /api/bins/:id
// @access  Private (admin/manager)
exports.updateBin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bin = await Bin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    res.json(bin);
  } catch (error) {
    console.error("Errore nell'aggiornamento del BIN:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento del BIN",
      error: error.message,
    });
  }
};

// @desc    Elimina un BIN
// @route   DELETE /api/bins/:id
// @access  Private (admin)
exports.deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    // Verifica se il BIN è vuoto prima di eliminare
    if (bin.stato !== "vuoto") {
      return res.status(400).json({
        message: "Impossibile eliminare un BIN non vuoto",
      });
    }

    await bin.deleteOne();

    res.json({ message: "BIN eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del BIN:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione del BIN",
      error: error.message,
    });
  }
};

// @desc    Carica un BIN
// @route   POST /api/bins/:id/carica
// @access  Private (admin/manager)
exports.caricaBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    if (bin.stato !== "vuoto") {
      return res.status(400).json({
        message: "Solo i BINS vuoti possono essere caricati",
      });
    }

    const {
      id_prodotto,
      origine_tipo,
      id_origine,
      anno_raccolta,
      peso_netto_kg,
      localizzazione,
    } = req.body;

    // Verifica che il prodotto esista
    const prodotto = await ProdottoAgricolo.findById(id_prodotto);
    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    // Verifica capacità
    if (peso_netto_kg > bin.capacita_kg - bin.tara_kg) {
      return res.status(400).json({
        message: `Il peso netto non può superare ${
          bin.capacita_kg - bin.tara_kg
        } kg (capacità - tara)`,
      });
    }

    // Trova l'origine
    let origine = null;
    if (origine_tipo === "appezzamento") {
      origine = await Appezzamento.findById(id_origine);
    } else if (origine_tipo === "fornitore") {
      // Assumendo che sia già stato verificato l'ID fornitore altrove
      origine = { nome: req.body.fornitore_nome }; // Placeholder
    }

    if (!origine) {
      return res.status(404).json({ message: "Origine non trovata" });
    }

    // Carica il BIN
    await bin.carica({
      id_prodotto,
      prodotto_nome: `${prodotto.nome} ${prodotto.varieta}`,
      id_origine,
      origine_tipo,
      origine_nome: origine.nome,
      anno_raccolta,
      peso_netto_kg,
    });

    if (localizzazione) {
      bin.localizzazione = localizzazione;
      await bin.save();
    }

    res.json(bin);
  } catch (error) {
    console.error("Errore nel carico del BIN:", error);
    res.status(500).json({
      message: "Errore nel carico del BIN",
      error: error.message,
    });
  }
};

// @desc    Svuota un BIN
// @route   POST /api/bins/:id/svuota
// @access  Private (admin/manager)
exports.svuotaBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    if (bin.stato === "vuoto") {
      return res.status(400).json({ message: "Il BIN è già vuoto" });
    }

    await bin.svuota();

    res.json(bin);
  } catch (error) {
    console.error("Errore nello svuotamento del BIN:", error);
    res.status(500).json({
      message: "Errore nello svuotamento del BIN",
      error: error.message,
    });
  }
};

// @desc    Cambia stato BIN a in_lavorazione
// @route   PATCH /api/bins/:id/in-lavorazione
// @access  Private (admin/manager)
exports.setBinInLavorazione = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({ message: "BIN non trovato" });
    }

    if (bin.stato !== "pieno") {
      return res.status(400).json({
        message: "Solo i BINS pieni possono essere messi in lavorazione",
      });
    }

    bin.stato = "in_lavorazione";
    await bin.save();

    res.json(bin);
  } catch (error) {
    console.error("Errore nel cambio stato del BIN:", error);
    res.status(500).json({
      message: "Errore nel cambio stato del BIN",
      error: error.message,
    });
  }
};

// @desc    Ottieni statistiche BINS
// @route   GET /api/bins/statistiche
// @access  Private
exports.getStatisticheBins = async (req, res) => {
  try {
    const statistiche = {
      totale: await Bin.countDocuments({ attivo: true }),
      per_stato: {
        vuoti: await Bin.countDocuments({ stato: "vuoto", attivo: true }),
        pieni: await Bin.countDocuments({ stato: "pieno", attivo: true }),
        in_lavorazione: await Bin.countDocuments({
          stato: "in_lavorazione",
          attivo: true,
        }),
      },
      per_tipo: {
        plastica: await Bin.countDocuments({ tipo: "Plastica", attivo: true }),
        legno: await Bin.countDocuments({ tipo: "Legno", attivo: true }),
        metallo: await Bin.countDocuments({ tipo: "Metallo", attivo: true }),
      },
      peso_totale_stoccato: await Bin.aggregate([
        { $match: { stato: { $ne: "vuoto" }, attivo: true } },
        { $group: { _id: null, totale: { $sum: "$peso_netto_kg" } } },
      ]).then((result) => result[0]?.totale || 0),
    };

    res.json(statistiche);
  } catch (error) {
    console.error("Errore nel recupero delle statistiche:", error);
    res.status(500).json({
      message: "Errore nel recupero delle statistiche",
      error: error.message,
    });
  }
};
