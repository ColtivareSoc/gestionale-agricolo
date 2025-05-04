// backend/controllers/appezzamentiController.js
const Appezzamento = require("../models/Appezzamento");
const ProdottoAgricolo = require("../models/ProdottoAgricolo");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutti gli appezzamenti
// @route   GET /api/appezzamenti
// @access  Private
exports.getAppezzamenti = async (req, res) => {
  try {
    const { attivo, tipo_terreno, sort, page = 1, limit = 10 } = req.query;

    // Costruisci l'oggetto filtro
    const filtro = {};
    if (attivo !== undefined) filtro.attivo = attivo === "true";
    if (tipo_terreno) filtro.tipo_terreno = tipo_terreno;

    // Esegui la query con filtri e paginazione
    const appezzamenti = await Appezzamento.find(filtro)
      .populate("coltivazioni.id_prodotto", "nome varietà categoria")
      .sort(sort ? { [sort]: 1 } : { nome: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Appezzamento.countDocuments(filtro);

    res.json({
      appezzamenti,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero degli appezzamenti:", error);
    res.status(500).json({
      message: "Errore nel recupero degli appezzamenti",
      error: error.message,
    });
  }
};

// @desc    Ottieni un singolo appezzamento
// @route   GET /api/appezzamenti/:id
// @access  Private
exports.getAppezzamento = async (req, res) => {
  try {
    const appezzamento = await Appezzamento.findById(req.params.id)
      .populate(
        "coltivazioni.id_prodotto",
        "nome varietà categoria prezzoMedio"
      )
      .populate("trattamenti", "data tipo prodotto quantità");

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    res.json(appezzamento);
  } catch (error) {
    console.error("Errore nel recupero dell'appezzamento:", error);
    res.status(500).json({
      message: "Errore nel recupero dell'appezzamento",
      error: error.message,
    });
  }
};

// @desc    Crea un nuovo appezzamento
// @route   POST /api/appezzamenti
// @access  Private (admin/manager)
exports.createAppezzamento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appezzamento = await Appezzamento.create(req.body);

    res.status(201).json(appezzamento);
  } catch (error) {
    console.error("Errore nella creazione dell'appezzamento:", error);
    res.status(500).json({
      message: "Errore nella creazione dell'appezzamento",
      error: error.message,
    });
  }
};

// @desc    Aggiorna un appezzamento
// @route   PUT /api/appezzamenti/:id
// @access  Private (admin/manager)
exports.updateAppezzamento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appezzamento = await Appezzamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    res.json(appezzamento);
  } catch (error) {
    console.error("Errore nell'aggiornamento dell'appezzamento:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento dell'appezzamento",
      error: error.message,
    });
  }
};

// @desc    Elimina un appezzamento
// @route   DELETE /api/appezzamenti/:id
// @access  Private (admin)
exports.deleteAppezzamento = async (req, res) => {
  try {
    const appezzamento = await Appezzamento.findById(req.params.id);

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    // Controlla se ci sono coltivazioni attive
    const coltivazioniAttive = appezzamento.getColtivazioniAttive();
    if (coltivazioniAttive.length > 0) {
      return res.status(400).json({
        message: "Impossibile eliminare: esistono coltivazioni attive",
      });
    }

    await appezzamento.deleteOne();

    res.json({ message: "Appezzamento eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione dell'appezzamento:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione dell'appezzamento",
      error: error.message,
    });
  }
};

// @desc    Aggiungi una coltivazione a un appezzamento
// @route   POST /api/appezzamenti/:id/coltivazioni
// @access  Private (admin/manager)
exports.addColtivazione = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appezzamento = await Appezzamento.findById(req.params.id);

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    // Verifica che il prodotto esista
    const prodotto = await ProdottoAgricolo.findById(req.body.id_prodotto);
    if (!prodotto) {
      return res.status(404).json({ message: "Prodotto agricolo non trovato" });
    }

    // Aggiungi la coltivazione
    appezzamento.coltivazioni.push(req.body);

    // Aggiungi l'appezzamento al prodotto
    if (!prodotto.appezzamenti.includes(appezzamento._id)) {
      prodotto.appezzamenti.push(appezzamento._id);
      await prodotto.save();
    }

    await appezzamento.save();

    res.status(201).json(appezzamento);
  } catch (error) {
    console.error("Errore nell'aggiunta della coltivazione:", error);
    res.status(500).json({
      message: "Errore nell'aggiunta della coltivazione",
      error: error.message,
    });
  }
};

// @desc    Aggiorna una coltivazione
// @route   PUT /api/appezzamenti/:id/coltivazioni/:coltivazione_id
// @access  Private (admin/manager)
exports.updateColtivazione = async (req, res) => {
  try {
    const appezzamento = await Appezzamento.findById(req.params.id);

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    const coltivazione = appezzamento.coltivazioni.id(
      req.params.coltivazione_id
    );

    if (!coltivazione) {
      return res.status(404).json({ message: "Coltivazione non trovata" });
    }

    // Aggiorna i campi
    Object.assign(coltivazione, req.body);

    await appezzamento.save();

    res.json(appezzamento);
  } catch (error) {
    console.error("Errore nell'aggiornamento della coltivazione:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento della coltivazione",
      error: error.message,
    });
  }
};

// @desc    Elimina una coltivazione
// @route   DELETE /api/appezzamenti/:id/coltivazioni/:coltivazione_id
// @access  Private (admin/manager)
exports.deleteColtivazione = async (req, res) => {
  try {
    const appezzamento = await Appezzamento.findById(req.params.id);

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    const coltivazione = appezzamento.coltivazioni.id(
      req.params.coltivazione_id
    );

    if (!coltivazione) {
      return res.status(404).json({ message: "Coltivazione non trovata" });
    }

    // Rimuovi la coltivazione
    coltivazione.remove();

    // Aggiorna il prodotto agricolo
    const prodotto = await ProdottoAgricolo.findById(coltivazione.id_prodotto);
    if (prodotto) {
      prodotto.appezzamenti.pull(appezzamento._id);
      await prodotto.save();
    }

    await appezzamento.save();

    res.json(appezzamento);
  } catch (error) {
    console.error("Errore nell'eliminazione della coltivazione:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione della coltivazione",
      error: error.message,
    });
  }
};

// @desc    Ottieni le statistiche di un appezzamento
// @route   GET /api/appezzamenti/:id/statistiche
// @access  Private
exports.getStatisticheAppezzamento = async (req, res) => {
  try {
    const appezzamento = await Appezzamento.findById(req.params.id).populate(
      "coltivazioni.id_prodotto",
      "nome varietà"
    );

    if (!appezzamento) {
      return res.status(404).json({ message: "Appezzamento non trovato" });
    }

    const { anno } = req.query;

    // Calcola le statistiche
    const statistiche = {
      superficie_totale: appezzamento.superficie_ha,
      superficie_in_coltivazione: anno
        ? appezzamento.superficie_in_coltivazione_anno(parseInt(anno))
        : appezzamento.superficie_in_coltivazione_anno(
            new Date().getFullYear()
          ),
      numero_coltivazioni: appezzamento.coltivazioni.length,
      coltivazioni_attive: appezzamento.getColtivazioniAttive().length,
      produzione_totale: appezzamento.coltivazioni
        .filter((c) => c.stato === "completata" && c.resa_quintal_ha)
        .reduce((total, c) => total + c.resa_quintal_ha * c.superficie_ha, 0),
      prodotti_coltivati: [
        ...new Set(appezzamento.coltivazioni.map((c) => c.id_prodotto)),
      ],
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
