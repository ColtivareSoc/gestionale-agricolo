const ProdottoAgricolo = require("../models/ProdottoAgricolo");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutti i prodotti agricoli
// @route   GET /api/prodotti-agricoli
// @access  Public
exports.getProdottiAgricoli = async (req, res) => {
  try {
    // Implementa opzioni di filtro e paginazione
    const { categoria, attivo, sort, page = 1, limit = 10 } = req.query;

    // Costruisci l'oggetto filtro in base ai parametri forniti
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (attivo !== undefined) filtro.attivo = attivo === "true";

    // Esegui la query con filtri, ordinamento e paginazione
    const prodotti = await ProdottoAgricolo.find(filtro)
      .sort(sort ? { [sort]: 1 } : { nome: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Conta il totale dei documenti per la paginazione
    const count = await ProdottoAgricolo.countDocuments(filtro);

    res.json({
      prodotti,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero dei prodotti agricoli:", error);
    res.status(500).json({
      message: "Errore nel recupero dei prodotti agricoli",
      error: error.message,
    });
  }
};

// @desc    Ottieni un singolo prodotto agricolo per ID
// @route   GET /api/prodotti-agricoli/:id
// @access  Public
exports.getProdottoAgricolo = async (req, res) => {
  try {
    const prodotto = await ProdottoAgricolo.findById(req.params.id)
      .populate("appezzamenti", "nome superficie")
      .populate("trattamentiConsigliati", "nome tipo");

    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nel recupero del prodotto agricolo:", error);
    res.status(500).json({
      message: "Errore nel recupero del prodotto agricolo",
      error: error.message,
    });
  }
};

// @desc    Crea un nuovo prodotto agricolo
// @route   POST /api/prodotti-agricoli
// @access  Private
exports.createProdottoAgricolo = async (req, res) => {
  try {
    // Verifica errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Crea il nuovo prodotto
    const prodotto = await ProdottoAgricolo.create(req.body);

    res.status(201).json(prodotto);
  } catch (error) {
    console.error("Errore nella creazione del prodotto agricolo:", error);
    res.status(500).json({
      message: "Errore nella creazione del prodotto agricolo",
      error: error.message,
    });
  }
};

// @desc    Aggiorna un prodotto agricolo
// @route   PUT /api/prodotti-agricoli/:id
// @access  Private
exports.updateProdottoAgricolo = async (req, res) => {
  try {
    // Verifica errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Cerca e aggiorna il prodotto
    const prodotto = await ProdottoAgricolo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nell'aggiornamento del prodotto agricolo:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento del prodotto agricolo",
      error: error.message,
    });
  }
};

// @desc    Elimina un prodotto agricolo
// @route   DELETE /api/prodotti-agricoli/:id
// @access  Private
exports.deleteProdottoAgricolo = async (req, res) => {
  try {
    const prodotto = await ProdottoAgricolo.findById(req.params.id);

    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    // Se il prodotto è utilizzato in appezzamenti, non permettere l'eliminazione
    if (prodotto.appezzamenti && prodotto.appezzamenti.length > 0) {
      return res.status(400).json({
        message:
          "Impossibile eliminare il prodotto: è attualmente utilizzato in uno o più appezzamenti",
      });
    }

    await prodotto.deleteOne();

    res.json({ message: "Prodotto agricolo eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del prodotto agricolo:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione del prodotto agricolo",
      error: error.message,
    });
  }
};

// @desc    Aggiorna le statistiche produttive di un prodotto
// @route   PATCH /api/prodotti-agricoli/:id/statistiche
// @access  Private
exports.updateStatisticheProduttive = async (req, res) => {
  try {
    const { resaMediaPerEttaro, ultimoRaccolto } = req.body;

    const prodotto = await ProdottoAgricolo.findByIdAndUpdate(
      req.params.id,
      {
        "statisticheProduttive.resaMediaPerEttaro": resaMediaPerEttaro,
        "statisticheProduttive.ultimoRaccolto": ultimoRaccolto,
      },
      { new: true, runValidators: true }
    );

    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nell'aggiornamento delle statistiche:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento delle statistiche",
      error: error.message,
    });
  }
};
