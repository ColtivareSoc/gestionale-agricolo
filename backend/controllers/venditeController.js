const Vendita = require("../models/Vendita");
const Cliente = require("../models/Cliente");
const ProdottoAgricolo = require("../models/ProdottoAgricolo");
const { validationResult } = require("express-validator");

// @desc    Ottieni tutte le vendite
// @route   GET /api/vendite
// @access  Private
exports.getVendite = async (req, res) => {
  try {
    const {
      stato,
      tipo_documento,
      id_cliente,
      data_inizio,
      data_fine,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Costruisci l'oggetto filtro
    const filtro = {};
    if (stato) filtro.stato = stato;
    if (tipo_documento) filtro.tipo_documento = tipo_documento;
    if (id_cliente) filtro.id_cliente = id_cliente;

    // Filtro per range di date
    if (data_inizio || data_fine) {
      filtro.data = {};
      if (data_inizio) filtro.data.$gte = new Date(data_inizio);
      if (data_fine) filtro.data.$lte = new Date(data_fine);
    }

    // Filtro per search
    if (search) {
      filtro.$or = [
        { numero_documento: { $regex: search, $options: "i" } },
        { cliente_nome: { $regex: search, $options: "i" } },
      ];
    }

    // Query con paginazione
    const vendite = await Vendita.find(filtro)
      .populate("id_cliente", "nome tipo email")
      .populate("righe.id_prodotto", "nome varieta categoria")
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
    console.error("Errore nel recupero delle vendite:", error);
    res.status(500).json({
      message: "Errore nel recupero delle vendite",
      error: error.message,
    });
  }
};

// @desc    Ottieni una singola vendita
// @route   GET /api/vendite/:id
// @access  Private
exports.getVendita = async (req, res) => {
  try {
    const vendita = await Vendita.findById(req.params.id)
      .populate("id_cliente", "nome tipo indirizzo email telefono")
      .populate("righe.id_prodotto", "nome varieta categoria prezzoMedio")
      .populate("bins_associati", "codice_identificativo prodotto_nome")
      .populate("utente_creazione utente_ultima_modifica", "nome cognome");

    if (!vendita) {
      return res.status(404).json({ message: "Vendita non trovata" });
    }

    res.json(vendita);
  } catch (error) {
    console.error("Errore nel recupero della vendita:", error);
    res.status(500).json({
      message: "Errore nel recupero della vendita",
      error: error.message,
    });
  }
};

// @desc    Crea una nuova vendita
// @route   POST /api/vendite
// @access  Private
exports.createVendita = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id_cliente, righe } = req.body;

    // Verifica che il cliente esista e ottieni il nome
    const cliente = await Cliente.findById(id_cliente);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente non trovato" });
    }

    // Verifica che i prodotti esistano e ottieni i loro nomi
    for (let riga of righe) {
      const prodotto = await ProdottoAgricolo.findById(riga.id_prodotto);
      if (!prodotto) {
        return res.status(404).json({
          message: `Prodotto con ID ${riga.id_prodotto} non trovato`,
        });
      }
      riga.prodotto_nome = `${prodotto.nome} ${prodotto.varieta}`;
      riga.unita_misura = prodotto.unitàMisura;
    }

    // Genera numero documento se non fornito
    let numero_documento = req.body.numero_documento;
    if (!numero_documento) {
      numero_documento = await generaNumeroDocumento(req.body.tipo_documento);
    }

    // Crea la vendita
    const vendita = await Vendita.create({
      ...req.body,
      numero_documento,
      cliente_nome: cliente.nome,
      utente_creazione: req.user.id,
      utente_ultima_modifica: req.user.id,
    });

    // Aggiorna le statistiche del cliente
    if (vendita.stato === "pagato") {
      await cliente.aggiornaUltimaVendita(vendita.totale_netto);
    }

    res.status(201).json(vendita);
  } catch (error) {
    console.error("Errore nella creazione della vendita:", error);
    res.status(500).json({
      message: "Errore nella creazione della vendita",
      error: error.message,
    });
  }
};

// @desc    Aggiorna una vendita
// @route   PUT /api/vendite/:id
// @access  Private
exports.updateVendita = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendita = await Vendita.findById(req.params.id);
    if (!vendita) {
      return res.status(404).json({ message: "Vendita non trovata" });
    }

    // Se la vendita è già stata pagata, non può essere modificata
    if (vendita.stato === "pagato" && req.body.stato !== "pagato") {
      return res.status(400).json({
        message: "Non è possibile modificare una vendita già pagata",
      });
    }

    // Aggiorna l'utente ultima modifica
    req.body.utente_ultima_modifica = req.user.id;

    // Se cambia lo stato da/a pagato, aggiorna le statistiche del cliente
    if (vendita.stato !== req.body.stato) {
      const cliente = await Cliente.findById(vendita.id_cliente);
      if (cliente) {
        if (vendita.stato !== "pagato" && req.body.stato === "pagato") {
          await cliente.aggiornaUltimaVendita(vendita.totale_netto);
        }
      }
    }

    const venditaAggiornata = await Vendita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(venditaAggiornata);
  } catch (error) {
    console.error("Errore nell'aggiornamento della vendita:", error);
    res.status(500).json({
      message: "Errore nell'aggiornamento della vendita",
      error: error.message,
    });
  }
};

// @desc    Elimina una vendita
// @route   DELETE /api/vendite/:id
// @access  Private (admin)
exports.deleteVendita = async (req, res) => {
  try {
    const vendita = await Vendita.findById(req.params.id);

    if (!vendita) {
      return res.status(404).json({ message: "Vendita non trovata" });
    }

    // Non permettere l'eliminazione di vendite pagate
    if (vendita.stato === "pagato") {
      return res.status(400).json({
        message: "Non è possibile eliminare una vendita già pagata",
      });
    }

    await vendita.deleteOne();

    res.json({ message: "Vendita eliminata con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione della vendita:", error);
    res.status(500).json({
      message: "Errore nell'eliminazione della vendita",
      error: error.message,
    });
  }
};

// @desc    Cambia lo stato di una vendita
// @route   PATCH /api/vendite/:id/stato
// @access  Private
exports.changeStatoVendita = async (req, res) => {
  try {
    const { stato } = req.body;

    if (!stato) {
      return res.status(400).json({ message: "Lo stato è obbligatorio" });
    }

    const vendita = await Vendita.findById(req.params.id);
    if (!vendita) {
      return res.status(404).json({ message: "Vendita non trovata" });
    }

    // Validazione dei cambiamenti di stato
    if (vendita.stato === "pagato" && stato !== "pagato") {
      return res.status(400).json({
        message: "Non è possibile cambiare stato da pagato a un altro stato",
      });
    }

    vendita.stato = stato;
    vendita.utente_ultima_modifica = req.user.id;

    await vendita.save();

    res.json(vendita);
  } catch (error) {
    console.error("Errore nel cambio stato della vendita:", error);
    res.status(500).json({
      message: "Errore nel cambio stato della vendita",
      error: error.message,
    });
  }
};

// Funzione helper per generare il numero documento
const generaNumeroDocumento = async (tipo) => {
  const anno = new Date().getFullYear();
  let prefix = "";

  switch (tipo) {
    case "fattura":
      prefix = "FT";
      break;
    case "ddt":
      prefix = "DDT";
      break;
    case "preventivo":
      prefix = "PV";
      break;
    default:
      prefix = "DOC";
  }

  // Trova l'ultimo documento del tipo nell'anno corrente
  const ultimoDoc = await Vendita.findOne({
    tipo_documento: tipo,
    data: {
      $gte: new Date(anno, 0, 1),
      $lt: new Date(anno + 1, 0, 1),
    },
  })
    .sort({ data: -1 })
    .select("numero_documento");

  let nuovoNumero = 1;
  if (ultimoDoc && ultimoDoc.numero_documento) {
    const matches = ultimoDoc.numero_documento.match(/(\d+)$/);
    if (matches) {
      nuovoNumero = parseInt(matches[1]) + 1;
    }
  }

  return `${prefix}-${anno}-${nuovoNumero.toString().padStart(3, "0")}`;
};

// @desc    Ottieni statistiche vendite
// @route   GET /api/vendite/statistiche
// @access  Private
exports.getStatisticheVendite = async (req, res) => {
  try {
    const { data_inizio, data_fine } = req.query;

    const filtro = {};
    if (data_inizio || data_fine) {
      filtro.data = {};
      if (data_inizio) filtro.data.$gte = new Date(data_inizio);
      if (data_fine) filtro.data.$lte = new Date(data_fine);
    }

    const statistiche = {
      totali: {
        vendite: await Vendita.countDocuments(filtro),
        importo: await Vendita.aggregate([
          { $match: filtro },
          { $group: { _id: null, totale: { $sum: "$totale_netto" } } },
        ]).then((result) => result[0]?.totale || 0),
      },
      per_stato: await Vendita.aggregate([
        { $match: filtro },
        { $group: { _id: "$stato", count: { $sum: 1 } } },
      ]),
      per_tipo_documento: await Vendita.aggregate([
        { $match: filtro },
        { $group: { _id: "$tipo_documento", count: { $sum: 1 } } },
      ]),
      clienti_top: await Vendita.aggregate([
        { $match: filtro },
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
