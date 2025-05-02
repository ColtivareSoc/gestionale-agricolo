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
  Tabs,
  Tab,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  AddBox as AddBoxIcon,
} from "@mui/icons-material";

// Dati di esempio per i BINS
const binsMock = [
  {
    id: 1,
    codice_identificativo: "BIN001",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    stato: "vuoto",
    id_prodotto: null,
    prodotto_nome: null,
    id_origine: null,
    origine_tipo: null,
    origine_nome: null,
    anno_raccolta: null,
    peso_netto_kg: null,
    localizzazione: "Magazzino A",
    data_acquisto: "2023-01-15",
  },
  {
    id: 2,
    codice_identificativo: "BIN002",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    stato: "pieno",
    id_prodotto: 1,
    prodotto_nome: "Mele Golden",
    id_origine: 1,
    origine_tipo: "appezzamento",
    origine_nome: "Campo Grande",
    anno_raccolta: 2024,
    peso_netto_kg: 260,
    localizzazione: "Cella frigorifera 2",
    data_acquisto: "2023-01-15",
  },
  {
    id: 3,
    codice_identificativo: "BIN003",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    stato: "in_lavorazione",
    id_prodotto: 1,
    prodotto_nome: "Mele Golden",
    id_origine: 1,
    origine_tipo: "appezzamento",
    origine_nome: "Campo Grande",
    anno_raccolta: 2024,
    peso_netto_kg: 265,
    localizzazione: "Linea 1",
    data_acquisto: "2023-01-15",
  },
  {
    id: 4,
    codice_identificativo: "BIN004",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    stato: "pieno",
    id_prodotto: 2,
    prodotto_nome: "Pere Abate",
    id_origine: 5,
    origine_tipo: "fornitore",
    origine_nome: "Azienda Agricola Rossi",
    anno_raccolta: 2024,
    peso_netto_kg: 270,
    localizzazione: "Cella frigorifera 1",
    data_acquisto: "2023-01-15",
  },
];

// Dati di esempio per i prodotti
const prodottiMock = [
  { id: 1, nome: "Mele Golden" },
  { id: 2, nome: "Pere Abate" },
  { id: 3, nome: "Pesche" },
  { id: 4, nome: "Nettarine" },
];

// Dati di esempio per gli appezzamenti (origine)
const appezzamentiMock = [
  { id: 1, nome: "Campo Grande" },
  { id: 2, nome: "Vigna Nord" },
  { id: 3, nome: "Frutteto Est" },
];

// Dati di esempio per i fornitori (origine)
const fornitoriMock = [
  { id: 5, nome: "Azienda Agricola Rossi" },
  { id: 6, nome: "Cooperativa Frutta Bella" },
  { id: 7, nome: "Agricola dei Colli" },
];

const GestioneBins = () => {
  const [bins, setBins] = useState(binsMock);
  const [prodotti] = useState(prodottiMock);
  const [appezzamenti] = useState(appezzamentiMock);
  const [fornitori] = useState(fornitoriMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCaricoOpen, setDialogCaricoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [currentBin, setCurrentBin] = useState({
    codice_identificativo: "",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    stato: "vuoto",
    localizzazione: "",
    data_acquisto: new Date().toISOString().split("T")[0],
  });
  const [currentCarico, setCurrentCarico] = useState({
    id_bin: "",
    id_prodotto: "",
    origine_tipo: "",
    id_origine: "",
    anno_raccolta: new Date().getFullYear(),
    peso_netto_kg: "",
    localizzazione: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchData, setBatchData] = useState({
    prefisso: "BIN",
    numero_iniziale: 1,
    quantita: 10,
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    localizzazione: "",
    data_acquisto: new Date().toISOString().split("T")[0],
  });

  // Gestione tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestione dialog bin singolo
  const handleOpenDialog = (bin = null) => {
    if (bin) {
      setCurrentBin(bin);
      setIsEdit(true);
    } else {
      setCurrentBin({
        codice_identificativo: "",
        tipo: "Plastica",
        capacita_kg: 300,
        tara_kg: 20,
        stato: "vuoto",
        localizzazione: "",
        data_acquisto: new Date().toISOString().split("T")[0],
      });
      setIsEdit(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBin({
      ...currentBin,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (isEdit) {
      // Update existing bin
      const updatedBins = bins.map((item) =>
        item.id === currentBin.id ? currentBin : item
      );
      setBins(updatedBins);
    } else {
      // Add new bin
      const newBin = {
        ...currentBin,
        id: Math.max(...bins.map((b) => b.id), 0) + 1,
        id_prodotto: null,
        prodotto_nome: null,
        id_origine: null,
        origine_tipo: null,
        origine_nome: null,
        anno_raccolta: null,
        peso_netto_kg: null,
      };
      setBins([...bins, newBin]);
    }
    handleCloseDialog();
  };

  // Gestione creazione multipla BINS
  const handleOpenBatchDialog = () => {
    setBatchDialogOpen(true);
  };

  const handleCloseBatchDialog = () => {
    setBatchDialogOpen(false);
  };

  const handleBatchInputChange = (e) => {
    const { name, value } = e.target;
    setBatchData({
      ...batchData,
      [name]: value,
    });
  };

  const handleSaveBatch = () => {
    const newBins = [];
    const startId = Math.max(...bins.map((b) => b.id), 0) + 1;

    for (let i = 0; i < parseInt(batchData.quantita); i++) {
      // Genera numero con leading zeros
      const numero = (parseInt(batchData.numero_iniziale) + i)
        .toString()
        .padStart(3, "0");
      const codice = `${batchData.prefisso}${numero}`;

      newBins.push({
        id: startId + i,
        codice_identificativo: codice,
        tipo: batchData.tipo,
        capacita_kg: parseFloat(batchData.capacita_kg),
        tara_kg: parseFloat(batchData.tara_kg),
        stato: "vuoto",
        id_prodotto: null,
        prodotto_nome: null,
        id_origine: null,
        origine_tipo: null,
        origine_nome: null,
        anno_raccolta: null,
        peso_netto_kg: null,
        localizzazione: batchData.localizzazione,
        data_acquisto: batchData.data_acquisto,
      });
    }

    setBins([...bins, ...newBins]);
    handleCloseBatchDialog();
  };

  // Gestione carico bin (riempimento)
  const handleOpenDialogCarico = (bin) => {
    if (bin.stato !== "vuoto") {
      alert("Solo i BINS vuoti possono essere caricati.");
      return;
    }

    setCurrentCarico({
      id_bin: bin.id,
      id_prodotto: "",
      origine_tipo: "",
      id_origine: "",
      anno_raccolta: new Date().getFullYear(),
      peso_netto_kg: "",
      localizzazione: bin.localizzazione,
    });

    setDialogCaricoOpen(true);
  };

  const handleCloseDialogCarico = () => {
    setDialogCaricoOpen(false);
  };

  const handleCaricoInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCarico({
      ...currentCarico,
      [name]: value,
    });
  };

  const handleSaveCarico = () => {
    // Trova il bin selezionato
    const binSelezionato = bins.find((b) => b.id === currentCarico.id_bin);

    // Verifica che il peso non superi la capacità
    if (
      parseFloat(currentCarico.peso_netto_kg) >
      binSelezionato.capacita_kg - binSelezionato.tara_kg
    ) {
      alert(
        `Il peso netto non può superare ${
          binSelezionato.capacita_kg - binSelezionato.tara_kg
        } kg (capacità - tara).`
      );
      return;
    }

    // Trova nome prodotto
    const prodotto = prodotti.find(
      (p) => p.id === parseInt(currentCarico.id_prodotto)
    );

    // Trova nome origine
    let origine = null;
    if (currentCarico.origine_tipo === "appezzamento") {
      origine = appezzamenti.find(
        (a) => a.id === parseInt(currentCarico.id_origine)
      );
    } else if (currentCarico.origine_tipo === "fornitore") {
      origine = fornitori.find(
        (f) => f.id === parseInt(currentCarico.id_origine)
      );
    }

    // Aggiorna bin
    const updatedBins = bins.map((bin) => {
      if (bin.id === currentCarico.id_bin) {
        return {
          ...bin,
          stato: "pieno",
          id_prodotto: parseInt(currentCarico.id_prodotto),
          prodotto_nome: prodotto?.nome,
          origine_tipo: currentCarico.origine_tipo,
          id_origine: parseInt(currentCarico.id_origine),
          origine_nome: origine?.nome,
          anno_raccolta: parseInt(currentCarico.anno_raccolta),
          peso_netto_kg: parseFloat(currentCarico.peso_netto_kg),
          localizzazione: currentCarico.localizzazione,
        };
      }
      return bin;
    });

    setBins(updatedBins);
    handleCloseDialogCarico();
  };

  // Gestione scarico bin (svuotamento)
  const handleSvuotaBin = (bin) => {
    if (bin.stato === "vuoto") {
      alert("Questo BIN è già vuoto.");
      return;
    }

    if (
      window.confirm(
        `Sei sicuro di voler svuotare il BIN ${bin.codice_identificativo}?`
      )
    ) {
      const updatedBins = bins.map((item) => {
        if (item.id === bin.id) {
          return {
            ...item,
            stato: "vuoto",
            id_prodotto: null,
            prodotto_nome: null,
            id_origine: null,
            origine_tipo: null,
            origine_nome: null,
            anno_raccolta: null,
            peso_netto_kg: null,
          };
        }
        return item;
      });

      setBins(updatedBins);
    }
  };

  // Gestione stato lavorazione
  const handleSetStatoLavorazione = (bin) => {
    if (bin.stato !== "pieno") {
      alert("Solo i BINS pieni possono essere messi in lavorazione.");
      return;
    }

    const updatedBins = bins.map((item) => {
      if (item.id === bin.id) {
        return {
          ...item,
          stato: "in_lavorazione",
        };
      }
      return item;
    });

    setBins(updatedBins);
  };

  // Eliminazione bin
  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo BIN?")) {
      setBins(bins.filter((item) => item.id !== id));
    }
  };

  // Filtraggio bins in base alla ricerca e alla tab selezionata
  const filteredBins = bins.filter((bin) => {
    // Applica filtro di ricerca
    const matchesSearch =
      bin.codice_identificativo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bin.localizzazione.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bin.prodotto_nome &&
        bin.prodotto_nome.toLowerCase().includes(searchTerm.toLowerCase()));

    // Applica filtro per stato in base alla tab selezionata
    if (tabValue === 0) return matchesSearch; // Tutti
    if (tabValue === 1) return matchesSearch && bin.stato === "vuoto";
    if (tabValue === 2) return matchesSearch && bin.stato === "pieno";
    if (tabValue === 3) return matchesSearch && bin.stato === "in_lavorazione";

    return matchesSearch;
  });

  // Funzione per renderizzare chip stato con colore appropriato
  const renderStatoChip = (stato) => {
    let color = "default";
    switch (stato) {
      case "vuoto":
        color = "default";
        break;
      case "pieno":
        color = "success";
        break;
      case "in_lavorazione":
        color = "warning";
        break;
      default:
        color = "default";
    }

    let label =
      stato.charAt(0).toUpperCase() + stato.slice(1).replace("_", " ");

    return <Chip label={label} color={color} size="small" />;
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
          Gestione BINS
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={handleOpenBatchDialog}
            sx={{ mr: 1 }}
          >
            Creazione Multipla
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuovo BIN
          </Button>
        </Box>
      </Box>

      {/* Tabs per filtrare per stato */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tutti" />
          <Tab label="Vuoti" />
          <Tab label="Pieni" />
          <Tab label="In Lavorazione" />
        </Tabs>
      </Box>

      {/* Barra di ricerca */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cerca BIN per codice, prodotto o localizzazione..."
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

      {/* Tabella BINS */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codice</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Prodotto</TableCell>
              <TableCell>Origine</TableCell>
              <TableCell align="right">Peso Netto (kg)</TableCell>
              <TableCell>Localizzazione</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => (
                <TableRow key={bin.id}>
                  <TableCell>{bin.codice_identificativo}</TableCell>
                  <TableCell>{renderStatoChip(bin.stato)}</TableCell>
                  <TableCell>{bin.prodotto_nome || "-"}</TableCell>
                  <TableCell>
                    {bin.origine_nome ? (
                      <Chip
                        label={`${
                          bin.origine_tipo === "appezzamento"
                            ? "Appez."
                            : "Forn."
                        }: ${bin.origine_nome}`}
                        color={
                          bin.origine_tipo === "appezzamento"
                            ? "primary"
                            : "secondary"
                        }
                        size="small"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {bin.peso_netto_kg || "-"}
                  </TableCell>
                  <TableCell>{bin.localizzazione}</TableCell>
                  <TableCell align="center">
                    <Box>
                      {bin.stato === "vuoto" && (
                        <IconButton
                          color="success"
                          onClick={() => handleOpenDialogCarico(bin)}
                          title="Carica BIN"
                        >
                          <AddIcon />
                        </IconButton>
                      )}

                      {bin.stato === "pieno" && (
                        <IconButton
                          color="warning"
                          onClick={() => handleSetStatoLavorazione(bin)}
                          title="Metti in lavorazione"
                        >
                          <EditIcon />
                        </IconButton>
                      )}

                      {(bin.stato === "pieno" ||
                        bin.stato === "in_lavorazione") && (
                        <IconButton
                          color="error"
                          onClick={() => handleSvuotaBin(bin)}
                          title="Svuota BIN"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}

                      {bin.stato === "vuoto" && (
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(bin.id)}
                          title="Elimina BIN"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessun BIN trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per aggiunta/modifica singolo BIN */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isEdit ? "Modifica BIN" : "Nuovo BIN"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="codice_identificativo"
                label="Codice Identificativo"
                value={currentBin.codice_identificativo}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={currentBin.tipo}
                  label="Tipo"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Plastica">Plastica</MenuItem>
                  <MenuItem value="Legno">Legno</MenuItem>
                  <MenuItem value="Metallo">Metallo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacita_kg"
                label="Capacità (kg)"
                type="number"
                value={currentBin.capacita_kg}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tara_kg"
                label="Tara (kg)"
                type="number"
                value={currentBin.tara_kg}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="localizzazione"
                label="Localizzazione"
                value={currentBin.localizzazione}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data_acquisto"
                label="Data Acquisto"
                type="date"
                value={currentBin.data_acquisto}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per creazione multipla BINS */}
      <Dialog
        open={batchDialogOpen}
        onClose={handleCloseBatchDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Creazione Multipla BINS</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, mt: 1 }}
          >
            Crea rapidamente più BINS con numerazione progressiva. I BINS creati
            avranno lo stesso tipo, capacità e stato.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="prefisso"
                label="Prefisso Codice"
                value={batchData.prefisso}
                onChange={handleBatchInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="numero_iniziale"
                label="Numero Iniziale"
                type="number"
                value={batchData.numero_iniziale}
                onChange={handleBatchInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="quantita"
                label="Quantità da creare"
                type="number"
                value={batchData.quantita}
                onChange={handleBatchInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 1, max: 100 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={batchData.tipo}
                  label="Tipo"
                  onChange={handleBatchInputChange}
                >
                  <MenuItem value="Plastica">Plastica</MenuItem>
                  <MenuItem value="Legno">Legno</MenuItem>
                  <MenuItem value="Metallo">Metallo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="capacita_kg"
                label="Capacità (kg)"
                type="number"
                value={batchData.capacita_kg}
                onChange={handleBatchInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="tara_kg"
                label="Tara (kg)"
                type="number"
                value={batchData.tara_kg}
                onChange={handleBatchInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="localizzazione"
                label="Localizzazione"
                value={batchData.localizzazione}
                onChange={handleBatchInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data_acquisto"
                label="Data Acquisto"
                type="date"
                value={batchData.data_acquisto}
                onChange={handleBatchInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Anteprima:
            </Typography>
            <Typography variant="body2">
              Verranno creati {batchData.quantita} BINS con codici:
              {batchData.quantita <= 5 ? (
                <Box component="span" sx={{ display: "block", mt: 1 }}>
                  {Array.from(
                    { length: Math.min(parseInt(batchData.quantita), 5) },
                    (_, i) => {
                      const numero = (parseInt(batchData.numero_iniziale) + i)
                        .toString()
                        .padStart(3, "0");
                      return `${batchData.prefisso}${numero}`;
                    }
                  ).join(", ")}
                  {batchData.quantita > 5 ? " ..." : ""}
                </Box>
              ) : (
                <Box component="span" sx={{ display: "block", mt: 1 }}>
                  {`${batchData.prefisso}${parseInt(batchData.numero_iniziale)
                    .toString()
                    .padStart(3, "0")}, ${batchData.prefisso}${(
                    parseInt(batchData.numero_iniziale) + 1
                  )
                    .toString()
                    .padStart(3, "0")}, ... , ${batchData.prefisso}${(
                    parseInt(batchData.numero_iniziale) +
                    parseInt(batchData.quantita) -
                    1
                  )
                    .toString()
                    .padStart(3, "0")}`}
                </Box>
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBatchDialog} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveBatch}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Crea BINS
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per carico BIN (riempimento) */}
      <Dialog
        open={dialogCaricoOpen}
        onClose={handleCloseDialogCarico}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Carica BIN:{" "}
          {
            bins.find((b) => b.id === currentCarico.id_bin)
              ?.codice_identificativo
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Prodotto</InputLabel>
                <Select
                  name="id_prodotto"
                  value={currentCarico.id_prodotto}
                  label="Prodotto"
                  onChange={handleCaricoInputChange}
                >
                  {prodotti.map((prodotto) => (
                    <MenuItem key={prodotto.id} value={prodotto.id}>
                      {prodotto.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Origine</InputLabel>
                <Select
                  name="origine_tipo"
                  value={currentCarico.origine_tipo}
                  label="Origine"
                  onChange={handleCaricoInputChange}
                >
                  <MenuItem value="appezzamento">Appezzamento proprio</MenuItem>
                  <MenuItem value="fornitore">Fornitore esterno</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                disabled={!currentCarico.origine_tipo}
              >
                <InputLabel>
                  {currentCarico.origine_tipo === "appezzamento"
                    ? "Appezzamento"
                    : currentCarico.origine_tipo === "fornitore"
                    ? "Fornitore"
                    : "Seleziona origine"}
                </InputLabel>
                <Select
                  name="id_origine"
                  value={currentCarico.id_origine}
                  label={
                    currentCarico.origine_tipo === "appezzamento"
                      ? "Appezzamento"
                      : currentCarico.origine_tipo === "fornitore"
                      ? "Fornitore"
                      : "Seleziona origine"
                  }
                  onChange={handleCaricoInputChange}
                >
                  {currentCarico.origine_tipo === "appezzamento" ? (
                    appezzamenti.map((appezzamento) => (
                      <MenuItem key={appezzamento.id} value={appezzamento.id}>
                        {appezzamento.nome}
                      </MenuItem>
                    ))
                  ) : currentCarico.origine_tipo === "fornitore" ? (
                    fornitori.map((fornitore) => (
                      <MenuItem key={fornitore.id} value={fornitore.id}>
                        {fornitore.nome}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Seleziona prima l'origine
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="anno_raccolta"
                label="Anno di Raccolta"
                type="number"
                value={currentCarico.anno_raccolta}
                onChange={handleCaricoInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 2000, max: 2100 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="peso_netto_kg"
                label="Peso Netto (kg)"
                type="number"
                value={currentCarico.peso_netto_kg}
                onChange={handleCaricoInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: {
                    min: 0,
                    max:
                      bins.find((b) => b.id === currentCarico.id_bin)
                        ?.capacita_kg -
                      bins.find((b) => b.id === currentCarico.id_bin)?.tara_kg,
                  },
                }}
                helperText={`Max: ${
                  bins.find((b) => b.id === currentCarico.id_bin)?.capacita_kg -
                  bins.find((b) => b.id === currentCarico.id_bin)?.tara_kg
                } kg (capacità - tara)`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="localizzazione"
                label="Localizzazione"
                value={currentCarico.localizzazione}
                onChange={handleCaricoInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogCarico} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveCarico}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !currentCarico.id_prodotto ||
              !currentCarico.origine_tipo ||
              !currentCarico.id_origine ||
              !currentCarico.peso_netto_kg
            }
          >
            Carica BIN
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestioneBins;
