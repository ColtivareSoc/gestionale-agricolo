const ProdottoAgronomico = require("../models/ProdottoAgronomico");
const Appezzamento = require("../models/Appezzamento");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutti i prodotti agronomici
// @route   GET /api/prodotti-agronomici
// @access  Private
exports.getProdottiAgronomici = async (req, res) => {
  try {
    const {
      categoria,
      sottocategoria,
      attivo,
      scorta_bassa,
      search,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Costruisci l'oggetto filtro
    const filtro = {};
    if (attivo !== undefined) filtro.attivo = attivo === "true";
    if (categoria) filtro.categoria = categoria;
    if (sottocategoria) filtro.sottocategoria = sottocategoria;

    // Filtro per search (nome commerciale o codice)
    if (search) {
      filtro.$or = [
        { nome_commerciale: { $regex: search, $options: "i" } },
        { codice: { $regex: search, $options: "i" } },
        { principio_attivo: { $regex: search, $options: "i" } },
      ];
    }

    // Query base
    let query = ProdottoAgronomico.find(filtro);

    // Applica filtro per scorta bassa
    if (scorta_bassa === "true") {
      query = query
        .where("giacenza.quantita_attuale")
        .lte("$giacenza.scorta_minima");
    }

    // Esegui la query con paginazione
    const prodotti = await query
      .sort(sort ? { [sort]: 1 } : { nome_commerciale: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await ProdottoAgronomico.countDocuments(filtro);

    res.json({
      prodotti,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero dei prodotti agronomici:", error);
    res.status(500).json({
      message: "Errore nel recupero dei prodotti agronomici",
      error: error.message,
    });
  }
};

// @desc    Ottieni un singolo prodotto agronomico
// @route   GET /api/prodotti-agronomici/:id
// @access  Private
exports.getProdottoAgronomico = async (req, res) => {
  try {
    const prodotto = await ProdottoAgronomico.findById(req.params.id)
      .populate("appezzamenti_utilizzati", "nome superficie")
      .populate("movimenti.id_appezzamento", "nome codice");

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nel recupero del prodotto agronomico:", error);
    res.status(500).json({
      message: "Errore nel recupero del prodotto agronomico",
      error: error.message,
    });
  }
};

// @desc    Crea un nuovo prodotto agronomico
// @route   POST /api/prodotti-agronomici
// @access  Private (admin/manager)
exports.createProdottoAgronomico = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prodotto = await ProdottoAgronomico.create(req.body);

    res.status(201).json(prodotto);
  } catch (error) {
    console.error("Errore nella creazione del prodotto agronomico:", error);
    res.status(500).json({
      message: "Errore nella creazione del prodotto agronomico",
      error: error.message,
    });
  }
};

// @desc    Aggiorna un prodotto agronomico
// @route   PUT /api/prodotti-agronomici/:id
// @access  Private (admin/manager)
exports.updateProdottoAgronomico = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prodotto = await ProdottoAgronomico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nell'aggiornamento del prodotto agronomico:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento del prodotto agronomico",
      error: error.message,
    });
  }
};

// @desc    Elimina un prodotto agronomico
// @route   DELETE /api/prodotti-agronomicos/:id
// @access  Private (admin)
exports.deleteProdottoAgronomico = async (req, res) => {
  try {
    const prodotto = await ProdottoAgronomico.findById(req.params.id);

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    // Verifica se ci sono movimenti registrati
    if (prodotto.movimenti && prodotto.movimenti.length > 0) {
      return res.status(400).json({
        message: "Impossibile eliminare: esistono movimenti registrati",
      });
    }

    await prodotto.deleteOne();

    res.json({ message: "Prodotto agronomico eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del prodotto agronomico:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione del prodotto agronomico",
      error: error.message,
    });
  }
};

// @desc    Aggiungi un movimento (carico/scarico)
// @route   POST /api/prodotti-agronomici/:id/movimenti
// @access  Private (admin/manager)
exports.createMovimento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prodotto = await ProdottoAgronomico.findById(req.params.id);

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    // Verifica unità di misura
    if (req.body.unita_misura !== prodotto.unita_misura) {
      return res.status(400).json({
        message: `L'unità di misura deve essere: ${prodotto.unita_misura}`,
      });
    }

    // Per scarichi, verifica giacenza disponibile
    if (req.body.tipo === "scarico") {
      if (prodotto.giacenza.quantita_attuale < req.body.quantita) {
        return res.status(400).json({
          message: `Giacenza insufficiente. Disponibile: ${prodotto.giacenza.quantita_attuale} ${prodotto.unita_misura}`,
        });
      }

      // Verifica che esista l'appezzamento per gli scarichi
      if (req.body.id_appezzamento) {
        const appezzamento = await Appezzamento.findById(
          req.body.id_appezzamento
        );
        if (!appezzamento) {
          return res.status(404).json({ message: "Appezzamento non trovato" });
        }

        // Aggiungi l'appezzamento alla lista se non è già presente
        if (!prodotto.appezzamenti_utilizzati.includes(appezzamento._id)) {
          prodotto.appezzamenti_utilizzati.push(appezzamento._id);
        }
      }
    }

    // Aggiungi il movimento
    prodotto.movimenti.push({
      ...req.body,
      data: req.body.data || new Date(),
    });

    // Aggiorna prezzo medio se è un carico con prezzo
    if (req.body.tipo === "carico" && req.body.prezzo_unitario) {
      if (!prodotto.prezzi.prezzo_medio) {
        prodotto.prezzi.prezzo_medio = req.body.prezzo_unitario;
      } else {
        // Calcola media ponderata
        const quantitaTotale =
          prodotto.giacenza.quantita_attuale + req.body.quantita;
        prodotto.prezzi.prezzo_medio =
          (prodotto.prezzi.prezzo_medio * prodotto.giacenza.quantita_attuale +
            req.body.prezzo_unitario * req.body.quantita) /
          quantitaTotale;
      }

      prodotto.prezzi.ultimo_acquisto = {
        prezzo: req.body.prezzo_unitario,
        data: new Date(),
        fornitore: req.body.fornitore,
      };
    }

    await prodotto.save();

    res.status(201).json(prodotto);
  } catch (error) {
    console.error("Errore nella creazione del movimento:", error);
    res.status(500).json({
      message: "Errore nella creazione del movimento",
      error: error.message,
    });
  }
};

// @desc    Ottieni movimenti di un prodotto
// @route   GET /api/prodotti-agronomici/:id/movimenti
// @access  Private
exports.getMovimenti = async (req, res) => {
  try {
    const { tipo, data_inizio, data_fine } = req.query;

    const prodotto = await ProdottoAgronomico.findById(req.params.id)
      .populate("movimenti.id_appezzamento", "nome codice")
      .select("movimenti");

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    let movimenti = [...prodotto.movimenti];

    // Filtra per tipo
    if (tipo) {
      movimenti = movimenti.filter((m) => m.tipo === tipo);
    }

    // Filtra per range di date
    if (data_inizio || data_fine) {
      movimenti = movimenti.filter((m) => {
        const dataMovimento = new Date(m.data);
        if (data_inizio && dataMovimento < new Date(data_inizio)) return false;
        if (data_fine && dataMovimento > new Date(data_fine)) return false;
        return true;
      });
    }

    // Ordina per data decrescente (più recenti prima)
    movimenti.sort((a, b) => new Date(b.data) - new Date(a.data));

    res.json(movimenti);
  } catch (error) {
    console.error("Errore nel recupero dei movimenti:", error);
    res.status(500).json({
      message: "Errore nel recupero dei movimenti",
      error: error.message,
    });
  }
};

// @desc    Aggiorna giacenza manuale
// @route   PATCH /api/prodotti-agronomici/:id/giacenza
// @access  Private (admin)
exports.updateGiacenza = async (req, res) => {
  try {
    const { quantita_attuale, scorta_minima, localizzazione, motivo } =
      req.body;

    const prodotto = await ProdottoAgronomico.findById(req.params.id);

    if (!prodotto) {
      return res
        .status(404)
        .json({ message: "Prodotto agronomico non trovato" });
    }

    // Registra un movimento di rettifica se necessario
    if (
      quantita_attuale !== undefined &&
      quantita_attuale !== prodotto.giacenza.quantita_attuale
    ) {
      const diff = quantita_attuale - prodotto.giacenza.quantita_attuale;

      prodotto.movimenti.push({
        data: new Date(),
        tipo: diff > 0 ? "carico" : "scarico",
        quantita: Math.abs(diff),
        unita_misura: prodotto.unita_misura,
        note: `Rettifica manuale: ${motivo || "Non specificato"}`,
      });
    }

    // Aggiorna i campi
    if (quantita_attuale !== undefined)
      prodotto.giacenza.quantita_attuale = quantita_attuale;
    if (scorta_minima !== undefined)
      prodotto.giacenza.scorta_minima = scorta_minima;
    if (localizzazione !== undefined)
      prodotto.giacenza.localizzazione = localizzazione;

    await prodotto.save();

    res.json(prodotto);
  } catch (error) {
    console.error("Errore nell'aggiornamento della giacenza:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento della giacenza",
      error: error.message,
    });
  }
};

// @desc    Ottieni prodotti con scorta bassa
// @route   GET /api/prodotti-agronomici/scorta-bassa
// @access  Private
exports.getProdottiScortaBassa = async (req, res) => {
  try {
    const prodotti = await ProdottoAgronomico.find({
      attivo: true,
      $expr: {
        $lte: ["$giacenza.quantita_attuale", "$giacenza.scorta_minima"],
      },
    }).select("codice nome_commerciale giacenza unita_misura");

    res.json(prodotti);
  } catch (error) {
    console.error("Errore nel recupero dei prodotti a scorta bassa:", error);
    res.status(500).json({
      message: "Errore nel recupero dei prodotti a scorta bassa",
      error: error.message,
    });
  }
};
