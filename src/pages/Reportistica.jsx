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
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import {
  AssessmentOutlined as AssessmentIcon,
  FilterList as FilterListIcon,
  SaveAlt as SaveAltIcon,
  Print as PrintIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Dati di esempio per i grafici e le tabelle
const SAMPLE_DATA = {
  costi: [
    { categoria: "Manodopera", valore: 15000, percentuale: 35 },
    { categoria: "Fitosanitari", valore: 8500, percentuale: 20 },
    { categoria: "Concimi", valore: 6000, percentuale: 14 },
    { categoria: "Carburante", valore: 5000, percentuale: 12 },
    { categoria: "Irrigazione", valore: 3500, percentuale: 8 },
    { categoria: "Materiali", valore: 2500, percentuale: 6 },
    { categoria: "Altro", valore: 2000, percentuale: 5 },
  ],
  ricavi: [
    { prodotto: "Mele Golden", valore: 28000, percentuale: 42 },
    { prodotto: "Mele Fuji", valore: 18000, percentuale: 27 },
    { prodotto: "Mele Gala", valore: 12000, percentuale: 18 },
    { prodotto: "Mele Renetta", valore: 8500, percentuale: 13 },
  ],
  appezzamenti: [
    {
      nome: "Campo 1",
      costi: 12500,
      ricavi: 28000,
      utile: 15500,
      superficie: 3.5,
    },
    {
      nome: "Campo 2",
      costi: 10800,
      ricavi: 18000,
      utile: 7200,
      superficie: 2.8,
    },
    {
      nome: "Campo 3",
      costi: 15200,
      ricavi: 20500,
      utile: 5300,
      superficie: 4.0,
    },
    {
      nome: "Campo 4",
      costi: 8500,
      ricavi: 12000,
      utile: 3500,
      superficie: 2.2,
    },
  ],
  venditeMensili: [
    { mese: "Gennaio", valore: 0 },
    { mese: "Febbraio", valore: 0 },
    { mese: "Marzo", valore: 0 },
    { mese: "Aprile", valore: 0 },
    { mese: "Maggio", valore: 0 },
    { mese: "Giugno", valore: 0 },
    { mese: "Luglio", valore: 0 },
    { mese: "Agosto", valore: 5000 },
    { mese: "Settembre", valore: 22000 },
    { mese: "Ottobre", valore: 33000 },
    { mese: "Novembre", valore: 18000 },
    { mese: "Dicembre", valore: 8500 },
  ],
  anni: ["2023", "2024", "2025"],
};

// Componente principale
const Reportistica = () => {
  // Stati
  const [tabValue, setTabValue] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedAppezzamento, setSelectedAppezzamento] = useState("Tutti");
  const [filterOpen, setFilterOpen] = useState(false);

  // Gestisce il cambio della tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Analisi e Reportistica
        </Typography>
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            onClick={() => setFilterOpen(!filterOpen)}
            sx={{ mr: 1 }}
          >
            Filtri
          </Button>
          <Button startIcon={<SaveAltIcon />} variant="outlined" sx={{ mr: 1 }}>
            Esporta
          </Button>
          <Button startIcon={<PrintIcon />} variant="outlined">
            Stampa
          </Button>
        </Box>
      </Box>

      {filterOpen && (
        <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, mr: 2 }}
          >
            <InputLabel>Anno</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Anno"
            >
              {SAMPLE_DATA.anni.map((anno) => (
                <MenuItem key={anno} value={anno}>
                  {anno}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 200, mr: 2 }}
          >
            <InputLabel>Appezzamento</InputLabel>
            <Select
              value={selectedAppezzamento}
              onChange={(e) => setSelectedAppezzamento(e.target.value)}
              label="Appezzamento"
            >
              <MenuItem value="Tutti">Tutti gli appezzamenti</MenuItem>
              {SAMPLE_DATA.appezzamenti.map((app) => (
                <MenuItem key={app.nome} value={app.nome}>
                  {app.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Dal"
            type="text"
            placeholder="GG/MM/AAAA"
            sx={{ mr: 2, width: 150 }}
          />

          <TextField
            size="small"
            label="Al"
            type="text"
            placeholder="GG/MM/AAAA"
            sx={{ mr: 2, width: 150 }}
          />

          <Button variant="contained">Applica Filtri</Button>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            onClick={() => setFilterOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Paper>
      )}

      <Paper sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<AssessmentIcon />} label="Costi-Ricavi" />
          <Tab icon={<AssessmentIcon />} label="Produttività" />
          <Tab icon={<AssessmentIcon />} label="Vendite" />
          <Tab icon={<AssessmentIcon />} label="Appezzamenti" />
        </Tabs>
      </Paper>

      {/* Tab 1: Analisi Costi-Ricavi */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Analisi Costi-Ricavi - {selectedYear}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Riepilogo Finanziario" />
                <CardContent>
                  <Typography variant="h6">Ricavi Totali</Typography>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    € 66,500.00
                  </Typography>

                  <Typography variant="h6">Costi Totali</Typography>
                  <Typography variant="h4" color="error.main" gutterBottom>
                    € 42,500.00
                  </Typography>

                  <Typography variant="h6">Utile/Perdita</Typography>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    € 24,000.00
                  </Typography>

                  <Typography variant="h6">Margine</Typography>
                  <Typography variant="h4" gutterBottom>
                    36.1%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader title="Rappresentazione grafica" />
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    [Qui verrebbe mostrato un grafico a barre che confronta
                    costi e ricavi per mese]
                  </Typography>
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed grey",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visualizzazione grafico (simulata)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Ripartizione Costi" />
                <CardContent>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Categoria</TableCell>
                          <TableCell align="right">Importo</TableCell>
                          <TableCell align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SAMPLE_DATA.costi.map((row) => (
                          <TableRow key={row.categoria}>
                            <TableCell component="th" scope="row">
                              {row.categoria}
                            </TableCell>
                            <TableCell align="right">
                              € {row.valore.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {row.percentuale}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Ripartizione Ricavi" />
                <CardContent>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Prodotto</TableCell>
                          <TableCell align="right">Importo</TableCell>
                          <TableCell align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SAMPLE_DATA.ricavi.map((row) => (
                          <TableRow key={row.prodotto}>
                            <TableCell component="th" scope="row">
                              {row.prodotto}
                            </TableCell>
                            <TableCell align="right">
                              € {row.valore.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {row.percentuale}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 2: Produttività */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Analisi Produttività - {selectedYear}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Resa per Appezzamento" />
                <CardContent>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Appezzamento</TableCell>
                          <TableCell align="right">Superficie (ha)</TableCell>
                          <TableCell align="right">Produzione (kg)</TableCell>
                          <TableCell align="right">Resa (kg/ha)</TableCell>
                          <TableCell align="right">Ricavi (€)</TableCell>
                          <TableCell align="right">Costi (€)</TableCell>
                          <TableCell align="right">Utile (€)</TableCell>
                          <TableCell align="right">ROI</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SAMPLE_DATA.appezzamenti.map((row) => (
                          <TableRow key={row.nome}>
                            <TableCell>{row.nome}</TableCell>
                            <TableCell align="right">
                              {row.superficie}
                            </TableCell>
                            <TableCell align="right">
                              {(row.ricavi * 40).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {Math.round(
                                (row.ricavi * 40) / row.superficie
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {row.ricavi.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {row.costi.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {row.utile.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {Math.round((row.utile / row.costi) * 100)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Confronto Annuale" />
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    [Qui verrebbe mostrato un grafico che confronta la
                    produttività tra anni diversi]
                  </Typography>
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed grey",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visualizzazione grafico confronto annuale (simulata)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 3: Vendite */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Analisi Vendite - {selectedYear}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader title="Andamento Vendite Mensili" />
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    [Qui verrebbe mostrato un grafico a linee che mostra
                    l'andamento delle vendite per mese]
                  </Typography>
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed grey",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visualizzazione grafico vendite mensili (simulata)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Riepilogo Vendite" />
                <CardContent>
                  <Typography variant="h6">Vendite Totali</Typography>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    € 86,500.00
                  </Typography>

                  <Typography variant="h6">Numero Clienti</Typography>
                  <Typography variant="h4" gutterBottom>
                    28
                  </Typography>

                  <Typography variant="h6">Valore Medio Vendita</Typography>
                  <Typography variant="h4" gutterBottom>
                    € 3,089.29
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Vendite per Cliente" />
                <CardContent>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cliente</TableCell>
                          <TableCell align="right">N° Ordini</TableCell>
                          <TableCell align="right">Quantità (kg)</TableCell>
                          <TableCell align="right">Importo (€)</TableCell>
                          <TableCell align="right">% sul Totale</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Supermercati ABC</TableCell>
                          <TableCell align="right">12</TableCell>
                          <TableCell align="right">36,000</TableCell>
                          <TableCell align="right">38,400</TableCell>
                          <TableCell align="right">44%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mercati Ortofrutticoli srl</TableCell>
                          <TableCell align="right">8</TableCell>
                          <TableCell align="right">25,000</TableCell>
                          <TableCell align="right">25,000</TableCell>
                          <TableCell align="right">29%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Frutta Fresca spa</TableCell>
                          <TableCell align="right">15</TableCell>
                          <TableCell align="right">18,000</TableCell>
                          <TableCell align="right">18,900</TableCell>
                          <TableCell align="right">22%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Altri clienti</TableCell>
                          <TableCell align="right">5</TableCell>
                          <TableCell align="right">4,200</TableCell>
                          <TableCell align="right">4,200</TableCell>
                          <TableCell align="right">5%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 4: Appezzamenti */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Analisi per Appezzamento - {selectedYear}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    selectedAppezzamento === "Tutti"
                      ? "Confronto Appezzamenti"
                      : `Dettaglio: ${selectedAppezzamento}`
                  }
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    [Qui verrebbe mostrato un grafico comparativo tra gli
                    appezzamenti]
                  </Typography>
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed grey",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visualizzazione grafico appezzamenti (simulata)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Dettaglio costi per appezzamento" />
                <CardContent>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Appezzamento</TableCell>
                          <TableCell align="right">Manodopera</TableCell>
                          <TableCell align="right">Fitosanitari</TableCell>
                          <TableCell align="right">Concimi</TableCell>
                          <TableCell align="right">Irrigazione</TableCell>
                          <TableCell align="right">Altro</TableCell>
                          <TableCell align="right">Totale</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SAMPLE_DATA.appezzamenti.map((row) => (
                          <TableRow key={row.nome}>
                            <TableCell>{row.nome}</TableCell>
                            <TableCell align="right">
                              € {Math.round(row.costi * 0.35).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {Math.round(row.costi * 0.2).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {Math.round(row.costi * 0.15).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {Math.round(row.costi * 0.12).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {Math.round(row.costi * 0.18).toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              € {row.costi.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Reportistica;
