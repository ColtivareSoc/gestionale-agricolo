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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Dati di esempio per il personale
const SAMPLE_DATA = {
  dipendenti: [
    {
      id: 1,
      nome: "Mario Rossi",
      tipo: "Fisso",
      ruolo: "Operaio agricolo",
      telefono: "333-1234567",
      email: "mario.rossi@example.com",
      dataAssunzione: "15/03/2022",
      attivo: true,
    },
    {
      id: 2,
      nome: "Giulia Bianchi",
      tipo: "Fisso",
      ruolo: "Responsabile magazzino",
      telefono: "333-7654321",
      email: "giulia.bianchi@example.com",
      dataAssunzione: "10/01/2021",
      attivo: true,
    },
    {
      id: 3,
      nome: "Luca Verdi",
      tipo: "Stagionale",
      ruolo: "Raccoglitore",
      telefono: "333-9876543",
      email: "luca.verdi@example.com",
      dataAssunzione: "01/08/2024",
      attivo: true,
    },
    {
      id: 4,
      nome: "Anna Neri",
      tipo: "Stagionale",
      ruolo: "Raccoglitore",
      telefono: "333-3456789",
      email: "anna.neri@example.com",
      dataAssunzione: "01/08/2024",
      attivo: true,
    },
    {
      id: 5,
      nome: "Paolo Gialli",
      tipo: "Fisso",
      ruolo: "Trattorista",
      telefono: "333-8765432",
      email: "paolo.gialli@example.com",
      dataAssunzione: "20/05/2023",
      attivo: true,
    },
    {
      id: 6,
      nome: "Francesca Blu",
      tipo: "Stagionale",
      ruolo: "Confezionamento",
      telefono: "333-2345678",
      email: "francesca.blu@example.com",
      dataAssunzione: "15/09/2024",
      attivo: true,
    },
  ],
  squadre: [
    {
      id: 1,
      nome: "Squadra Raccolta",
      responsabile: "Mario Rossi",
      membri: ["Mario Rossi", "Luca Verdi", "Anna Neri"],
      attivita: "Raccolta frutta",
    },
    {
      id: 2,
      nome: "Squadra Magazzino",
      responsabile: "Giulia Bianchi",
      membri: ["Giulia Bianchi", "Francesca Blu"],
      attivita: "Confezionamento",
    },
    {
      id: 3,
      nome: "Squadra Campo",
      responsabile: "Paolo Gialli",
      membri: ["Paolo Gialli"],
      attivita: "Lavorazioni terreno",
    },
  ],
  turni: [
    {
      id: 1,
      data: "29/04/2025",
      dipendente: "Mario Rossi",
      oreInizio: "07:00",
      oreFine: "15:00",
      attivita: "Raccolta mele - Campo 2",
      oreEffettive: 8,
    },
    {
      id: 2,
      data: "29/04/2025",
      dipendente: "Giulia Bianchi",
      oreInizio: "08:00",
      oreFine: "16:00",
      attivita: "Gestione magazzino",
      oreEffettive: 8,
    },
    {
      id: 3,
      data: "29/04/2025",
      dipendente: "Luca Verdi",
      oreInizio: "07:00",
      oreFine: "15:00",
      attivita: "Raccolta mele - Campo 2",
      oreEffettive: 8,
    },
    {
      id: 4,
      data: "29/04/2025",
      dipendente: "Anna Neri",
      oreInizio: "07:00",
      oreFine: "15:00",
      attivita: "Raccolta mele - Campo 2",
      oreEffettive: 8,
    },
    {
      id: 5,
      data: "29/04/2025",
      dipendente: "Paolo Gialli",
      oreInizio: "06:30",
      oreFine: "14:30",
      attivita: "Preparazione terreno - Campo 4",
      oreEffettive: 8,
    },
    {
      id: 6,
      data: "29/04/2025",
      dipendente: "Francesca Blu",
      oreInizio: "08:00",
      oreFine: "16:00",
      attivita: "Confezionamento mele",
      oreEffettive: 8,
    },
  ],
};

// Componente principale
const GestionePersonale = () => {
  // Stati
  const [tabValue, setTabValue] = useState(0);
  const [openDipendenteDialog, setOpenDipendenteDialog] = useState(false);
  const [openSquadraDialog, setOpenSquadraDialog] = useState(false);
  const [openTurnoDialog, setOpenTurnoDialog] = useState(false);
  const [dipendenti, setDipendenti] = useState(SAMPLE_DATA.dipendenti);
  const [squadre, setSquadre] = useState(SAMPLE_DATA.squadre);
  const [turni, setTurni] = useState(SAMPLE_DATA.turni);
  const [currentDipendente, setCurrentDipendente] = useState({
    nome: "",
    tipo: "Fisso",
    ruolo: "",
    telefono: "",
    email: "",
    dataAssunzione: "",
    attivo: true,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Gestisce il cambio della tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filtra i dipendenti in base al termine di ricerca
  const filteredDipendenti = dipendenti.filter(
    (dip) =>
      dip.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dip.ruolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dip.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apre il dialog per aggiungere un nuovo dipendente
  const handleAddDipendente = () => {
    setCurrentDipendente({
      nome: "",
      tipo: "Fisso",
      ruolo: "",
      telefono: "",
      email: "",
      dataAssunzione: "",
      attivo: true,
    });
    setOpenDipendenteDialog(true);
  };

  // Apre il dialog per modificare un dipendente esistente
  const handleEditDipendente = (dip) => {
    setCurrentDipendente({ ...dip });
    setOpenDipendenteDialog(true);
  };

  // Salva un dipendente (nuovo o modificato)
  const handleSaveDipendente = () => {
    if (currentDipendente.id) {
      // Modifica di un dipendente esistente
      setDipendenti(
        dipendenti.map((dip) =>
          dip.id === currentDipendente.id ? currentDipendente : dip
        )
      );
    } else {
      // Aggiunta di un nuovo dipendente
      const newDipendente = {
        ...currentDipendente,
        id: Math.max(...dipendenti.map((d) => d.id), 0) + 1,
      };
      setDipendenti([...dipendenti, newDipendente]);
    }
    setOpenDipendenteDialog(false);
  };

  // Gestisce l'eliminazione di un dipendente
  const handleDeleteDipendente = (id) => {
    setDipendenti(dipendenti.filter((dip) => dip.id !== id));
  };

  // Gestisce il cambio dei campi del form dipendente
  const handleDipendenteChange = (e) => {
    const { name, value } = e.target;
    setCurrentDipendente({
      ...currentDipendente,
      [name]: value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestione Personale
      </Typography>

      <Paper sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonIcon />} label="Anagrafica Dipendenti" />
          <Tab icon={<GroupIcon />} label="Squadre di Lavoro" />
          <Tab icon={<WorkIcon />} label="Turni e Presenze" />
        </Tabs>
      </Paper>

      {/* Tab 1: Anagrafica Dipendenti */}
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
            <TextField
              label="Cerca dipendente"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDipendente}
            >
              Nuovo Dipendente
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ruolo</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Data Assunzione</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDipendenti.map((dip) => (
                  <TableRow key={dip.id}>
                    <TableCell>{dip.nome}</TableCell>
                    <TableCell>{dip.tipo}</TableCell>
                    <TableCell>{dip.ruolo}</TableCell>
                    <TableCell>{dip.telefono}</TableCell>
                    <TableCell>{dip.email}</TableCell>
                    <TableCell>{dip.dataAssunzione}</TableCell>
                    <TableCell>
                      <Chip
                        label={dip.attivo ? "Attivo" : "Inattivo"}
                        color={dip.attivo ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEditDipendente(dip)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDipendente(dip.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog per aggiungere/modificare dipendente */}
          <Dialog
            open={openDipendenteDialog}
            onClose={() => setOpenDipendenteDialog(false)}
          >
            <DialogTitle>
              {currentDipendente.id
                ? "Modifica Dipendente"
                : "Nuovo Dipendente"}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome e Cognome"
                    name="nome"
                    value={currentDipendente.nome}
                    onChange={handleDipendenteChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      name="tipo"
                      value={currentDipendente.tipo}
                      onChange={handleDipendenteChange}
                      label="Tipo"
                    >
                      <MenuItem value="Fisso">Fisso</MenuItem>
                      <MenuItem value="Stagionale">Stagionale</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ruolo"
                    name="ruolo"
                    value={currentDipendente.ruolo}
                    onChange={handleDipendenteChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefono"
                    name="telefono"
                    value={currentDipendente.telefono}
                    onChange={handleDipendenteChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={currentDipendente.email}
                    onChange={handleDipendenteChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Assunzione"
                    name="dataAssunzione"
                    placeholder="GG/MM/AAAA"
                    value={currentDipendente.dataAssunzione}
                    onChange={handleDipendenteChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Stato</InputLabel>
                    <Select
                      name="attivo"
                      value={currentDipendente.attivo}
                      onChange={handleDipendenteChange}
                      label="Stato"
                    >
                      <MenuItem value={true}>Attivo</MenuItem>
                      <MenuItem value={false}>Inattivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDipendenteDialog(false)}>
                Annulla
              </Button>
              <Button onClick={handleSaveDipendente} variant="contained">
                Salva
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Tab 2: Squadre di Lavoro */}
      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenSquadraDialog(true)}
            >
              Nuova Squadra
            </Button>
          </Box>

          <Grid container spacing={3}>
            {squadre.map((squadra) => (
              <Grid item xs={12} md={6} lg={4} key={squadra.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {squadra.nome}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Responsabile: {squadra.responsabile}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Attività: {squadra.attivita}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Membri:
                    </Typography>
                    <Box>
                      {squadra.membri.map((membro, index) => (
                        <Chip
                          key={index}
                          label={membro}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 3: Turni e Presenze */}
      {tabValue === 2 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <TextField
                label="Data"
                placeholder="GG/MM/AAAA"
                size="small"
                defaultValue="29/04/2025"
                sx={{ width: 150, mr: 2 }}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenTurnoDialog(true)}
            >
              Nuovo Turno
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Dipendente</TableCell>
                  <TableCell>Orario</TableCell>
                  <TableCell>Attività</TableCell>
                  <TableCell align="right">Ore</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turni.map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell>{turno.data}</TableCell>
                    <TableCell>{turno.dipendente}</TableCell>
                    <TableCell>
                      {turno.oreInizio} - {turno.oreFine}
                    </TableCell>
                    <TableCell>{turno.attivita}</TableCell>
                    <TableCell align="right">{turno.oreEffettive}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Riepilogo ore e costi */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ore Totali
                  </Typography>
                  <Typography variant="h4">48</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dipendenti Attivi
                  </Typography>
                  <Typography variant="h4">6</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Costo Manodopera
                  </Typography>
                  <Typography variant="h4">€ 720</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Costo Medio Orario
                  </Typography>
                  <Typography variant="h4">€ 15</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default GestionePersonale;
