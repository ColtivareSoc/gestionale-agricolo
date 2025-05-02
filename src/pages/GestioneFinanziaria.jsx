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
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";

// Dati di esempio per le categorie di entrate
const categorieEntrateMock = [
  {
    id: 1,
    nome: "Vendita prodotti",
    descrizione: "Vendita di prodotti agricoli",
  },
  {
    id: 2,
    nome: "Contributi PAC",
    descrizione: "Contributi Politica Agricola Comune",
  },
  {
    id: 3,
    nome: "Vendita BINS",
    descrizione: "Vendita di BINS o altri contenitori",
  },
  { id: 4, nome: "Altro", descrizione: "Altre entrate non categorizzate" },
];

// Dati di esempio per le categorie di uscite
const categorieUsciteMock = [
  {
    id: 1,
    nome: "Manodopera",
    descrizione: "Costi per dipendenti e lavoratori stagionali",
  },
  {
    id: 2,
    nome: "Fitosanitari",
    descrizione: "Acquisto prodotti fitosanitari",
  },
  { id: 3, nome: "Concimi", descrizione: "Acquisto concimi" },
  { id: 4, nome: "Carburante", descrizione: "Carburante per mezzi agricoli" },
  {
    id: 5,
    nome: "Manutenzione",
    descrizione: "Manutenzione mezzi e attrezzature",
  },
  { id: 6, nome: "Acquisto BINS", descrizione: "Acquisto contenitori BINS" },
  { id: 7, nome: "Utenze", descrizione: "Acqua, elettricità, gas" },
  { id: 8, nome: "Altro", descrizione: "Altre uscite non categorizzate" },
];

// Dati di esempio per i movimenti finanziari
const movimentiMock = [
  {
    id: 1,
    data: "2024-04-15",
    tipo: "entrata",
    importo: 3500,
    id_categoria: 1,
    categoria_nome: "Vendita prodotti",
    descrizione: "Vendita mele Golden Cooperative Valle",
    documento: "Fattura n.123/2024",
  },
  {
    id: 2,
    data: "2024-04-10",
    tipo: "uscita",
    importo: 1200,
    id_categoria: 1,
    categoria_nome: "Manodopera",
    descrizione: "Pagamento lavoratori stagionali",
    documento: "Ricevuta n.45/2024",
  },
  {
    id: 3,
    data: "2024-04-05",
    tipo: "uscita",
    importo: 850,
    id_categoria: 2,
    categoria_nome: "Fitosanitari",
    descrizione: "Acquisto fungicidi per melo",
    documento: "Fattura n.78/2024",
  },
  {
    id: 4,
    data: "2024-03-28",
    tipo: "entrata",
    importo: 4200,
    id_categoria: 1,
    categoria_nome: "Vendita prodotti",
    descrizione: "Vendita pere Abate Coop Frutta",
    documento: "Fattura n.119/2024",
  },
  {
    id: 5,
    data: "2024-03-20",
    tipo: "uscita",
    importo: 750,
    id_categoria: 4,
    categoria_nome: "Carburante",
    descrizione: "Gasolio trattori",
    documento: "Scontrino n.349",
  },
  {
    id: 6,
    data: "2024-03-15",
    tipo: "entrata",
    importo: 5500,
    id_categoria: 2,
    categoria_nome: "Contributi PAC",
    descrizione: "Primo acconto PAC 2024",
    documento: "Bonifico AGEA",
  },
];

const GestioneFinanziaria = () => {
  const [movimenti, setMovimenti] = useState(movimentiMock);
  const [categorieEntrate] = useState(categorieEntrateMock);
  const [categorieUscite] = useState(categorieUsciteMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [currentMovimento, setCurrentMovimento] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo: "entrata",
    importo: "",
    id_categoria: "",
    descrizione: "",
    documento: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [periodoFiltro, setPeriodoFiltro] = useState({
    inizio: "",
    fine: "",
  });

  // Calcola totali
  const totaleEntrate = movimenti
    .filter((m) => m.tipo === "entrata")
    .reduce((acc, m) => acc + m.importo, 0);

  const totaleUscite = movimenti
    .filter((m) => m.tipo === "uscita")
    .reduce((acc, m) => acc + m.importo, 0);

  const saldoAttuale = totaleEntrate - totaleUscite;

  // Filtra movimenti in base alla tab selezionata, alla ricerca e al periodo
  const filteredMovimenti = movimenti.filter((movimento) => {
    // Filtro per tipo (tab)
    if (tabValue === 1 && movimento.tipo !== "entrata") return false;
    if (tabValue === 2 && movimento.tipo !== "uscita") return false;

    // Filtro per ricerca
    if (
      searchTerm &&
      !movimento.descrizione.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !movimento.categoria_nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !movimento.documento.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtro per periodo
    if (periodoFiltro.inizio && movimento.data < periodoFiltro.inizio)
      return false;
    if (periodoFiltro.fine && movimento.data > periodoFiltro.fine) return false;

    return true;
  });

  // Gestione tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestione dialog
  const handleOpenDialog = (movimento = null) => {
    if (movimento) {
      setCurrentMovimento(movimento);
      setIsEdit(true);
    } else {
      setCurrentMovimento({
        data: new Date().toISOString().split("T")[0],
        tipo: "entrata",
        importo: "",
        id_categoria: "",
        descrizione: "",
        documento: "",
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
    setCurrentMovimento({
      ...currentMovimento,
      [name]: name === "importo" ? parseFloat(value) || "" : value,
    });
  };

  const handleSave = () => {
    // Trova il nome della categoria
    const categorieCorrente =
      currentMovimento.tipo === "entrata" ? categorieEntrate : categorieUscite;
    const categoria = categorieCorrente.find(
      (c) => c.id === parseInt(currentMovimento.id_categoria)
    );

    const nuovoMovimento = {
      ...currentMovimento,
      categoria_nome: categoria?.nome || "N/D",
    };

    if (isEdit) {
      // Aggiorna movimento esistente
      const updatedMovimenti = movimenti.map((item) =>
        item.id === nuovoMovimento.id ? nuovoMovimento : item
      );
      setMovimenti(updatedMovimenti);
    } else {
      // Aggiungi nuovo movimento
      const newMovimento = {
        ...nuovoMovimento,
        id: Math.max(...movimenti.map((m) => m.id), 0) + 1,
        importo: parseFloat(nuovoMovimento.importo),
      };
      setMovimenti([...movimenti, newMovimento]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo movimento?")) {
      setMovimenti(movimenti.filter((item) => item.id !== id));
    }
  };

  // Gestione filtro periodo
  const handlePeriodoChange = (e) => {
    setPeriodoFiltro({
      ...periodoFiltro,
      [e.target.name]: e.target.value,
    });
  };

  const clearPeriodoFiltro = () => {
    setPeriodoFiltro({
      inizio: "",
      fine: "",
    });
  };

  // Calcola statistiche per categoria
  const getStatistichePerCategoria = (tipo) => {
    const movimentiPerTipo = movimenti.filter((m) => m.tipo === tipo);
    const totalePerTipo = movimentiPerTipo.reduce(
      (acc, m) => acc + m.importo,
      0
    );

    // Raggruppa per categoria
    const categorie = tipo === "entrata" ? categorieEntrate : categorieUscite;

    return categorie
      .map((categoria) => {
        const movimentiCategoria = movimentiPerTipo.filter(
          (m) => m.id_categoria === categoria.id
        );
        const totaleCategoria = movimentiCategoria.reduce(
          (acc, m) => acc + m.importo,
          0
        );
        const percentuale =
          totalePerTipo > 0
            ? ((totaleCategoria / totalePerTipo) * 100).toFixed(1)
            : 0;

        return {
          id: categoria.id,
          nome: categoria.nome,
          totale: totaleCategoria,
          percentuale: percentuale,
          conteggio: movimentiCategoria.length,
        };
      })
      .filter((stat) => stat.conteggio > 0);
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
          Gestione Finanziaria
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Movimento
        </Button>
      </Box>

      {/* Schede Riassuntive */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Entrate Totali
              </Typography>
              <Typography variant="h5" component="div" color="success.main">
                {totaleEntrate.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Uscite Totali
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                {totaleUscite.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Saldo Attuale
              </Typography>
              <Typography
                variant="h5"
                component="div"
                color={saldoAttuale >= 0 ? "success.main" : "error.main"}
              >
                {saldoAttuale.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtri e Tabs */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cerca movimento..."
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
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="inizio"
              label="Data inizio"
              type="date"
              value={periodoFiltro.inizio}
              onChange={handlePeriodoChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="fine"
              label="Data fine"
              type="date"
              value={periodoFiltro.fine}
              onChange={handlePeriodoChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              onClick={clearPeriodoFiltro}
              fullWidth
              disabled={!periodoFiltro.inizio && !periodoFiltro.fine}
            >
              Cancella Filtri
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tutti i Movimenti" />
          <Tab
            label="Entrate"
            icon={<TrendingUpIcon color="success" />}
            iconPosition="start"
          />
          <Tab
            label="Uscite"
            icon={<TrendingDownIcon color="error" />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tabella Movimenti */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Descrizione</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell align="right">Importo (€)</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMovimenti.length > 0 ? (
              filteredMovimenti.map((movimento) => (
                <TableRow key={movimento.id}>
                  <TableCell>{movimento.data}</TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        movimento.tipo === "entrata" ? (
                          <TrendingUpIcon />
                        ) : (
                          <TrendingDownIcon />
                        )
                      }
                      label={
                        movimento.tipo === "entrata" ? "Entrata" : "Uscita"
                      }
                      color={movimento.tipo === "entrata" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{movimento.categoria_nome}</TableCell>
                  <TableCell>{movimento.descrizione}</TableCell>
                  <TableCell>{movimento.documento}</TableCell>
                  <TableCell align="right">
                    {movimento.importo.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(movimento)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(movimento.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessun movimento trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Statistiche per categoria */}
      {tabValue !== 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {tabValue === 1
              ? "Statistiche Entrate per Categoria"
              : "Statistiche Uscite per Categoria"}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Importo</TableCell>
                  <TableCell align="right">% sul totale</TableCell>
                  <TableCell align="right">N° Movimenti</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getStatistichePerCategoria(
                  tabValue === 1 ? "entrata" : "uscita"
                ).map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{stat.nome}</TableCell>
                    <TableCell align="right">
                      {stat.totale.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </TableCell>
                    <TableCell align="right">{stat.percentuale}%</TableCell>
                    <TableCell align="right">{stat.conteggio}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Dialog per aggiunta/modifica movimento */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Modifica Movimento" : "Nuovo Movimento"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data"
                label="Data"
                type="date"
                value={currentMovimento.data}
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
                <InputLabel>Tipo Movimento</InputLabel>
                <Select
                  name="tipo"
                  value={currentMovimento.tipo}
                  label="Tipo Movimento"
                  onChange={handleInputChange}
                >
                  <MenuItem value="entrata">Entrata</MenuItem>
                  <MenuItem value="uscita">Uscita</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="importo"
                label="Importo (€)"
                type="number"
                value={currentMovimento.importo}
                onChange={handleInputChange}
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
              <FormControl fullWidth required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="id_categoria"
                  value={currentMovimento.id_categoria}
                  label="Categoria"
                  onChange={handleInputChange}
                >
                  {(currentMovimento.tipo === "entrata"
                    ? categorieEntrate
                    : categorieUscite
                  ).map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="documento"
                label="Documento di riferimento"
                value={currentMovimento.documento}
                onChange={handleInputChange}
                fullWidth
                placeholder="Es. Fattura 123/2024"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descrizione"
                label="Descrizione"
                value={currentMovimento.descrizione}
                onChange={handleInputChange}
                multiline
                rows={2}
                fullWidth
                required
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
            disabled={
              !currentMovimento.data ||
              !currentMovimento.importo ||
              !currentMovimento.id_categoria ||
              !currentMovimento.descrizione
            }
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestioneFinanziaria;
