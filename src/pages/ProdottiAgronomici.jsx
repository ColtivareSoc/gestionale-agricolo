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
} from "@mui/icons-material";

// Dati di esempio per le categorie
const categorieMock = [
  { id: 1, nome: "Fungicidi", tipo: "fitosanitario" },
  { id: 2, nome: "Insetticidi", tipo: "fitosanitario" },
  { id: 3, nome: "Diserbanti", tipo: "fitosanitario" },
  { id: 4, nome: "Azotati", tipo: "concime" },
  { id: 5, nome: "Fosfatici", tipo: "concime" },
  { id: 6, nome: "Potassici", tipo: "concime" },
  { id: 7, nome: "Organici", tipo: "concime" },
];

// Dati di esempio per i prodotti agronomici
const prodottiMock = [
  {
    id: 1,
    codice: "FUNG001",
    nome_commerciale: "FungiStop Pro",
    principio_attivo: "Tebuconazolo",
    id_categoria: 1,
    categoria_nome: "Fungicidi",
    unita_misura: "l",
  },
  {
    id: 2,
    codice: "INS001",
    nome_commerciale: "InsectoKill",
    principio_attivo: "Lambda-cialotrina",
    id_categoria: 2,
    categoria_nome: "Insetticidi",
    unita_misura: "l",
  },
  {
    id: 3,
    codice: "CONC001",
    nome_commerciale: "NutriPlus N30",
    principio_attivo: "Urea + Nitrato ammonico",
    id_categoria: 4,
    categoria_nome: "Azotati",
    unita_misura: "kg",
  },
];

// Dati di esempio per le giacenze
const giacenzeMock = [
  { id_prodotto: 1, quantita: 25.5, unita_misura: "l" },
  { id_prodotto: 2, quantita: 8.0, unita_misura: "l" },
  { id_prodotto: 3, quantita: 1200, unita_misura: "kg" },
];

// Dati di esempio per gli appezzamenti
const appezzamentiMock = [
  { id: 1, nome: "Campo Grande", superficie_ha: 2.5 },
  { id: 2, nome: "Vigna Nord", superficie_ha: 1.8 },
  { id: 3, nome: "Frutteto Est", superficie_ha: 3.2 },
];

// Aggiungiamo alcuni movimenti di esempio
const movimentiMock = [
  {
    id: 1,
    id_prodotto: 1,
    data: "2024-03-15",
    tipo: "carico",
    quantita: 30,
    unita_misura: "l",
    fornitore: "AgrochemItalia",
    documento: "Fattura 123/2024",
    prezzo_unitario: 42.5,
    note: "Acquisto iniziale",
  },
  {
    id: 2,
    id_prodotto: 1,
    data: "2024-04-02",
    tipo: "scarico",
    quantita: 4.5,
    unita_misura: "l",
    id_appezzamento: 1,
    nome_appezzamento: "Campo Grande",
    trattamento: "Trattamento antioidico",
    note: "Trattamento preventivo",
  },
];

const ProdottiAgronomici = () => {
  const [prodotti] = useState(prodottiMock);
  const [giacenze, setGiacenze] = useState(giacenzeMock);
  const [movimenti, setMovimenti] = useState(movimentiMock);
  const [appezzamenti] = useState(appezzamentiMock);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedProductForMenu, setSelectedProductForMenu] = useState(null);
  const [dialogCaricoOpen, setDialogCaricoOpen] = useState(false);
  const [dialogScaricoOpen, setDialogScaricoOpen] = useState(false);
  const [visualizzaMovimenti, setVisualizzaMovimenti] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);

  const [currentCarico, setCurrentCarico] = useState({
    id_prodotto: "",
    data: new Date().toISOString().split("T")[0],
    quantita: "",
    unita_misura: "",
    prezzo_unitario: "",
    fornitore: "",
    documento: "",
    note: "",
  });

  const [currentScarico, setCurrentScarico] = useState({
    id_prodotto: "",
    data: new Date().toISOString().split("T")[0],
    quantita: "",
    unita_misura: "",
    id_appezzamento: "",
    trattamento: "",
    note: "",
  });

  // Funzione per aprire il menu
  const handleOpenMenu = (event, prodotto) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedProductForMenu(prodotto);
  };

  // Funzione per chiudere il menu
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedProductForMenu(null);
  };

  // Funzione per visualizzare i movimenti
  const handleVisualizzaMovimenti = () => {
    setProdottoSelezionato(selectedProductForMenu);
    setVisualizzaMovimenti(true);
    handleCloseMenu();
  };

  // Funzione per tornare alla lista prodotti
  const handleBackToProducts = () => {
    setVisualizzaMovimenti(false);
    setProdottoSelezionato(null);
  };

  // Gestione dialog carico
  const handleOpenDialogCarico = () => {
    const giacenza = giacenze.find(
      (g) => g.id_prodotto === selectedProductForMenu.id
    );

    setCurrentCarico({
      id_prodotto: selectedProductForMenu.id,
      data: new Date().toISOString().split("T")[0],
      quantita: "",
      unita_misura:
        giacenza?.unita_misura || selectedProductForMenu.unita_misura,
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
    setCurrentCarico({
      ...currentCarico,
      [name]: value,
    });
  };

  const handleSaveCarico = () => {
    // Crea nuovo movimento di carico
    const newMovimento = {
      id: movimenti.length ? Math.max(...movimenti.map((m) => m.id)) + 1 : 1,
      ...currentCarico,
      tipo: "carico",
      quantita: parseFloat(currentCarico.quantita),
    };

    // Aggiorna movimenti
    setMovimenti([...movimenti, newMovimento]);

    // Aggiorna giacenze
    const giacenzaEsistente = giacenze.find(
      (g) => g.id_prodotto === parseInt(currentCarico.id_prodotto)
    );

    if (giacenzaEsistente) {
      // Aggiorna giacenza esistente
      const updatedGiacenze = giacenze.map((g) => {
        if (g.id_prodotto === parseInt(currentCarico.id_prodotto)) {
          return {
            ...g,
            quantita: g.quantita + parseFloat(currentCarico.quantita),
          };
        }
        return g;
      });

      setGiacenze(updatedGiacenze);
    } else {
      // Crea nuova giacenza
      const nuovaGiacenza = {
        id_prodotto: parseInt(currentCarico.id_prodotto),
        quantita: parseFloat(currentCarico.quantita),
        unita_misura: currentCarico.unita_misura,
      };

      setGiacenze([...giacenze, nuovaGiacenza]);
    }

    handleCloseDialogCarico();
  };

  // Gestione dialog scarico
  const handleOpenDialogScarico = () => {
    const giacenza = giacenze.find(
      (g) => g.id_prodotto === selectedProductForMenu.id
    );

    if (!giacenza || giacenza.quantita <= 0) {
      alert("Non ci sono giacenze disponibili per questo prodotto!");
      handleCloseMenu();
      return;
    }

    setCurrentScarico({
      id_prodotto: selectedProductForMenu.id,
      data: new Date().toISOString().split("T")[0],
      quantita: "",
      unita_misura: giacenza.unita_misura,
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
    setCurrentScarico({
      ...currentScarico,
      [name]: value,
    });
  };

  const handleSaveScarico = () => {
    const giacenza = giacenze.find(
      (g) => g.id_prodotto === parseInt(currentScarico.id_prodotto)
    );

    // Verifica che ci sia giacenza sufficiente
    if (parseFloat(currentScarico.quantita) > giacenza.quantita) {
      alert(
        `Giacenza insufficiente! Disponibile: ${giacenza.quantita} ${giacenza.unita_misura}`
      );
      return;
    }

    // Trova l'appezzamento selezionato
    const appezzamento = appezzamenti.find(
      (a) => a.id === parseInt(currentScarico.id_appezzamento)
    );

    // Crea nuovo movimento di scarico
    const newMovimento = {
      id: movimenti.length ? Math.max(...movimenti.map((m) => m.id)) + 1 : 1,
      ...currentScarico,
      tipo: "scarico",
      quantita: parseFloat(currentScarico.quantita),
      nome_appezzamento: appezzamento.nome,
    };

    // Aggiorna movimenti
    setMovimenti([...movimenti, newMovimento]);

    // Aggiorna giacenza
    const updatedGiacenze = giacenze.map((g) => {
      if (g.id_prodotto === parseInt(currentScarico.id_prodotto)) {
        return {
          ...g,
          quantita: g.quantita - parseFloat(currentScarico.quantita),
        };
      }
      return g;
    });

    setGiacenze(updatedGiacenze);

    handleCloseDialogScarico();
  };

  return (
    <Box>
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
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
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
                {prodotti.map((prodotto) => {
                  const categoria = categorieMock.find(
                    (c) => c.id === prodotto.id_categoria
                  );
                  const giacenza = giacenze.find(
                    (g) => g.id_prodotto === prodotto.id
                  );

                  return (
                    <TableRow key={prodotto.id}>
                      <TableCell>{prodotto.codice}</TableCell>
                      <TableCell>{prodotto.nome_commerciale}</TableCell>
                      <TableCell>{prodotto.principio_attivo}</TableCell>
                      <TableCell>
                        <Chip
                          label={prodotto.categoria_nome}
                          color={
                            categoria?.tipo === "fitosanitario"
                              ? "error"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {giacenza
                          ? `${giacenza.quantita} ${giacenza.unita_misura}`
                          : "N/D"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={(e) => handleOpenMenu(e, prodotto)}
                        >
                          <InventoryIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                {movimenti.filter(
                  (m) => m.id_prodotto === prodottoSelezionato?.id
                ).length > 0 ? (
                  movimenti
                    .filter((m) => m.id_prodotto === prodottoSelezionato?.id)
                    .map((movimento) => (
                      <TableRow key={movimento.id}>
                        <TableCell>{movimento.data}</TableCell>
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
                              Appezzamento: {movimento.nome_appezzamento},
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
                name="data"
                label="Data"
                type="date"
                value={currentCarico.data}
                onChange={handleCaricoInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
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
                      {currentCarico.unita_misura}
                    </InputAdornment>
                  ),
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="prezzo_unitario"
                label="Prezzo unitario (€)"
                type="number"
                value={currentCarico.prezzo_unitario}
                onChange={handleCaricoInputChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                }}
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
                name="data"
                label="Data Trattamento"
                type="date"
                value={currentScarico.data}
                onChange={handleScaricoInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
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
                    max:
                      giacenze.find(
                        (g) =>
                          g.id_prodotto === parseInt(currentScarico.id_prodotto)
                      )?.quantita || 0,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      {currentScarico.unita_misura}
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
                    <MenuItem key={appezzamento.id} value={appezzamento.id}>
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
