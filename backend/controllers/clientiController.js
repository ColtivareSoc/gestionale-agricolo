const Cliente = require("../models/Cliente");
const Vendita = require("../models/Vendita");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutti i clienti
// @route   GET /api/clienti
// @access  Private
exports.getClienti = async (req, res) => {
  try {
    const { tipo, attivo, search, page = 1, limit = 10 } = req.query;

    // Costruisci l'oggetto filtro
    const filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (attivo !== undefined) filtro.attivo = attivo === "true";

    // Filtro per search
    if (search) {
      filtro.$or = [
        { nome: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { partita_iva: { $regex: search, $options: "i" } },
      ];
    }

    // Query con paginazione
    const clienti = await Cliente.find(filtro)
      .sort({ nome: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Cliente.countDocuments(filtro);

    res.json({
      clienti,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero dei clienti:", error);
    res.status(500).json({
      message: "Errore nel recupero dei clienti",
      error: error.message,
    });
  }
};

// @desc    Ottieni un singolo cliente
// @route   GET /api/clienti/:id
// @access  Private
exports.getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente non trovato" });
    }

    // Aggiungi dati statistici
    const statistiche = {
      vendite_totali: await Vendita.countDocuments({ id_cliente: cliente._id }),
      importo_totale: await Vendita.aggregate([
        { $match: { id_cliente: cliente._id, stato: "pagato" } },
        { $group: { _id: null, totale: { $sum: "$totale_netto" } } },
      ]).then((result) => result[0]?.totale || 0),
      ultima_vendita: await Vendita.findOne({ id_cliente: cliente._id })
        .sort({ data: -1 })
        .select("numero_documento data totale_netto"),
    };

    res.json({
      ...cliente.toObject(),
      statistiche,
    });
  } catch (error) {
    console.error("Errore nel recupero del cliente:", error);
    res.status(500).json({
      message: "Errore nel recupero del cliente",
      error: error.message,
    });
  }
};

// @desc    Crea un nuovo cliente
// @route   POST /api/clienti
// @access  Private
exports.createCliente = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verifica se il cliente esiste già (per email o P.IVA)
    const { email, partita_iva } = req.body;
    const clienteEsistente = await Cliente.findOne({
      $or: [
        { email: email, email: { $ne: null } },
        { partita_iva: partita_iva, partita_iva: { $ne: null } },
      ],
    });

    if (clienteEsistente) {
      return res.status(400).json({
        message: "Cliente già esistente con questa email o partita IVA",
      });
    }

    const cliente = await Cliente.create(req.body);

    res.status(201).json(cliente);
  } catch (error) {
    console.error("Errore nella creazione del cliente:", error);
    res.status(500).json({
      message: "Errore nella creazione del cliente",
      error: error.message,
    });
  }
};

// @desc    Aggiorna un cliente
// @route   PUT /api/clienti/:id
// @access  Private
exports.updateCliente = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verifica che email/P.IVA non siano già in uso da altri clienti
    const { email, partita_iva } = req.body;
    if (email || partita_iva) {
      const clienteEsistente = await Cliente.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { email: email, email: { $ne: null } },
          { partita_iva: partita_iva, partita_iva: { $ne: null } },
        ],
      });

      if (clienteEsistente) {
        return res.status(400).json({
          message: "Esiste già un altro cliente con questa email o partita IVA",
        });
      }
    }

    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cliente) {
      return res.status(404).json({ message: "Cliente non trovato" });
    }

    res.json(cliente);
  } catch (error) {
    console.error("Errore nell'aggiornamento del cliente:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento del cliente",
      error: error.message,
    });
  }
};

// @desc    Elimina un cliente
// @route   DELETE /api/clienti/:id
// @access  Private (admin)
exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente non trovato" });
    }

    // Verifica se esistono vendite collegate
    const venditeCount = await Vendita.countDocuments({
      id_cliente: cliente._id,
    });

    if (venditeCount > 0) {
      return res.status(400).json({
        message: "Impossibile eliminare il cliente: esistono vendite collegate",
      });
    }

    await cliente.deleteOne();

    res.json({ message: "Cliente eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del cliente:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione del cliente",
      error: error.message,
    });
  }
};

// @desc    Ottieni le vendite di un cliente
// @route   GET /api/clienti/:id/vendite
// @access  Private
exports.getVenditeCliente = async (req, res) => {
  try {
    const { data_inizio, data_fine, stato, page = 1, limit = 10 } = req.query;

    const filtro = { id_cliente: req.params.id };

    // Filtro per range di date
    if (data_inizio || data_fine) {
      filtro.data = {};
      if (data_inizio) filtro.data.$gte = new Date(data_inizio);
      if (data_fine) filtro.data.$lte = new Date(data_fine);
    }

    // Filtro per stato
    if (stato) filtro.stato = stato;

    const vendite = await Vendita.find(filtro)
      .sort({ data: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Vendita.countDocuments(filtro);

    res.json({
      vendite,
      paginazione: {
        totale: count,
        pagina: parseInt(page),
        pagine: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Errore nel recupero delle vendite del cliente:", error);
    res.status(500).json({
      message: "Errore nel recupero delle vendite del cliente",
      error: error.message,
    });
  }
};

// @desc    Ottieni statistiche di tutti i clienti
// @route   GET /api/clienti/statistiche
// @access  Private
exports.getStatisticheClienti = async (req, res) => {
  try {
    const statistiche = {
      totali: {
        clienti: await Cliente.countDocuments({ attivo: true }),
        per_tipo: await Cliente.aggregate([
          { $match: { attivo: true } },
          { $group: { _id: "$tipo", count: { $sum: 1 } } },
        ]),
      },
      vendite: {
        top_clienti: await Vendita.aggregate([
          { $match: { stato: "pagato" } },
          {
            $group: {
              _id: "$id_cliente",
              cliente_nome: { $first: "$cliente_nome" },
              totale: { $sum: "$totale_netto" },
              vendite: { $sum: 1 },
            },
          },
          { $sort: { totale: -1 } },
          { $limit: 10 },
        ]),
      },
      credito: {
        in_sospeso: await Vendita.aggregate([
          { $match: { stato: { $in: ["da_consegnare", "consegnato"] } } },
          {
            $group: {
              _id: "$id_cliente",
              cliente_nome: { $first: "$cliente_nome" },
              totale: { $sum: "$totale_netto" },
              vendite: { $sum: 1 },
            },
          },
          { $sort: { totale: -1 } },
        ]),
      },
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
