import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Agriculture as AgricultureIcon,
  Grass as GrassIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ShoppingCart as ShoppingCartIcon,
  AssessmentOutlined as AssessmentIcon,
  Groups as GroupsIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";

// Importa i componenti delle pagine esistenti
import Dashboard from "./pages/Dashboard";
import Appezzamenti from "./pages/Appezzamenti";
import ProdottiAgricoli from "./pages/ProdottiAgricoli";
import ProdottiAgronomici from "./pages/ProdottiAgronomici";
import GestioneBins from "./pages/GestioneBins";
import GestioneFinanziaria from "./pages/GestioneFinanziaria";
import GestioneVendite from "./pages/GestioneVendite";

// Importa i nuovi componenti
import Reportistica from "./pages/Reportistica";
import GestionePersonale from "./pages/GestionePersonale";
import PianificazioneStagionale from "./pages/PianificazioneStagionale";

// Componenti segnaposto per le altre sezioni
const Fornitori = () => (
  <Box>
    <Typography variant="h4">Gestione Fornitori</Typography>
    <Typography variant="body1" paragraph>
      Questa sezione è in fase di sviluppo.
    </Typography>
  </Box>
);

const Clienti = () => (
  <Box>
    <Typography variant="h4">Gestione Clienti</Typography>
    <Typography variant="body1" paragraph>
      Questa sezione è in fase di sviluppo.
    </Typography>
  </Box>
);

function App() {
  const drawerWidth = 240;

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Gestionale Agricolo
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <ListItemText
                  primary="Anagrafiche"
                  sx={{ fontWeight: "bold" }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/appezzamenti">
                  <ListItemIcon>
                    <AgricultureIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appezzamenti" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/prodotti-agricoli">
                  <ListItemIcon>
                    <AgricultureIcon />
                  </ListItemIcon>
                  <ListItemText primary="Prodotti Agricoli" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/prodotti-agronomici">
                  <ListItemIcon>
                    <GrassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Fitosanitari/Concimi" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/fornitori">
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Fornitori" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/clienti">
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Clienti" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/bins">
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="BINS" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operazioni"
                  sx={{ fontWeight: "bold" }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/finanza">
                  <ListItemIcon>
                    <AccountBalanceWalletIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestione Finanziaria" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/vendite">
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestione Vendite" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/personale">
                  <ListItemIcon>
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestione Personale" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/pianificazione">
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pianificazione" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Reportistica"
                  sx={{ fontWeight: "bold" }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/reportistica">
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Analisi e Report" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appezzamenti" element={<Appezzamenti />} />
              <Route path="/prodotti-agricoli" element={<ProdottiAgricoli />} />
              <Route
                path="/prodotti-agronomici"
                element={<ProdottiAgronomici />}
              />
              <Route path="/fornitori" element={<Fornitori />} />
              <Route path="/clienti" element={<Clienti />} />
              <Route path="/bins" element={<GestioneBins />} />
              <Route path="/finanza" element={<GestioneFinanziaria />} />
              <Route path="/vendite" element={<GestioneVendite />} />

              {/* Nuove rotte per i nuovi moduli */}
              <Route path="/reportistica" element={<Reportistica />} />
              <Route path="/personale" element={<GestionePersonale />} />
              <Route
                path="/pianificazione"
                element={<PianificazioneStagionale />}
              />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
