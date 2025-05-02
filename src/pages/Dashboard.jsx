import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Agriculture as AgricultureIcon,
  Grass as GrassIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
  LocalShipping as LocalShippingIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

// Dati di esempio per la dashboard
// Normalmente questi dati proverrebbero da un'API o da un database
// Qui li definiamo direttamente per simulare la funzionalità

// Dati per la panoramica (numero di record per tipo)
const datiAnagraficheMock = {
  appezzamenti: 12,
  prodottiAgricoli: 25,
  prodottiAgronomici: 48,
  bins: 350,
  fornitori: 18,
  clienti: 32,
};

// Dati finanziari mensili
const datiFinanziariMensiliMock = [
  { mese: "Gen", entrate: 28000, uscite: 18000 },
  { mese: "Feb", entrate: 24000, uscite: 20000 },
  { mese: "Mar", entrate: 30000, uscite: 22000 },
  { mese: "Apr", entrate: 35000, uscite: 19000 },
  { mese: "Mag", entrate: 33000, uscite: 25000 },
  { mese: "Giu", entrate: 28000, uscite: 23000 },
];

// Ultimi movimenti finanziari
const ultimiMovimentiMock = [
  {
    id: 1,
    data: "2024-04-15",
    tipo: "entrata",
    importo: 3500,
    categoria_nome: "Vendita prodotti",
    descrizione: "Vendita mele Golden Cooperative Valle",
  },
  {
    id: 2,
    data: "2024-04-10",
    tipo: "uscita",
    importo: 1200,
    categoria_nome: "Manodopera",
    descrizione: "Pagamento lavoratori stagionali",
  },
  {
    id: 3,
    data: "2024-04-05",
    tipo: "uscita",
    importo: 850,
    categoria_nome: "Fitosanitari",
    descrizione: "Acquisto fungicidi per melo",
  },
  {
    id: 4,
    data: "2024-03-28",
    tipo: "entrata",
    importo: 4200,
    categoria_nome: "Vendita prodotti",
    descrizione: "Vendita pere Abate Coop Frutta",
  },
];

// Dati per la distribuzione delle vendite per prodotto
const venditeProdottiMock = [
  { nome: "Mele Golden", valore: 42 },
  { nome: "Pere Abate", valore: 28 },
  { nome: "Pesche", valore: 15 },
  { nome: "Patate", valore: 10 },
  { nome: "Altri", valore: 5 },
];

// Dati per la distribuzione delle spese per categoria
const speseCategoriasMock = [
  { nome: "Manodopera", valore: 35 },
  { nome: "Fitosanitari", valore: 20 },
  { nome: "Concimi", valore: 15 },
  { nome: "Carburante", valore: 12 },
  { nome: "Manutenzione", valore: 10 },
  { nome: "Altri", valore: 8 },
];

// Vendite recenti
const venditeRecentiMock = [
  {
    id: 1,
    numero_documento: "FT-2024-001",
    data: "2024-04-15",
    cliente_nome: "Cooperativa Frutta Bio",
    stato: "consegnato",
    totale_netto: 3580,
  },
  {
    id: 2,
    numero_documento: "DDT-2024-001",
    data: "2024-04-10",
    cliente_nome: "Supermercato Valle",
    stato: "pagato",
    totale_netto: 700,
  },
  {
    id: 3,
    numero_documento: "PV-2024-001",
    data: "2024-04-20",
    cliente_nome: "Mercato Ortofrutticolo",
    stato: "da_confermare",
    totale_netto: 1620,
  },
];

// Avvisi e notifiche
const avvisiMock = [
  {
    id: 1,
    tipo: "scorta",
    livello: "warning",
    messaggio: "Scorta bassa: Fungicida FungiStop Pro (5.5 litri rimanenti)",
    data: "2024-04-18",
  },
  {
    id: 2,
    tipo: "consegna",
    livello: "info",
    messaggio: "Consegna prevista oggi: DDT-2024-002 per Supermercato Valle",
    data: "2024-04-20",
  },
  {
    id: 3,
    tipo: "pagamento",
    livello: "error",
    messaggio: "Pagamento scaduto: Fattura FT-2024-001 di €3,580",
    data: "2024-04-16",
  },
  {
    id: 4,
    tipo: "trattamento",
    livello: "info",
    messaggio: "Trattamento antioidico programmato per domani",
    data: "2024-04-19",
  },
];

// Stato attuale dei BINS
const statoBinsMock = [
  { stato: "Vuoti", quantita: 185 },
  { stato: "Pieni", quantita: 120 },
  { stato: "In lavorazione", quantita: 45 },
];

// Prossimi trattamenti in programma
const prossimiTrattamentiMock = [
  {
    id: 1,
    data: "2024-04-25",
    appezzamento: "Campo Grande",
    trattamento: "Antioidico",
    prodotto: "FungiStop Pro",
    quantita: "4.5 l",
  },
  {
    id: 2,
    data: "2024-04-28",
    appezzamento: "Vigna Nord",
    trattamento: "Insetticida",
    prodotto: "InsectoKill",
    quantita: "3 l",
  },
  {
    id: 3,
    data: "2024-05-03",
    appezzamento: "Frutteto Est",
    trattamento: "Concimazione",
    prodotto: "NutriPlus N30",
    quantita: "250 kg",
  },
];

// Componente StatCard riutilizzabile
const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Icon sx={{ color, mr: 1, fontSize: 24 }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" align="center" sx={{ my: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Colori per i grafici
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simuliamo un caricamento dei dati
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funzione per renderizzare lo stato delle vendite
  const renderStatoVendita = (stato) => {
    let color = "default";
    let label = stato;

    switch (stato) {
      case "da_consegnare":
        color = "warning";
        label = "Da Consegnare";
        break;
      case "consegnato":
        color = "info";
        label = "Consegnato";
        break;
      case "pagato":
        color = "success";
        label = "Pagato";
        break;
      case "annullato":
        color = "error";
        label = "Annullato";
        break;
      case "da_confermare":
        color = "default";
        label = "Da Confermare";
        break;
      default:
        break;
    }

    return <Chip label={label} color={color} size="small" />;
  };

  // Funzione per renderizzare il livello di avviso
  const renderLivelloAvviso = (livello) => {
    let color = "default";

    switch (livello) {
      case "error":
        color = "error";
        break;
      case "warning":
        color = "warning";
        break;
      case "info":
        color = "info";
        break;
      case "success":
        color = "success";
        break;
      default:
        break;
    }

    return <Chip label={livello.toUpperCase()} color={color} size="small" />;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Caricamento dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Sezione Panoramica */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Panoramica Finanziaria" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={datiFinanziariMensiliMock}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mese" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `€${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="entrate" name="Entrate" fill="#4caf50" />
                  <Bar dataKey="uscite" name="Uscite" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Distribuzione Vendite" />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={venditeProdottiMock}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valore"
                    nameKey="nome"
                    label={({ nome, percent }) =>
                      `${nome} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {venditeProdottiMock.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schede Statistiche */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Anagrafiche
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Appezzamenti"
            value={datiAnagraficheMock.appezzamenti}
            icon={AgricultureIcon}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Prodotti Agricoli"
            value={datiAnagraficheMock.prodottiAgricoli}
            icon={AgricultureIcon}
            color="success.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Prodotti Agronomici"
            value={datiAnagraficheMock.prodottiAgronomici}
            icon={GrassIcon}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="BINS"
            value={datiAnagraficheMock.bins}
            icon={InventoryIcon}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Fornitori"
            value={datiAnagraficheMock.fornitori}
            icon={BusinessIcon}
            color="info.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Clienti"
            value={datiAnagraficheMock.clienti}
            icon={PersonIcon}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Stato BINS e Avvisi */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Stato BINS" />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statoBinsMock}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="quantita"
                    nameKey="stato"
                    label={({ stato, quantita }) => `${stato}: ${quantita}`}
                  >
                    <Cell fill="#9e9e9e" /> {/* Vuoti */}
                    <Cell fill="#4caf50" /> {/* Pieni */}
                    <Cell fill="#ff9800" /> {/* In lavorazione */}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} BINS`} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/bins"
                >
                  Gestisci BINS
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title="Avvisi e Notifiche"
              action={
                <Button size="small" color="primary">
                  Vedi tutti
                </Button>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <List dense>
                {avvisiMock.map((avviso) => (
                  <ListItem
                    key={avviso.id}
                    secondaryAction={renderLivelloAvviso(avviso.livello)}
                    sx={{ borderBottom: "1px solid #eee", py: 1 }}
                  >
                    <ListItemText
                      primary={avviso.messaggio}
                      secondary={`${avviso.data}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs per attività recenti */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<TrendingUpIcon />}
            iconPosition="start"
            label="Movimenti Finanziari"
          />
          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Vendite Recenti"
          />
          <Tab
            icon={<ScheduleIcon />}
            iconPosition="start"
            label="Prossimi Trattamenti"
          />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Descrizione</TableCell>
                    <TableCell align="right">Importo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ultimiMovimentiMock.map((movimento) => (
                    <TableRow key={movimento.id}>
                      <TableCell>{movimento.data}</TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            movimento.tipo === "entrata" ? (
                              <TrendingUpIcon fontSize="small" />
                            ) : (
                              <TrendingDownIcon fontSize="small" />
                            )
                          }
                          label={
                            movimento.tipo === "entrata" ? "Entrata" : "Uscita"
                          }
                          color={
                            movimento.tipo === "entrata" ? "success" : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{movimento.categoria_nome}</TableCell>
                      <TableCell>{movimento.descrizione}</TableCell>
                      <TableCell align="right">
                        {movimento.importo.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/finanza"
                >
                  Vai alla Gestione Finanziaria
                </Button>
              </Box>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Numero</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell align="right">Totale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venditeRecentiMock.map((vendita) => (
                    <TableRow key={vendita.id}>
                      <TableCell>{vendita.numero_documento}</TableCell>
                      <TableCell>{vendita.data}</TableCell>
                      <TableCell>{vendita.cliente_nome}</TableCell>
                      <TableCell>{renderStatoVendita(vendita.stato)}</TableCell>
                      <TableCell align="right">
                        {vendita.totale_netto.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/vendite"
                >
                  Vai alla Gestione Vendite
                </Button>
              </Box>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Appezzamento</TableCell>
                    <TableCell>Trattamento</TableCell>
                    <TableCell>Prodotto</TableCell>
                    <TableCell>Quantità</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prossimiTrattamentiMock.map((trattamento) => (
                    <TableRow key={trattamento.id}>
                      <TableCell>{trattamento.data}</TableCell>
                      <TableCell>{trattamento.appezzamento}</TableCell>
                      <TableCell>{trattamento.trattamento}</TableCell>
                      <TableCell>{trattamento.prodotto}</TableCell>
                      <TableCell>{trattamento.quantita}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/prodotti-agronomici"
                >
                  Gestisci Trattamenti
                </Button>
              </Box>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Sezione distribuzione spese */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Distribuzione Spese" />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={speseCategoriasMock}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valore"
                    nameKey="nome"
                    label={({ nome, percent }) =>
                      `${nome} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {speseCategoriasMock.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Riepilogo Finanziario" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "success.light",
                      color: "success.contrastText",
                    }}
                  >
                    <Typography variant="subtitle1">Entrate Periodo</Typography>
                    <Typography variant="h5">
                      {datiFinanziariMensiliMock
                        .reduce((sum, item) => sum + item.entrate, 0)
                        .toLocaleString("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "error.light",
                      color: "error.contrastText",
                    }}
                  >
                    <Typography variant="subtitle1">Uscite Periodo</Typography>
                    <Typography variant="h5">
                      {datiFinanziariMensiliMock
                        .reduce((sum, item) => sum + item.uscite, 0)
                        .toLocaleString("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mt: 2,
                      textAlign: "center",
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    <Typography variant="subtitle1">Saldo Periodo</Typography>
                    <Typography variant="h4">
                      {(
                        datiFinanziariMensiliMock.reduce(
                          (sum, item) => sum + item.entrate,
                          0
                        ) -
                        datiFinanziariMensiliMock.reduce(
                          (sum, item) => sum + item.uscite,
                          0
                        )
                      ).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
