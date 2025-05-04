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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveCircle as RemoveCircleIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProdottiAgronomici = () => {
  const [prodotti, setProdotti] = useState([]);
  const [movimenti, setMovimenti] = useState([]);
  const [appezzamenti, setAppezzamenti] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedProductForMenu, setSelectedProductForMenu] = useState(null);
  const [dialogCaricoOpen, setDialogCaricoOpen] = useState(false);
  const [dialogScaricoOpen, setDialogScaricoOpen] = useState(false);
  const [dialogProdottoOpen, setDialogProdottoOpen] = useState(false);
  const [visualizzaMovimenti, setVisualizzaMovimenti] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);
  const [currentProdotto, setCurrentProdotto] = useState({
    codice: "",
    nome_commerciale: "",
    principio_attivo: "",
    categoria: "fitosanitario",
    sottocategoria: "",
    unita_misura: "l",
    giacenza: {
      scorta_minima: 0,
      quantita_attuale: 0,
      localizzazione: "",
    },
  });
  const [currentCarico, setCurrentCarico] = useState({
    tipo: "carico",
    quantita: "",
    prezzo_unitario: "",
    fornitore: "",
    documento: "",
    note: "",
  });
  const [currentScarico, setCurrentScarico] = useState({
    tipo: "scarico",
    quantita: "",
    id_appezzamento: "",
    trattamento: "",
    note: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica prodotti e appezzamenti all'avvio
  useEffect(() => {
    fetchProdotti();
    fetchAppezzamenti();
  }, []);

  // Fetch prodotti
  const fetchProdotti = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prodotti-agronomici`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero dei prodotti");

      const data = await response.json();
      setProdotti(data.prodotti);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch appezzamenti
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
      console.error("Errore appezzamenti:", err.message);
    }
  };

  // Fetch movimenti di un prodotto
  const fetchMovimenti = async (prodottoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/prodotti-agronomici/${prodottoId}/movimenti`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nel recupero dei movimenti");

      const data = await response.json();
      setMovimenti(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestione menu
  const handleOpenMenu = (event, prodotto) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedProductForMenu(prodotto);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedProductForMenu(null);
  };

  // Visualizza movimenti
  const handleVisualizzaMovimenti = () => {
    setProdottoSelezionato(selectedProductForMenu);
    fetchMovimenti(selectedProductForMenu._id);
    setVisualizzaMovimenti(true);
    handleCloseMenu();
  };

  // Torna alla lista prodotti
  const handleBackToProducts = () => {
    setVisualizzaMovimenti(false);
    setProdottoSelezionato(null);
  };

  // Gestione dialog prodotto
  const handleOpenDialogProdotto = (prodotto = null) => {
    if (prodotto) {
      setCurrentProdotto(prodotto);
      setIsEdit(true);
    } else {
      setCurrentProdotto({
        codice: "",
        nome_commerciale: "",
        principio_attivo: "",
        categoria: "fitosanitario",
        sottocategoria: "",
        unita_misura: "l",
        giacenza: {
          scorta_minima: 0,
          quantita_attuale: 0,
          localizzazione: "",
        },
      });
      setIsEdit(false);
    }
    setDialogProdottoOpen(true);
  };

  const handleCloseProdottoDialog = () => {
    setDialogProdottoOpen(false);
  };

  const handleProdottoInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCurrentProdotto((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCurrentProdotto((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveProdotto = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_URL}/prodotti-agronomici/${currentProdotto._id}`
        : `${API_URL}/prodotti-agronomici`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentProdotto),
      });

      if (!response.ok) throw new Error("Errore nel salvataggio del prodotto");

      fetchProdotti();
      handleCloseProdottoDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestione dialog carico
  const handleOpenDialogCarico = () => {
    setCurrentCarico({
      tipo: "carico",
      quantita: "",
      prezzo_unitario: "",
      fornitore: "",
      documento: "",
      note: "",
    });
    setDialogCaricoOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialogCarico = () => {
    setDialogCaricoOpen(false);
  };

  const handleCaricoInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCarico((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCarico = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/prodotti-agronomici/${selectedProductForMenu._id}/movimenti`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...currentCarico,
            unita_misura: selectedProductForMenu.unita_misura,
          }),
        }
      );

      if (!response.ok) throw new Error("Errore nel salvataggio del carico");

      fetchProdotti();
      handleCloseDialogCarico();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestione dialog scarico
  const handleOpenDialogScarico = () => {
    if (!selectedProductForMenu.giacenza?.quantita_attuale) {
      setError("Non ci sono giacenze disponibili per questo prodotto!");
      handleCloseMenu();
      return;
    }

    setCurrentScarico({
      tipo: "scarico",
      quantita: "",
      id_appezzamento: "",
      trattamento: "",
      note: "",
    });
    setDialogScaricoOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialogScarico = () => {
    setDialogScaricoOpen(false);
  };

  const handleScaricoInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentScarico((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveScarico = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/prodotti-agronomici/${selectedProductForMenu._id}/movimenti`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...currentScarico,
            unita_misura: selectedProductForMenu.unita_misura,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Errore nel salvataggio dello scarico"
        );
      }

      fetchProdotti();
      handleCloseDialogScarico();
    } catch (err) {
      setError(err.message);
    }
  };

  // Rendering condizionale per loadinge error
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

      {!visualizzaMovimenti ? (
        // Vista principale: elenco prodotti agronomici
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" component="h1">
              Gestione Prodotti Agronomici
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialogProdotto()}
            >
              Nuovo Prodotto
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Codice</TableCell>
                  <TableCell>Nome Commerciale</TableCell>
                  <TableCell>Principio Attivo</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Giacenza</TableCell>
                  <TableCell align="center">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prodotti.map((prodotto) => (
                  <TableRow key={prodotto._id}>
                    <TableCell>{prodotto.codice}</TableCell>
                    <TableCell>{prodotto.nome_commerciale}</TableCell>
                    <TableCell>{prodotto.principio_attivo}</TableCell>
                    <TableCell>
                      <Chip
                        label={prodotto.categoria}
                        color={
                          prodotto.categoria === "fitosanitario"
                            ? "error"
                            : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {prodotto.giacenza?.quantita_attuale || 0}{" "}
                      {prodotto.unita_misura}
                      {prodotto.giacenza?.quantita_attuale <=
                        prodotto.giacenza?.scorta_minima && (
                        <Chip
                          label="Scorta bassa"
                          color="warning"
                          size="small"
                          icon={<WarningIcon />}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialogProdotto(prodotto)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={(e) => handleOpenMenu(e, prodotto)}
                      >
                        <InventoryIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        // Vista movimenti per un prodotto specifico
        <>
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToProducts}
              sx={{ mr: 2 }}
            >
              Torna all'elenco
            </Button>
            <Typography variant="h5" component="h2">
              Movimenti: {prodottoSelezionato?.nome_commerciale}
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantità</TableCell>
                  <TableCell>Dettagli</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimenti.length > 0 ? (
                  movimenti.map((movimento) => (
                    <TableRow key={movimento._id}>
                      <TableCell>
                        {new Date(movimento.data).toLocaleDateString("it-IT")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            movimento.tipo === "carico" ? "Carico" : "Scarico"
                          }
                          color={
                            movimento.tipo === "carico" ? "success" : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {movimento.quantita} {movimento.unita_misura}
                      </TableCell>
                      <TableCell>
                        {movimento.tipo === "carico" ? (
                          <Typography variant="body2">
                            Fornitore: {movimento.fornitore}, Doc:{" "}
                            {movimento.documento}
                          </Typography>
                        ) : (
                          <Typography variant="body2">
                            Appezzamento: {movimento.id_appezzamento?.nome},
                            Trattamento: {movimento.trattamento}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{movimento.note}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nessun movimento registrato per questo prodotto
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Menu per operazioni di magazzino */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenDialogCarico}>
          <ListItemIcon>
            <AddShoppingCartIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Registra Carico</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenDialogScarico}>
          <ListItemIcon>
            <RemoveCircleIcon color="error" />
          </ListItemIcon>
          <ListItemText>Registra Scarico</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleVisualizzaMovimenti}>
          <ListItemIcon>
            <HistoryIcon color="secondary" />
          </ListItemIcon>
          <ListItemText>Visualizza Movimenti</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog per gestione prodotto */}
      <Dialog
        open={dialogProdottoOpen}
        onClose={handleCloseProdottoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Modifica Prodotto" : "Nuovo Prodotto"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="codice"
                label="Codice"
                value={currentProdotto.codice}
                onChange={handleProdottoInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nome_commerciale"
                label="Nome Commerciale"
                value={currentProdotto.nome_commerciale}
                onChange={handleProdottoInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="principio_attivo"
                label="Principio Attivo"
                value={currentProdotto.principio_attivo}
                onChange={handleProdottoInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="categoria"
                  value={currentProdotto.categoria}
                  label="Categoria"
                  onChange={handleProdottoInputChange}
                >
                  <MenuItem value="fitosanitario">Fitosanitario</MenuItem>
                  <MenuItem value="concime">Concime</MenuItem>
                  <MenuItem value="altro">Altro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unità di Misura</InputLabel>
                <Select
                  name="unita_misura"
                  value={currentProdotto.unita_misura}
                  label="Unità di Misura"
                  onChange={handleProdottoInputChange}
                >
                  <MenuItem value="l">Litri (l)</MenuItem>
                  <MenuItem value="kg">Chilogrammi (kg)</MenuItem>
                  <MenuItem value="g">Grammi (g)</MenuItem>
                  <MenuItem value="ml">Millilitri (ml)</MenuItem>
                  <MenuItem value="t">Tonnellate (t)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="giacenza.scorta_minima"
                label="Scorta Minima"
                type="number"
                value={currentProdotto.giacenza?.scorta_minima || 0}
                onChange={handleProdottoInputChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProdottoDialog} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveProdotto}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !currentProdotto.codice || !currentProdotto.nome_commerciale
            }
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per registrazione carico */}
      <Dialog
        open={dialogCaricoOpen}
        onClose={handleCloseDialogCarico}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Registra Carico: {selectedProductForMenu?.nome_commerciale}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantita"
                label="Quantità"
                type="number"
                value={currentCarico.quantita}
                onChange={handleCaricoInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: (
                    <InputAdornment position="end">
                      {selectedProductForMenu?.unita_misura}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prezzo_unitario"
                label="Prezzo Unitario (€)"
                type="number"
                value={currentCarico.prezzo_unitario}
                onChange={handleCaricoInputChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="fornitore"
                label="Fornitore"
                value={currentCarico.fornitore}
                onChange={handleCaricoInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="documento"
                label="Documento (Fattura/DDT)"
                value={currentCarico.documento}
                onChange={handleCaricoInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note"
                value={currentCarico.note}
                onChange={handleCaricoInputChange}
                multiline
                rows={2}
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
            disabled={!currentCarico.quantita}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per registrazione scarico */}
      <Dialog
        open={dialogScaricoOpen}
        onClose={handleCloseDialogScarico}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Registra Utilizzo: {selectedProductForMenu?.nome_commerciale}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantita"
                label="Quantità Utilizzata"
                type="number"
                value={currentScarico.quantita}
                onChange={handleScaricoInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    max: selectedProductForMenu?.giacenza?.quantita_attuale,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      {selectedProductForMenu?.unita_misura}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Appezzamento</InputLabel>
                <Select
                  name="id_appezzamento"
                  value={currentScarico.id_appezzamento}
                  label="Appezzamento"
                  onChange={handleScaricoInputChange}
                >
                  {appezzamenti.map((appezzamento) => (
                    <MenuItem key={appezzamento._id} value={appezzamento._id}>
                      {appezzamento.nome} ({appezzamento.superficie_ha} ha)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="trattamento"
                label="Tipo di Trattamento"
                value={currentScarico.trattamento}
                onChange={handleScaricoInputChange}
                fullWidth
                placeholder="Es. Antioidico, Concimazione azotata..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note"
                value={currentScarico.note}
                onChange={handleScaricoInputChange}
                multiline
                rows={2}
                fullWidth
                placeholder="Es. condizioni meteo, fase fenologica..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogScarico} startIcon={<CloseIcon />}>
            Annulla
          </Button>
          <Button
            onClick={handleSaveScarico}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !currentScarico.quantita || !currentScarico.id_appezzamento
            }
          >
            Registra Utilizzo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProdottiAgronomici;
