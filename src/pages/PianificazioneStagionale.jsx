import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

// Dati di esempio per la pianificazione
const SAMPLE_DATA = {
  attivitaPianificate: [
    {
      id: 1,
      titolo: "Trattamento anti-oidio",
      appezzamento: "Campo 2",
      tipologia: "Trattamento",
      priorita: "Alta",
      dataInizio: "03/05/2025",
      dataFine: "03/05/2025",
      stato: "Da completare",
      note: "Utilizzare prodotto XYZ, dosaggio 2kg/ha",
    },
    {
      id: 2,
      titolo: "Concimazione azotata",
      appezzamento: "Campo 1",
      tipologia: "Concimazione",
      priorita: "Media",
      dataInizio: "10/05/2025",
      dataFine: "10/05/2025",
      stato: "Da completare",
      note: "Utilizzare concime NPK 20-10-10, dosaggio 250kg/ha",
    },
    {
      id: 3,
      titolo: "Potatura verde",
      appezzamento: "Campo 3",
      tipologia: "Potatura",
      priorita: "Bassa",
      dataInizio: "15/05/2025",
      dataFine: "20/05/2025",
      stato: "Da completare",
      note: "Verificare carica produttiva e diradare se necessario",
    },
    {
      id: 4,
      titolo: "Sfalcio interfila",
      appezzamento: "Campo 1",
      tipologia: "Lavorazione suolo",
      priorita: "Media",
      dataInizio: "08/05/2025",
      dataFine: "08/05/2025",
      stato: "Da completare",
      note: "Utilizzare trinciaerba con trattore piccolo",
    },
    {
      id: 5,
      titolo: "Irrigazione",
      appezzamento: "Campo 4",
      tipologia: "Irrigazione",
      priorita: "Alta",
      dataInizio: "05/05/2025",
      dataFine: "05/05/2025",
      stato: "Completata",
      note: "20mm di acqua. Verificare umidità del terreno prima di procedere",
    },
  ],

  appezzamenti: [
    { id: 1, nome: "Campo 1", superficie: 3.5, coltura: "Mele Golden" },
    { id: 2, nome: "Campo 2", superficie: 2.8, coltura: "Mele Fuji" },
    { id: 3, nome: "Campo 3", superficie: 4.0, coltura: "Mele Gala" },
    { id: 4, nome: "Campo 4", superficie: 2.2, coltura: "Mele Renetta" },
  ],

  tipologieAttivita: [
    "Trattamento",
    "Concimazione",
    "Potatura",
    "Lavorazione suolo",
    "Irrigazione",
    "Raccolta",
    "Diradamento",
    "Manutenzione",
  ],

  modelli: [
    {
      id: 1,
      nome: "Piano trattamenti mele standard",
      descrizione: "Piano di difesa standard per le mele",
      attivita: 10,
    },
    {
      id: 2,
      nome: "Piano concimazioni annuali",
      descrizione: "Piano di concimazione standard per frutteto",
      attivita: 5,
    },
    {
      id: 3,
      nome: "Piano gestione irrigazione estiva",
      descrizione: "Piano per irrigazione nei mesi estivi",
      attivita: 8,
    },
  ],
};

// Componente principale
const PianificazioneStagionale = () => {
  // Stati
  const [tabValue, setTabValue] = useState(0);
  const [vistaCalendario, setVistaCalendario] = useState("settimana");
  const [attivita, setAttivita] = useState(SAMPLE_DATA.attivitaPianificate);
  const [openAttivitaDialog, setOpenAttivitaDialog] = useState(false);
  const [currentAttivita, setCurrentAttivita] = useState({
    titolo: "",
    appezzamento: "",
    tipologia: "",
    priorita: "Media",
    dataInizio: "",
    dataFine: "",
    stato: "Da completare",
    note: "",
  });
  const [filtro, setFiltro] = useState({
    appezzamento: "Tutti",
    tipologia: "Tutte",
    stato: "Tutti",
    priorita: "Tutte",
  });
  const [openFiltroDialog, setOpenFiltroDialog] = useState(false);

  // Gestisce il cambio della tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestisce il cambio della vista calendario
  const handleVistaCalendarioChange = (event, newValue) => {
    setVistaCalendario(newValue);
  };

  // Filtra le attività
  const filteredAttivita = attivita.filter((att) => {
    return (
      (filtro.appezzamento === "Tutti" ||
        att.appezzamento === filtro.appezzamento) &&
      (filtro.tipologia === "Tutte" || att.tipologia === filtro.tipologia) &&
      (filtro.stato === "Tutti" || att.stato === filtro.stato) &&
      (filtro.priorita === "Tutte" || att.priorita === filtro.priorita)
    );
  });

  // Apre il dialog per aggiungere una nuova attività
  const handleAddAttivita = () => {
    setCurrentAttivita({
      titolo: "",
      appezzamento: "",
      tipologia: "",
      priorita: "Media",
      dataInizio: "",
      dataFine: "",
      stato: "Da completare",
      note: "",
    });
    setOpenAttivitaDialog(true);
  };

  // Apre il dialog per modificare un'attività esistente
  const handleEditAttivita = (att) => {
    setCurrentAttivita({ ...att });
    setOpenAttivitaDialog(true);
  };

  // Salva un'attività (nuova o modificata)
  const handleSaveAttivita = () => {
    if (currentAttivita.id) {
      // Modifica di un'attività esistente
      setAttivita(
        attivita.map((att) =>
          att.id === currentAttivita.id ? currentAttivita : att
        )
      );
    } else {
      // Aggiunta di una nuova attività
      const newAttivita = {
        ...currentAttivita,
        id: Math.max(...attivita.map((a) => a.id), 0) + 1,
      };
      setAttivita([...attivita, newAttivita]);
    }
    setOpenAttivitaDialog(false);
  };

  // Gestisce l'eliminazione di un'attività
  const handleDeleteAttivita = (id) => {
    setAttivita(attivita.filter((att) => att.id !== id));
  };

  // Gestisce il cambio dei campi del form attività
  const handleAttivitaChange = (e) => {
    const { name, value } = e.target;
    setCurrentAttivita({
      ...currentAttivita,
      [name]: value,
    });
  };

  // Gestisce il cambio stato di un'attività
  const handleChangeStato = (id, nuovoStato) => {
    setAttivita(
      attivita.map((att) =>
        att.id === id ? { ...att, stato: nuovoStato } : att
      )
    );
  };

  // Gestisce il cambio dei filtri
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Pianificazione Stagionale
      </Typography>

      <Paper sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<TodayIcon />} label="Calendario Attività" />
          <Tab icon={<DateRangeIcon />} label="Modelli di Pianificazione" />
          <Tab icon={<ScheduleIcon />} label="Storico Attività" />
        </Tabs>
      </Paper>

      {/* Tab 1: Calendario Attività */}
      {tabValue === 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Tabs
              value={vistaCalendario}
              onChange={handleVistaCalendarioChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
            >
              <Tab value="giorno" label="Giorno" />
              <Tab value="settimana" label="Settimana" />
              <Tab value="mese" label="Mese" />
            </Tabs>

            <Box>
              <Button
                startIcon={<FilterListIcon />}
                variant="outlined"
                onClick={() => setOpenFiltroDialog(true)}
                sx={{ mr: 1 }}
              >
                Filtri
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAttivita}
              >
                Nuova Attività
              </Button>
            </Box>
          </Box>

          {vistaCalendario === "giorno" && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Martedì, 29 Aprile 2025
              </Typography>

              <Paper sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
                  Non ci sono attività pianificate per oggi.
                </Typography>
              </Paper>
            </Box>
          )}

          {vistaCalendario === "settimana" && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Settimana 18, 28 Aprile - 4 Maggio 2025
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Attività</TableCell>
                      <TableCell>Appezzamento</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Tipologia</TableCell>
                      <TableCell>Priorità</TableCell>
                      <TableCell>Stato</TableCell>
                      <TableCell align="right">Azioni</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttivita
                      .filter((att) => {
                        // Filtra solo le attività della settimana corrente (per questa demo)
                        return (
                          att.dataInizio === "03/05/2025" ||
                          att.dataInizio === "05/05/2025"
                        );
                      })
                      .map((att) => (
                        <TableRow key={att.id}>
                          <TableCell>{att.titolo}</TableCell>
                          <TableCell>{att.appezzamento}</TableCell>
                          <TableCell>{att.dataInizio}</TableCell>
                          <TableCell>{att.tipologia}</TableCell>
                          <TableCell>
                            <Chip
                              label={att.priorita}
                              color={
                                att.priorita === "Alta"
                                  ? "error"
                                  : att.priorita === "Media"
                                  ? "warning"
                                  : "success"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                value={att.stato}
                                onChange={(e) =>
                                  handleChangeStato(att.id, e.target.value)
                                }
                                displayEmpty
                                size="small"
                              >
                                <MenuItem value="Da completare">
                                  Da completare
                                </MenuItem>
                                <MenuItem value="In corso">In corso</MenuItem>
                                <MenuItem value="Completata">
                                  Completata
                                </MenuItem>
                                <MenuItem value="Posticipata">
                                  Posticipata
                                </MenuItem>
                                <MenuItem value="Annullata">Annullata</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditAttivita(att)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAttivita(att.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {vistaCalendario === "mese" && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Maggio 2025
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Attività</TableCell>
                      <TableCell>Appezzamento</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Tipologia</TableCell>
                      <TableCell>Priorità</TableCell>
                      <TableCell>Stato</TableCell>
                      <TableCell align="right">Azioni</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttivita
                      .sort((a, b) => {
                        // Ordina per data
                        const dateA = a.dataInizio
                          .split("/")
                          .reverse()
                          .join("");
                        const dateB = b.dataInizio
                          .split("/")
                          .reverse()
                          .join("");
                        return dateA.localeCompare(dateB);
                      })
                      .map((att) => (
                        <TableRow key={att.id}>
                          <TableCell>{att.titolo}</TableCell>
                          <TableCell>{att.appezzamento}</TableCell>
                          <TableCell>{att.dataInizio}</TableCell>
                          <TableCell>{att.tipologia}</TableCell>
                          <TableCell>
                            <Chip
                              label={att.priorita}
                              color={
                                att.priorita === "Alta"
                                  ? "error"
                                  : att.priorita === "Media"
                                  ? "warning"
                                  : "success"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                value={att.stato}
                                onChange={(e) =>
                                  handleChangeStato(att.id, e.target.value)
                                }
                                displayEmpty
                                size="small"
                              >
                                <MenuItem value="Da completare">
                                  Da completare
                                </MenuItem>
                                <MenuItem value="In corso">In corso</MenuItem>
                                <MenuItem value="Completata">
                                  Completata
                                </MenuItem>
                                <MenuItem value="Posticipata">
                                  Posticipata
                                </MenuItem>
                                <MenuItem value="Annullata">Annullata</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditAttivita(att)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAttivita(att.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Dialog per filtri */}
          <Dialog
            open={openFiltroDialog}
            onClose={() => setOpenFiltroDialog(false)}
          >
            <DialogTitle>Filtra Attività</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Appezzamento</InputLabel>
                    <Select
                      name="appezzamento"
                      value={filtro.appezzamento}
                      onChange={handleFiltroChange}
                      label="Appezzamento"
                    >
                      <MenuItem value="Tutti">Tutti gli appezzamenti</MenuItem>
                      {SAMPLE_DATA.appezzamenti.map((app) => (
                        <MenuItem key={app.id} value={app.nome}>
                          {app.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipologia</InputLabel>
                    <Select
                      name="tipologia"
                      value={filtro.tipologia}
                      onChange={handleFiltroChange}
                      label="Tipologia"
                    >
                      <MenuItem value="Tutte">Tutte le tipologie</MenuItem>
                      {SAMPLE_DATA.tipologieAttivita.map((tipo, idx) => (
                        <MenuItem key={idx} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Stato</InputLabel>
                    <Select
                      name="stato"
                      value={filtro.stato}
                      onChange={handleFiltroChange}
                      label="Stato"
                    >
                      <MenuItem value="Tutti">Tutti gli stati</MenuItem>
                      <MenuItem value="Da completare">Da completare</MenuItem>
                      <MenuItem value="In corso">In corso</MenuItem>
                      <MenuItem value="Completata">Completata</MenuItem>
                      <MenuItem value="Posticipata">Posticipata</MenuItem>
                      <MenuItem value="Annullata">Annullata</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priorità</InputLabel>
                    <Select
                      name="priorita"
                      value={filtro.priorita}
                      onChange={handleFiltroChange}
                      label="Priorità"
                    >
                      <MenuItem value="Tutte">Tutte le priorità</MenuItem>
                      <MenuItem value="Alta">Alta</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Bassa">Bassa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenFiltroDialog(false)}>Chiudi</Button>
              <Button
                onClick={() =>
                  setFiltro({
                    appezzamento: "Tutti",
                    tipologia: "Tutte",
                    stato: "Tutti",
                    priorita: "Tutte",
                  })
                }
              >
                Reset Filtri
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog per aggiungere/modificare attività */}
          <Dialog
            open={openAttivitaDialog}
            onClose={() => setOpenAttivitaDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {currentAttivita.id ? "Modifica Attività" : "Nuova Attività"}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Titolo Attività"
                    name="titolo"
                    value={currentAttivita.titolo}
                    onChange={handleAttivitaChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Appezzamento</InputLabel>
                    <Select
                      name="appezzamento"
                      value={currentAttivita.appezzamento}
                      onChange={handleAttivitaChange}
                      label="Appezzamento"
                    >
                      {SAMPLE_DATA.appezzamenti.map((app) => (
                        <MenuItem key={app.id} value={app.nome}>
                          {app.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipologia</InputLabel>
                    <Select
                      name="tipologia"
                      value={currentAttivita.tipologia}
                      onChange={handleAttivitaChange}
                      label="Tipologia"
                    >
                      {SAMPLE_DATA.tipologieAttivita.map((tipo, idx) => (
                        <MenuItem key={idx} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Inizio"
                    name="dataInizio"
                    placeholder="GG/MM/AAAA"
                    value={currentAttivita.dataInizio}
                    onChange={handleAttivitaChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Fine"
                    name="dataFine"
                    placeholder="GG/MM/AAAA"
                    value={currentAttivita.dataFine}
                    onChange={handleAttivitaChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priorità</InputLabel>
                    <Select
                      name="priorita"
                      value={currentAttivita.priorita}
                      onChange={handleAttivitaChange}
                      label="Priorità"
                    >
                      <MenuItem value="Alta">Alta</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Bassa">Bassa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Stato</InputLabel>
                    <Select
                      name="stato"
                      value={currentAttivita.stato}
                      onChange={handleAttivitaChange}
                      label="Stato"
                    >
                      <MenuItem value="Da completare">Da completare</MenuItem>
                      <MenuItem value="In corso">In corso</MenuItem>
                      <MenuItem value="Completata">Completata</MenuItem>
                      <MenuItem value="Posticipata">Posticipata</MenuItem>
                      <MenuItem value="Annullata">Annullata</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Note"
                    name="note"
                    value={currentAttivita.note}
                    onChange={handleAttivitaChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAttivitaDialog(false)}>
                Annulla
              </Button>
              <Button onClick={handleSaveAttivita} variant="contained">
                Salva
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Tab 2: Modelli di Pianificazione */}
      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Nuovo Modello
            </Button>
          </Box>

          <Grid container spacing={3}>
            {SAMPLE_DATA.modelli.map((modello) => (
              <Grid item xs={12} md={6} lg={4} key={modello.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {modello.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {modello.descrizione}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      <strong>Numero attività:</strong> {modello.attivita}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button variant="outlined" size="small">
                        Visualizza Dettagli
                      </Button>
                      <Button variant="contained" size="small" color="primary">
                        Applica Modello
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 3: Storico Attività */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Attività Completate
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attività</TableCell>
                  <TableCell>Appezzamento</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipologia</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attivita
                  .filter((att) => att.stato === "Completata")
                  .map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>{att.titolo}</TableCell>
                      <TableCell>{att.appezzamento}</TableCell>
                      <TableCell>{att.dataInizio}</TableCell>
                      <TableCell>{att.tipologia}</TableCell>
                      <TableCell>{att.note}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Attività Annullate o Posticipate
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attività</TableCell>
                  <TableCell>Appezzamento</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nessuna attività annullata o posticipata da visualizzare.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default PianificazioneStagionale;
