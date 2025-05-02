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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Dati di esempio per le categorie
const categorieMock = [
  { id: 1, nome: "Frutta", tipo: "agricolo" },
  { id: 2, nome: "Verdura", tipo: "agricolo" },
  { id: 3, nome: "Cereali", tipo: "agricolo" },
];

// Dati di esempio per i prodotti
const prodottiMock = [
  {
    id: 1,
    codice: "MELE001",
    nome: "Mele",
    varieta: "Golden Delicious",
    id_categoria: 1,
    categoria_nome: "Frutta",
    unita_misura: "kg",
    prezzo_vendita_medio: 1.2,
    note: "Varietà dolce",
  },
  {
    id: 2,
    codice: "PERE001",
    nome: "Pere",
    varieta: "Abate",
    id_categoria: 1,
    categoria_nome: "Frutta",
    unita_misura: "kg",
    prezzo_vendita_medio: 1.5,
    note: "Varietà succosa",
  },
  {
    id: 3,
    codice: "PATA001",
    nome: "Patate",
    varieta: "Bianca",
    id_categoria: 2,
    categoria_nome: "Verdura",
    unita_misura: "kg",
    prezzo_vendita_medio: 0.8,
    note: "Ottima per bolliti",
  },
];

const ProdottiAgricoli = () => {
  const [prodotti, setProdotti] = useState(prodottiMock);
  const [categorie, setCategorie] = useState(categorieMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProdotto, setCurrentProdotto] = useState({
    codice: "",
    nome: "",
    varieta: "",
    id_categoria: "",
    unita_misura: "kg",
    prezzo_vendita_medio: "",
    note: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // Funzioni per la gestione dei prodotti
  const handleOpenDialog = (prodotto = null) => {
    if (prodotto) {
      setCurrentProdotto(prodotto);
      setIsEdit(true);
    } else {
      setCurrentProdotto({
        codice: "",
        nome: "",
        varieta: "",
        id_categoria: "",
        unita_misura: "kg",
        prezzo_vendita_medio: "",
        note: "",
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
    setCurrentProdotto({
      ...currentProdotto,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (isEdit) {
      // Aggiorna prodotto esistente
      const updatedProdotti = prodotti.map((item) =>
        item.id === currentProdotto.id
          ? {
              ...currentProdotto,
              categoria_nome:
                categorie.find(
                  (c) => c.id === parseInt(currentProdotto.id_categoria)
                )?.nome || "",
            }
          : item
      );
      setProdotti(updatedProdotti);
    } else {
      // Aggiungi nuovo prodotto
      const newProdotto = {
        ...currentProdotto,
        id: Math.max(...prodotti.map((p) => p.id), 0) + 1,
        categoria_nome:
          categorie.find((c) => c.id === parseInt(currentProdotto.id_categoria))
            ?.nome || "",
      };
      setProdotti([...prodotti, newProdotto]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      setProdotti(prodotti.filter((item) => item.id !== id));
    }
  };

  // Filtraggio prodotti in base alla ricerca
  const filteredProdotti = prodotti.filter(
    (prodotto) =>
      prodotto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prodotto.varieta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prodotto.codice.toLowerCase().includes(searchTerm.toLowerCase())
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
          Gestione Prodotti Agricoli
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Prodotto
        </Button>
      </Box>

      {/* Barra di ricerca */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cerca prodotto per nome, varietà o codice..."
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

      {/* Tabella prodotti */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codice</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Varietà</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Prezzo medio (€)</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProdotti.length > 0 ? (
              filteredProdotti.map((prodotto) => (
                <TableRow key={prodotto.id}>
                  <TableCell>{prodotto.codice}</TableCell>
                  <TableCell>{prodotto.nome}</TableCell>
                  <TableCell>{prodotto.varieta}</TableCell>
                  <TableCell>{prodotto.categoria_nome}</TableCell>
                  <TableCell align="right">
                    {prodotto.prezzo_vendita_medio?.toFixed(2)}
                  </TableCell>
                  <TableCell>{prodotto.note}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(prodotto)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(prodotto.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessun prodotto trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per aggiunta/modifica */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Modifica Prodotto Agricolo" : "Nuovo Prodotto Agricolo"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="codice"
                label="Codice"
                value={currentProdotto.codice}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nome"
                label="Nome"
                value={currentProdotto.nome}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="varieta"
                label="Varietà"
                value={currentProdotto.varieta}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="id_categoria"
                  value={currentProdotto.id_categoria}
                  label="Categoria"
                  onChange={handleInputChange}
                >
                  {categorie
                    .filter((c) => c.tipo === "agricolo")
                    .map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unita_misura"
                label="Unità di misura"
                value={currentProdotto.unita_misura}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prezzo_vendita_medio"
                label="Prezzo medio di vendita (€)"
                type="number"
                value={currentProdotto.prezzo_vendita_medio}
                onChange={handleInputChange}
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
                value={currentProdotto.note}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
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
    </Box>
  );
};

export default ProdottiAgricoli;
