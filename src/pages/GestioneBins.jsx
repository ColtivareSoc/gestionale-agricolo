import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GestioneBins = () => {
  const [bins, setBins] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [appezzamenti, setAppezzamenti] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCaricoOpen, setDialogCaricoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [currentBin, setCurrentBin] = useState({
    codice_identificativo: "",
    tipo: "Plastica",
    capacita_kg: 300,
    tara_kg: 20,
    localizzazione: "",
    data_acquisto: new Date().toISOString().split("T")[0],
  });
  const [currentCarico, setCurrentCarico] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch iniziale dei dati
  useEffect(() => {
    fetchBins();
    fetchProdotti();
    fetchAppezzamenti();
  }, []);

  const fetchBins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/bins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero dei BINS");

      const data = await response.json();
      setBins(data.bins);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProdotti = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prodotti-agricoli`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero dei prodotti");

      const data = await response.json();
      setProdotti(data.prodotti);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAppezzamenti = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/appezzamenti`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Errore nel recupero degli appezzamenti");

      const data = await response.json();
      setAppezzamenti(data.appezzamenti);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_URL}/bins/${currentBin._id}`
        : `${API_URL}/bins`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentBin),
      });

      if (!response.ok) throw new Error("Errore nel salvataggio del BIN");

      fetchBins();
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    }
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

  const handleSaveBatch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/bins/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(batchData),
      });

      if (!response.ok) throw new Error("Errore nella creazione batch");

      fetchBins();
      handleCloseBatchDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestione carico bin
  const handleOpenDialogCarico = (bin) => {
    if (bin.stato !== "vuoto") {
      setError("Solo i BINS vuoti possono essere caricati.");
      return;
    }

    setCurrentCarico({
      id_prodotto: "",
      origine_tipo: "",
      id_origine: "",
      anno_raccolta: new Date().getFullYear(),
      peso_netto_kg: "",
      localizzazione: bin.localizzazione,
    });

    setCurrentBin(bin);
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

  const handleSaveCarico = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/bins/${currentBin._id}/carica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentCarico),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore nel carico del BIN");
      }

      fetchBins();
      handleCloseDialogCarico();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestione scarico bin
  const handleSvuotaBin = async (bin) => {
    if (bin.stato === "vuoto") {
      setError("Questo BIN è già vuoto.");
      return;
    }

    if (
      window.confirm(
        `Sei sicuro di voler svuotare il BIN ${bin.codice_identificativo}?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/bins/${bin._id}/svuota`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Errore nello svuotamento del BIN");

        fetchBins();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Gestione stato lavorazione
  const handleSetStatoLavorazione = async (bin) => {
    if (bin.stato !== "pieno") {
      setError("Solo i BINS pieni possono essere messi in lavorazione.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/bins/${bin._id}/in-lavorazione`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nel cambio stato");

      fetchBins();
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminazione bin
  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo BIN?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/bins/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Errore nell'eliminazione del BIN");

        fetchBins();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtraggio bins
  const filteredBins = bins.filter((bin) => {
    // Applica filtro di ricerca
    const matchesSearch =
      bin.codice_identificativo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bin.localizzazione?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bin.prodotto_nome &&
        bin.prodotto_nome.toLowerCase().includes(searchTerm.toLowerCase()));

    // Applica filtro per stato in base alla tab selezionata
    if (tabValue === 0) return matchesSearch; // Tutti
    if (tabValue === 1) return matchesSearch && bin.stato === "vuoto";
    if (tabValue === 2) return matchesSearch && bin.stato === "pieno";
    if (tabValue === 3) return matchesSearch && bin.stato === "in_lavorazione";

    return matchesSearch;
  });

  // Rendering
  const renderStatoChip = (stato) => {
    let color = "default";
    let label = stato;

    switch (stato) {
      case "vuoto":
        color = "default";
        label = "Vuoto";
        break;
      case "pieno":
        color = "success";
        label = "Pieno";
        break;
      case "in_lavorazione":
        color = "warning";
        label = "In Lavorazione";
        break;
      default:
        break;
    }

    return <Chip label={label} color={color} size="small" />;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
                <TableRow key={bin._id}>
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
                          onClick={() => handleDelete(bin._id)}
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
                    { length: Math.min(parseInt(batchData.quantita) || 0, 5) },
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

      {/* Dialog per carico BIN */}
      <Dialog
        open={dialogCaricoOpen}
        onClose={handleCloseDialogCarico}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Carica BIN: {currentBin?.codice_identificativo}
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
                    <MenuItem key={prodotto._id} value={prodotto._id}>
                      {prodotto.nome} {prodotto.varieta}
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
                      <MenuItem key={appezzamento._id} value={appezzamento._id}>
                        {appezzamento.nome}
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
                    max: currentBin?.capacita_kg - currentBin?.tara_kg,
                  },
                }}
                helperText={`Max: ${
                  currentBin?.capacita_kg - currentBin?.tara_kg
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
