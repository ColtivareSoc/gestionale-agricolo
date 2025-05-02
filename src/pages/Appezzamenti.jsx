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
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

// Dati di esempio per gli appezzamenti
const appezzamentiMock = [
  {
    id: 1,
    codice: "APP001",
    nome: "Campo Grande",
    superficie_ha: 2.5,
    ubicazione: "Via dei Campi 123",
    tipo_terreno: "Argilloso",
    note: "Irrigazione a goccia",
  },
  {
    id: 2,
    codice: "APP002",
    nome: "Vigna Nord",
    superficie_ha: 1.8,
    ubicazione: "Strada Provinciale 45",
    tipo_terreno: "Sabbioso",
    note: "Vicino al fiume",
  },
];

// Dati di esempio per i prodotti
const prodottiMock = [
  { id: 1, codice: "MELE001", nome: "Mele", varieta: "Golden Delicious" },
  { id: 2, codice: "PERE001", nome: "Pere", varieta: "Abate" },
  { id: 3, codice: "PESC001", nome: "Pesche", varieta: "Gialla" },
  { id: 4, codice: "NOCC001", nome: "Nocciole", varieta: "Tonda Gentile" },
];

// Dati di esempio per le coltivazioni
const coltivazioniMock = [
  {
    id: 1,
    id_appezzamento: 1,
    id_prodotto: 1,
    anno: 2024,
    superficie_ha: 1.5,
    data_inizio: "2024-03-15",
    data_fine_prevista: "2024-10-30",
    stato: "in_corso",
  },
  {
    id: 2,
    id_appezzamento: 1,
    id_prodotto: 2,
    anno: 2024,
    superficie_ha: 1.0,
    data_inizio: "2024-03-20",
    data_fine_prevista: "2024-09-30",
    stato: "in_corso",
  },
  {
    id: 3,
    id_appezzamento: 2,
    id_prodotto: 4,
    anno: 2024,
    superficie_ha: 1.8,
    data_inizio: "2024-01-10",
    data_fine_prevista: "2024-11-15",
    stato: "in_corso",
  },
];

const Appezzamenti = () => {
  const [appezzamenti] = useState(appezzamentiMock);
  const [prodotti] = useState(prodottiMock);
  const [coltivazioni, setColtivazioni] = useState(coltivazioniMock);
  const [selectedTab, setSelectedTab] = useState(0);
  const [appezzamentoSelezionato, setAppezzamentoSelezionato] = useState(null);
  const [dialogColtivazioneOpen, setDialogColtivazioneOpen] = useState(false);
  const [currentColtivazione, setCurrentColtivazione] = useState({
    id_appezzamento: "",
    id_prodotto: "",
    anno: new Date().getFullYear(),
    superficie_ha: "",
    data_inizio: new Date().toISOString().split("T")[0],
    data_fine_prevista: "",
    stato: "in_corso",
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRowClick = (appezzamento) => {
    setAppezzamentoSelezionato(appezzamento);
    setSelectedTab(1); // Passa alla scheda "Coltivazioni"
  };

  const handleOpenDialogColtivazione = () => {
    setCurrentColtivazione({
      id_appezzamento: appezzamentoSelezionato.id,
      id_prodotto: "",
      anno: new Date().getFullYear(),
      superficie_ha: "",
      data_inizio: new Date().toISOString().split("T")[0],
      data_fine_prevista: "",
      stato: "in_corso",
    });
    setDialogColtivazioneOpen(true);
  };

  const handleCloseDialogColtivazione = () => {
    setDialogColtivazioneOpen(false);
  };

  const handleColtivazioneInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentColtivazione({
      ...currentColtivazione,
      [name]: value,
    });
  };

  const handleSaveColtivazione = () => {
    // Crea nuova coltivazione
    const newColtivazione = {
      ...currentColtivazione,
      id: Math.max(...coltivazioni.map((c) => c.id), 0) + 1,
    };
    setColtivazioni([...coltivazioni, newColtivazione]);
    handleCloseDialogColtivazione();
  };

  const handleDeleteColtivazione = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa coltivazione?")) {
      setColtivazioni(coltivazioni.filter((item) => item.id !== id));
    }
  };

  // Filtra le coltivazioni per l'appezzamento selezionato
  const coltivazioniAppezzamento = coltivazioni.filter(
    (c) => c.id_appezzamento === appezzamentoSelezionato?.id
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Gestione Appezzamenti
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Nuovo Appezzamento
        </Button>
      </Box>

      {/* Schede */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Elenco Appezzamenti" />
          {appezzamentoSelezionato && (
            <Tab label={`Coltivazioni: ${appezzamentoSelezionato.nome}`} />
          )}
        </Tabs>
      </Box>

      {selectedTab === 0 ? (
        // Scheda Elenco Appezzamenti
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codice</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Superficie (ha)</TableCell>
                <TableCell>Ubicazione</TableCell>
                <TableCell>Tipo Terreno</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="center">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appezzamenti.map((appezzamento) => (
                <TableRow
                  key={appezzamento.id}
                  hover
                  onClick={() => handleRowClick(appezzamento)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{appezzamento.codice}</TableCell>
                  <TableCell>{appezzamento.nome}</TableCell>
                  <TableCell align="right">
                    {appezzamento.superficie_ha}
                  </TableCell>
                  <TableCell>{appezzamento.ubicazione}</TableCell>
                  <TableCell>{appezzamento.tipo_terreno}</TableCell>
                  <TableCell>{appezzamento.note}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Scheda Coltivazioni
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              Coltivazioni nell'appezzamento: {appezzamentoSelezionato?.nome}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialogColtivazione}
            >
              Nuova Coltivazione
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Prodotto</TableCell>
                  <TableCell>Varietà</TableCell>
                  <TableCell>Anno</TableCell>
                  <TableCell align="right">Superficie (ha)</TableCell>
                  <TableCell>Data Inizio</TableCell>
                  <TableCell>Data Fine Prevista</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="center">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coltivazioniAppezzamento.length > 0 ? (
                  coltivazioniAppezzamento.map((coltivazione) => {
                    const prodotto = prodotti.find(
                      (p) => p.id === coltivazione.id_prodotto
                    );
                    return (
                      <TableRow key={coltivazione.id}>
                        <TableCell>{prodotto?.nome || "N/D"}</TableCell>
                        <TableCell>{prodotto?.varieta || "N/D"}</TableCell>
                        <TableCell>{coltivazione.anno}</TableCell>
                        <TableCell align="right">
                          {coltivazione.superficie_ha}
                        </TableCell>
                        <TableCell>{coltivazione.data_inizio}</TableCell>
                        <TableCell>{coltivazione.data_fine_prevista}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              coltivazione.stato === "in_corso"
                                ? "In corso"
                                : coltivazione.stato === "completata"
                                ? "Completata"
                                : "Pianificata"
                            }
                            color={
                              coltivazione.stato === "in_corso"
                                ? "primary"
                                : coltivazione.stato === "completata"
                                ? "success"
                                : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteColtivazione(coltivazione.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nessuna coltivazione presente in questo appezzamento
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Dialog per aggiunta coltivazione */}
      <Dialog
        open={dialogColtivazioneOpen}
        onClose={handleCloseDialogColtivazione}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuova Coltivazione</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Prodotto</InputLabel>
                <Select
                  name="id_prodotto"
                  value={currentColtivazione.id_prodotto}
                  label="Prodotto"
                  onChange={handleColtivazioneInputChange}
                >
                  {prodotti.map((prodotto) => (
                    <MenuItem key={prodotto.id} value={prodotto.id}>
                      {prodotto.nome} - {prodotto.varieta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="anno"
                label="Anno"
                type="number"
                value={currentColtivazione.anno}
                onChange={handleColtivazioneInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="superficie_ha"
                label="Superficie (ha)"
                type="number"
                value={currentColtivazione.superficie_ha}
                onChange={handleColtivazioneInputChange}
                fullWidth
                required
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Stato</InputLabel>
                <Select
                  name="stato"
                  value={currentColtivazione.stato}
                  label="Stato"
                  onChange={handleColtivazioneInputChange}
                >
                  <MenuItem value="pianificata">Pianificata</MenuItem>
                  <MenuItem value="in_corso">In Corso</MenuItem>
                  <MenuItem value="completata">Completata</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data_inizio"
                label="Data Inizio"
                type="date"
                value={currentColtivazione.data_inizio}
                onChange={handleColtivazioneInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="data_fine_prevista"
                label="Data Fine Prevista"
                type="date"
                value={currentColtivazione.data_fine_prevista}
                onChange={handleColtivazioneInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogColtivazione}
            startIcon={<CloseIcon />}
          >
            Annulla
          </Button>
          <Button
            onClick={handleSaveColtivazione}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appezzamenti;
