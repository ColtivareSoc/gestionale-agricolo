import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Collapse,
  Divider,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

// Dati di esempio per i clienti
const clientiMock = [
  { id: 1, nome: "Cooperativa Frutta Bio", tipo: "cooperativa", indirizzo: "Via Roma 123, Trento" },
  { id: 2, nome: "Supermercato Valle", tipo: "gdo", indirizzo: "Via Verdi 45, Milano" },
  { id: 3, nome: "Mercato Ortofrutticolo", tipo: "mercato", indirizzo: "Via dei Mercati 67, Bologna" },
  { id: 4, nome: "Esportatori Uniti", tipo: "esportatore", indirizzo: "Via Export 89, Verona" },
];

// Dati di esempio per i prodotti
const prodottiMock = [
  { id: 1, codice: "MELE001", nome: "Mele", varieta: "Golden Delicious", prezzo_medio: 1.2 },
  { id: 2, codice: "PERE001", nome: "Pere", varieta: "Abate", prezzo_medio: 1.5 },
  { id: 3, codice: "PESC001", nome: "Pesche", varieta: "Gialla", prezzo_medio: 1.8 },
  { id: 4, codice: "PATA001", nome: "Patate", varieta: "Bianca", prezzo_medio: 0.8 },
];

// Dati di esempio per gli imballaggi
const imballaggiMock = [
  { id: 1, codice: "PLAT001", descrizione: "Plateau 5kg", peso_tara: 0.2 },
  { id: 2, codice: "CASS002", descrizione: "Cassetta 10kg", peso_tara: 0.5 },
  { id: 3, codice: "CART003", descrizione: "Cartone 60x40", peso_tara: 0.3 },
  { id: 4, codice: "BINS001", descrizione: "BIN 300kg", peso_tara: 20 },
];

// Dati di esempio per le vendite
const venditeMock = [
  {
    id: 1,
    numero_documento: "FT-2024-001",
    tipo_documento: "fattura",
    data: "2024-04-15",
    id_cliente: 1,
    cliente_nome: "Cooperativa Frutta Bio",
    stato: "consegnato",
    pagamento: "bonifico_30gg",
    data_consegna: "2024-04-18",
    note: "Prima consegna stagionale",
    totale_netto: 3580,
    righe: [
      {
        id: 1,
        id_prodotto: 1,
        prodotto_nome: "Mele Golden Delicious",
        quantita: 2000,
        unita_misura: "kg",
        prezzo_unitario: 1.2,
        importo: 2400,
        id_imballaggio: 4,
        imballaggio_descrizione: "BIN 300kg",
        numero_pezzi: 7,
      },
      {
        id: 2,
        id_prodotto: 2,
        prodotto_nome: "Pere Abate",
        quantita: 800,
        unita_misura: "kg",
        prezzo_unitario: 1.5,
        importo: 1200,
        id_imballaggio: 4,
        imballaggio_descrizione: "BIN 300kg",
        numero_pezzi: 3,
      },
    ],
  },
  {
    id: 2,
    numero_documento: "DDT-2024-001",
    tipo_documento: "ddt",
    data: "2024-04-10",
    id_cliente: 2,
    cliente_nome: "Supermercato Valle",
    stato: "pagato",
    pagamento: "rimessa_diretta",
    data_consegna: "2024-04-10",
    note: "Consegna diretta",
    totale_netto: 700,
    righe: [
      {
        id: 3,
        id_prodotto: 1,
        prodotto_nome: "Mele Golden Delicious",
        quantita: 500,
        unita_misura: "kg",
        prezzo_unitario: 1.4,
        importo: 700,
        id_imballaggio: 2,
        imballaggio_descrizione: "Cassetta 10kg",
        numero_pezzi: 50,
      },
    ],
  },
  {
    id: 3,
    numero_documento: "PV-2024-001",
    tipo_documento: "preventivo",
    data: "2024-04-20",
    id_cliente: 3,
    cliente_nome: "Mercato Ortofrutticolo",
    stato: "da_confermare",
    pagamento: "bonifico_30gg",
    data_consegna: "",
    note: "In attesa di conferma",
    totale_netto: 1620,
    righe: [
      {
        id: 4,
        id_prodotto: 3,
        prodotto_nome: "Pesche Gialla",
        quantita: 900,
        unita_misura: "kg",
        prezzo_unitario: 1.8,
        importo: 1620,
        id_imballaggio: 3,
        imballaggio_descrizione: "Cartone 60x40",
        numero_pezzi: 90,
      },
    ],
  },
];

const GestioneVendite = () => {
  const [vendite, setVendite] = useState(venditeMock);
  const [clienti] = useState(clientiMock);
  const [prodotti] = useState(prodottiMock);
  const [imballaggi] = useState(imballaggiMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [expandedVendita, setExpandedVendita] = useState(null);
  const [currentVendita, setCurrentVendita] = useState({
    tipo_documento: "fattura",
    data: new Date().toISOString().split("T")[0],
    id_cliente: "",
    stato: "da_consegnare",
    pagamento: "bonifico_30gg",
    data_consegna: "",
    note: "",
    righe: [],
  });
  const [currentRiga, setCurrentRiga] = useState({
    id_prodotto: "",
    quantita: "",
    unita_misura: "kg",
    prezzo_unitario: "",
    id_imballaggio: "",
    numero_pezzi: "",
  });
  const [isRigaDialogOpen, setIsRigaDialogOpen] = useState(false);
  const [isEditRiga, setIsEditRiga] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [venditaSelezionata, setVenditaSelezionata] = useState(null);

  // Stati dei documenti
  const statiDocumento = [
    { value: "da_consegnare", label: "Da Consegnare", color: "warning" },
    { value: "consegnato", label: "Consegnato", color: "info" },
    { value: "pagato", label: "Pagato", color: "success" },
    { value: "annullato", label: "Annullato", color: "error" },
    { value: "da_confermare", label: "Da Confermare", color: "default" },
  ];

  // Tipi di pagamento
  const tipiPagamento = [
    { value: "rimessa_diretta", label: "Rimessa Diretta" },
    { value: "bonifico_30gg", label: "Bonifico 30gg" },
    { value: "bonifico_60gg", label: "Bonifico 60gg" },
    { value: "ricevuta_bancaria", label: "Ricevuta Bancaria" },
  ];

  // Gestione tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Espandi/collassa vendita
  const handleToggleExpand = (id) => {
    setExpandedVendita(expandedVendita === id ? null : id);
  };

  // Apertura dialogo creazione/modifica vendita
  const handleOpenDialog = (vendita = null) => {
    if (vendita) {
      setCurrentVendita(vendita);
      setIsEdit(true);
    } else {
      // Genera numero documento
      const numDoc = generaNumeroDocumento("fattura");
      setCurrentVendita({
        tipo_documento: "fattura",
        numero_documento: numDoc,
        data: new Date().toISOString().split("T")[0],
        id_cliente: "",
        stato: "da_consegnare",
        pagamento: "bonifico_30gg",
        data_consegna: "",
        note: "",
        righe: [],
      });
      setIsEdit(false);
    }
    setDialogOpen(true);
  };

  // Chiusura dialogo vendita
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Gestione input form vendita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "tipo_documento") {
      // Se cambia il tipo documento, aggiorna anche il numero documento
      const numDoc = generaNumeroDocumento(value);
      setCurrentVendita({
        ...currentVendita,
        [name]: value,
        numero_documento: numDoc,
      });
    } else {
      setCurrentVendita({
        ...currentVendita,
        [name]: value,
      });
    }
  };

  // Apertura dialogo dettaglio vendita
  const handleOpenDetailDialog = (vendita) => {
    setVenditaSelezionata(vendita);
    setDialogDetailOpen(true);
  };

  // Chiusura dialogo dettaglio
  const handleCloseDetailDialog = () => {
    setDialogDetailOpen(false);
  };

  // Apertura dialogo aggiunta/modifica riga
  const handleOpenRigaDialog = (riga = null) => {
    if (riga) {
      setCurrentRiga(riga);
      setIsEditRiga(true);
    } else {
      setCurrentRiga({
        id_prodotto: "",
        quantita: "",
        unita_misura: "kg",
        prezzo_unitario: "",
        id_imballaggio: "",
        numero_pezzi: "",
      });
      setIsEditRiga(false);
    }
    setIsRigaDialogOpen(true);
  };

  // Chiusura dialogo riga
  const handleCloseRigaDialog = () => {
    setIsRigaDialogOpen(false);
  };

  // Gestione input form riga
  const handleRigaInputChange = (e) => {
    const { name, value } = e.target;
    
    // Se cambia il prodotto, aggiorna anche il prezzo unitario
    if (name === "id_prodotto") {
      const prodottoSelezionato = prodotti.find(p => p.id === parseInt(value));
      setCurrentRiga({
        ...currentRiga,
        [name]: value,
        prezzo_unitario: prodottoSelezionato ? prodottoSelezionato.prezzo_medio : "",
      });
    } else {
      setCurrentRiga({
        ...currentRiga,
        [name]: name === "quantita" || name === "prezzo_unitario" || name === "numero_pezzi" 
          ? parseFloat(value) || "" 
          : value,
      });
    }
  };

  // Salvataggio riga
  const handleSaveRiga = () => {
    // Trova prodotto e imballaggio per avere i nomi
    const prodottoSelezionato = prodotti.find(p => p.id === parseInt(currentRiga.id_prodotto));
    const imballaggioSelezionato = imballaggi.find(i => i.id === parseInt(currentRiga.id_imballaggio));
    
    // Calcola importo
    const importo = parseFloat(currentRiga.quantita) * parseFloat(currentRiga.prezzo_unitario);
    
    const nuovaRiga = {
      ...currentRiga,
      id: isEditRiga 
        ? currentRiga.id 
        : Math.max(0, ...currentVendita.righe.map(r => r.id)) + 1,
      prodotto_nome: prodottoSelezionato 
        ? `${prodottoSelezionato.nome} ${prodottoSelezionato.varieta}` 
        : "N/D",
      imballaggio_descrizione: imballaggioSelezionato 
        ? imballaggioSelezionato.descrizione 
        : "N/D",
      importo: importo,
    };

    if (isEditRiga) {
      // Modifica riga esistente
      const righeAggiornate = currentVendita.righe.map(r => 
        r.id === nuovaRiga.id ? nuovaRiga : r
      );
      setCurrentVendita({
        ...currentVendita,
        righe: righeAggiornate,
      });
    } else {
      // Aggiungi nuova riga
      setCurrentVendita({
        ...currentVendita,
        righe: [...currentVendita.righe, nuovaRiga],
      });
    }

    handleCloseRigaDialog();
  };

  // Rimozione riga
  const handleRemoveRiga = (id) => {
    const righeAggiornate = currentVendita.righe.filter(r => r.id !== id);
    setCurrentVendita({
      ...currentVendita,
      righe: righeAggiornate,
    });
  };

  // Salvataggio vendita
  const handleSaveVendita = () => {
    // Calcola totale
    const totaleNetto = currentVendita.righe.reduce(
      (acc, riga) => acc + riga.importo, 0
    );
    
    // Trova nome cliente
    const clienteSelezionato = clienti.find(c => c.id === parseInt(currentVendita.id_cliente));

    const venditaCompleta = {
      ...currentVendita,
      totale_netto: totaleNetto,
      cliente_nome: clienteSelezionato ? clienteSelezionato.nome : "N/D",
    };

    if (isEdit) {
      // Aggiorna vendita esistente
      const venditeAggiornate = vendite.map(v => 
        v.id === venditaCompleta.id ? venditaCompleta : v
      );
      setVendite(venditeAggiornate);
    } else {
      // Crea nuova vendita
      const nuovaVendita = {
        ...venditaCompleta,
        id: Math.max(0, ...vendite.map(v => v.id)) + 1,
      };
      setVendite([...vendite, nuovaVendita]);
    }

    handleCloseDialog();
  };

  // Eliminazione vendita
  const handleDeleteVendita = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo documento?")) {
      setVendite(vendite.filter(v => v.id !== id));
    }
  };

  // Cambio stato vendita
  const handleChangeStato = (id, nuovoStato) => {
    const venditeAggiornate = vendite.map(v => {
      if (v.id === id) {
        // Se lo stato è "consegnato", imposta la data di consegna se non è già presente
        let dataConsegna = v.data_consegna;
        if (nuovoStato === "consegnato" && !dataConsegna) {
          dataConsegna = new Date().toISOString().split("T")[0];
        }
        
        return {
          ...v,
          stato: nuovoStato,
          data_consegna: dataConsegna,
        };
      }
      return v;
    });
    
    setVendite(venditeAggiornate);
  };

  // Genera numero documento
  const generaNumeroDocumento = (tipo) => {
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
    
    // Filtra per tipo e ottieni l'ultimo numero
    const documentiStessoTipo = vendite.filter(v => v.tipo_documento === tipo);
    let ultimoNumero = 0;
    
    if (documentiStessoTipo.length > 0) {
      documentiStessoTipo.forEach(doc => {
        if (doc.numero_documento) {
          const matches = doc.numero_documento.match(/\d+$/);
          if (matches && matches[0]) {
            const num = parseInt(matches[0]);
            if (num > ultimoNumero) ultimoNumero = num;
          }
        }
      });
    }
    
    // Incrementa di 1 e formatta con 3 cifre
    const nuovoNumero = (ultimoNumero + 1).toString().padStart(3, "0");
    return `${prefix}-${anno}-${nuovoNumero}`;
  };

  // Filtraggio vendite
  const filteredVendite = vendite.filter(vendita => {
    // Filtro per ricerca
    if (searchTerm && 
        !vendita.numero_documento.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !vendita.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro per tab/stato
    if (tabValue === 1 && vendita.stato !== "da_consegnare") return false;
    if (tabValue === 2 && vendita.stato !== "consegnato") return false;
    if (tabValue === 3 && vendita.stato !== "pagato") return false;
    if (tabValue === 4 && vendita.tipo_documento !== "preventivo") return false;
    
    return true;
  });

  // Renderizza chip stato
  const renderStatoChip = (stato) => {
    const statoObj = statiDocumento.find(s => s.value === stato);
    return (
      <Chip
        label={statoObj ? statoObj.label : stato}
        color={statoObj ? statoObj.color : "default"}
        size="small"
      />
    );
  };

  // Renderizza tipo documento
  const renderTipoDocumento = (tipo) => {
    switch (tipo) {
      case "fattura":
        return "Fattura";
      case "ddt":
        return "DDT";
      case "preventivo":
        return "Preventivo";
      default:
        return tipo;
    }
  };

  // Converti tipo pagamento in testo leggibile
  const getTipoPagamentoLabel = (value) => {
    const tipo = tipiPagamento.find(t => t.value === value);
    return tipo ? tipo.label : value;
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Gestione Vendite
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Documento
        </Button>
      </Box>

      {/* Ricerca e Filtri */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cerca per numero documento o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tutti i Documenti" />
          <Tab label="Da Consegnare" />
          <Tab label="Consegnati" />
          <Tab label="Pagati" />
          <Tab label="Preventivi" />
        </Tabs>
      </Box>

      {/* Tabella Vendite */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numero</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell align="right">Totale (€)</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendite.length > 0 ? (
              filteredVendite.map((vendita) => (
                <React.Fragment key={vendita.id}>
                  <TableRow>
                    <TableCell>{vendita.numero_documento}</TableCell>
                    <TableCell>{renderTipoDocumento(vendita.tipo_documento)}</TableCell>
                    <TableCell>{vendita.data}</TableCell>
                    <TableCell>{vendita.cliente_nome}</TableCell>
                    <TableCell>{renderStatoChip(vendita.stato)}</TableCell>
                    <TableCell align="right">
                      {vendita.totale_netto.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleExpand(vendita.id)}
                      >
                        {expandedVendita === vendita.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDetailDialog(vendita)}
                      >
                        <AssignmentIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(vendita)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteVendita(vendita.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedVendita === vendita.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="subtitle2" gutterBottom component="div">
                            Dettaglio Prodotti
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Prodotto</TableCell>
                                <TableCell align="right">Quantità</TableCell>
                                <TableCell>Imballaggio</TableCell>
                                <TableCell align="right">Prezzo (€)</TableCell>
                                <TableCell align="right">Importo (€)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {vendita.righe.map((riga) => (
                                <TableRow key={riga.id}>
                                  <TableCell>{riga.prodotto_nome}</TableCell>
                                  <TableCell align="right">
                                    {riga.quantita} {riga.unita_misura}
                                  </TableCell>
                                  <TableCell>
                                    {riga.imballaggio_descrizione} ({riga.numero_pezzi} pz)
                                  </TableCell>
                                  <TableCell align="right">
                                    {riga.prezzo_unitario.toLocaleString("it-IT", {
                                      style: "currency",
                                      currency: "EUR",
                                    })}
                                  </TableCell>
                                  <TableCell align="right">
                                    {riga.importo.toLocaleString("it-IT", {
                                      style: "currency",
                                      currency: "EUR",
                                    })}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  align="right"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Totale:
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                  {vendita.totale_netto.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "EUR",
                                  })}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessun documento trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per visualizzazione dettagli */}
      <Dialog
        open={dialogDetailOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        {venditaSelezionata && (
          <>
            <DialogTitle>
              {renderTipoDocumento(venditaSelezionata.tipo_documento)} {venditaSelezionata.numero_documento}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Cliente:</Typography>
                  <Typography variant="body1">{venditaSelezionata.cliente_nome}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Data:</Typography>
                  <Typography variant="body1">{venditaSelezionata.data}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Stato:</Typography>
                  <Box sx={{ mt: 0.5 }}>{renderStatoChip(venditaSelezionata.stato)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Pagamento:</Typography>
                  <Typography variant="body1">
                    {getTipoPagamentoLabel(venditaSelezionata.pagamento)}
                  </Typography>
                </Grid>
                {venditaSelezionata.data_consegna && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Data Consegna:</Typography>
                    <Typography variant="body1">{venditaSelezionata.data_consegna}</Typography>
                  </Grid>
                )}
                {venditaSelezionata.note && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Note:</Typography>
                    <Typography variant="body1">{venditaSelezionata.note}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Prodotti
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Prodotto</TableCell>
                          <TableCell align="right">Quantità</TableCell>
                          <TableCell>Imballaggio</TableCell>
                          <TableCell align="right">Prezzo (€)</TableCell>
                          <TableCell align="right">Importo (€)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {venditaSelezionata.righe.map((riga) => (
                          <TableRow key={riga.id}>
                            <TableCell>{riga.prodotto_nome}</TableCell>
                            <TableCell align="right">
                              {riga.quantita} {riga.unita_misura}
                            </TableCell>
                            <TableCell>
                              {riga.imballaggio_descrizione} ({riga.numero_pezzi} pz)
                            </TableCell>
                            <TableCell align="right">
                              {riga.prezzo_unitario.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </TableCell>
                            <TableCell align="right">
                              {riga.importo.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="right"
                            sx={{ fontWeight: "bold" }}
                          >
                            Totale:
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {venditaSelezionata.totale_netto.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Azioni rapide per cambiare lo stato */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Cambia Stato
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {statiDocumento.map((stato) => (
                      <Button
                        key={stato.value}
                        variant={venditaSelezionata.stato === stato.value ? "contained" : "outlined"}
                        color={stato.color}
                        size="small"
                        onClick={() => handleChangeStato(venditaSelezionata.id, stato.value)}
                        disabled={venditaSelezionata.stato === stato.value}
                        startIcon={
                          stato.value === "da_consegnare" ? <LocalShippingIcon /> :
                          stato.value === "consegnato" ? <CheckCircleIcon /> :
                          stato.value === "pagato" ? <CheckCircleIcon /> :
                          stato.value === "annullato" ? <CancelIcon /> :
                          <PendingIcon />
                        }
                      >
                        {stato.label}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Chiudi</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCloseDetailDialog();
                  handleOpenDialog(venditaSelezionata);
                }}
              >
                Modifica
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog per creazione/modifica vendita */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Modifica Documento" : "Nuovo Documento"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Tipo Documento</InputLabel>
                <Select
                  name="tipo_documento"
                  value={currentVendita.tipo_documento}
                  label="Tipo Documento"
                  onChange={handleInputChange}
                  disabled={isEdit} // Non permettere di cambiare il tipo se è in modifica
                >
                  <MenuItem value="fattura">Fattura</MenuItem>
                  <MenuItem value="ddt">DDT</MenuItem>
                  <MenuItem value="preventivo">Preventivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="numero_documento"
                label="Numero Documento"
                value={currentVendita.numero_documento || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="data"
                label="Data"
                type="date"
                value={currentVendita.data}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                  name="id_cliente"
                  value={currentVendita.id_cliente}
                  label="Cliente"
                  onChange={handleInputChange}
                >
                  {clienti.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Pagamento</InputLabel>
                <Select
                  name="pagamento"
                  value={currentVendita.pagamento}
                  label="Pagamento"
                  onChange={handleInputChange}
                >
                  {tipiPagamento.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Stato</InputLabel>
                <Select
                  name="stato"
                  value={currentVendita.stato}
                  label="Stato"
                  onChange={handleInputChange}
                >
                  {statiDocumento.map((stato) => (
                    <MenuItem key={stato.value} value={stato.value}>
                      {stato.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data_consegna"
                label="Data Consegna"
                type="date"
                value={currentVendita.data_consegna || ""}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note"
                value={currentVendita.note || ""}
                onChange={handleInputChange}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>

            {/* Sezione righe documento */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1">
                  Prodotti
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenRigaDialog()}
                  size="small"
                >
                  Aggiungi Prodotto
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Prodotto</TableCell>
                      <TableCell align="right">Quantità</TableCell>
                      <TableCell>Imballaggio</TableCell>
                      <TableCell align="right">Prezzo (€)</TableCell>
                      <TableCell align="right">Importo (€)</TableCell>
                      <TableCell align="center">Azioni</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentVendita.righe.length > 0 ? (
                      currentVendita.righe.map((riga) => (
                        <TableRow key={riga.id}>
                          <TableCell>{riga.prodotto_nome || "N/D"}</TableCell>
                          <TableCell align="right">
                            {riga.quantita} {riga.unita_misura}
                          </TableCell>
                          <TableCell>
                            {riga.imballaggio_descrizione || "N/D"} 
                            {riga.numero_pezzi ? ` (${riga.numero_pezzi} pz)` : ""}
                          </TableCell>
                          <TableCell align="right">
                            {riga.prezzo_unitario
                              ? riga.prezzo_unitario.toLocaleString("it-IT", {
                                  style: "currency",
                                  currency: "EUR",
                                })
                              : "N/D"}
                          </TableCell>
                          <TableCell align="right">
                            {riga.importo
                              ? riga.importo.toLocaleString("it-IT", {
                                  style: "currency",
                                  currency: "EUR",
                                })
                              : "N/D"}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenRigaDialog(riga)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveRiga(riga.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nessun prodotto aggiunto
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Totale:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {currentVendita.righe
                          .reduce((acc, riga) => acc + (riga.importo || 0), 0)
                          .toLocaleString("it-IT", {
                            style: "currency",
                            currency: "EUR",
                          })}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveVendita}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !currentVendita.data ||
              !currentVendita.id_cliente ||
              currentVendita.righe.length === 0
            }
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per aggiunta/modifica riga */}
      <Dialog
        open={isRigaDialogOpen}
        onClose={handleCloseRigaDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditRiga ? "Modifica Prodotto" : "Aggiungi Prodotto"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Prodotto</InputLabel>
                <Select
                  name="id_prodotto"
                  value={currentRiga.id_prodotto}
                  label="Prodotto"
                  onChange={handleRigaInputChange}
                >
                  {prodotti.map((prodotto) => (
                    <MenuItem key={prodotto.id} value={prodotto.id}>
                      {prodotto.nome} {prodotto.varieta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantita"
                label="Quantità"
                type="number"
                value={currentRiga.quantita}
                onChange={handleRigaInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: (
                    <InputAdornment position="end">
                      {currentRiga.unita_misura}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Imballaggio</InputLabel>
                <Select
                  name="id_imballaggio"
                  value={currentRiga.id_imballaggio}
                  label="Imballaggio"
                  onChange={handleRigaInputChange}
                >
                  {imballaggi.map((imballaggio) => (
                    <MenuItem key={imballaggio.id} value={imballaggio.id}>
                      {imballaggio.descrizione}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="numero_pezzi"
                label="Numero Pezzi"
                type="number"
                value={currentRiga.numero_pezzi}
                onChange={handleRigaInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0, step: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prezzo_unitario"
                label="Prezzo Unitario (€)"
                type="number"
                value={currentRiga.prezzo_unitario}
                onChange={handleRigaInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Importo Totale (€)"
                type="number"
                value={
                  currentRiga.quantita && currentRiga.prezzo_unitario
                    ? (
                        parseFloat(currentRiga.quantita) *
                        parseFloat(currentRiga.prezzo_unitario)
                      ).toFixed(2)
                    : ""
                }
                fullWidth
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRigaDialog} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveRiga}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !currentRiga.id_prodotto ||
              !currentRiga.quantita ||
              !currentRiga.id_imballaggio ||
              !currentRiga.numero_pezzi ||
              !currentRiga.prezzo_unitario
            }
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestioneVendite;