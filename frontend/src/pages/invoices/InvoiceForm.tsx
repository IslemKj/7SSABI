/**
 * Formulaire de création/modification de facture/devis
 */
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { clientService } from '@/services/clientService';
import { productService } from '@/services/productService';
import { invoiceService } from '@/services/invoiceService';
import type { Client, Product, Invoice } from '@/types';

interface InvoiceItem {
  product_id?: number;
  product?: Product;
  description: string;
  quantity: number;
  unit_price: number;
  tva_rate: number;
  subtotal: number;
}

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  invoice?: Invoice | null;
  isQuote?: boolean;
}

const InvoiceForm = ({ open, onClose, onSave, invoice, isQuote = false }: InvoiceFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'draft' | 'unpaid' | 'paid' | 'partial' | 'cancelled'>(
    isQuote ? 'draft' : 'unpaid'
  );
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unit_price: 0, tva_rate: 19, subtotal: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les données (clients et produits) quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  // Charger les données de la facture quand invoice ou products/clients changent
  useEffect(() => {
    if (invoice && products.length > 0 && clients.length > 0) {
      // Charger les données de la facture pour modification
      // Trouver le client dans la liste des clients par ID
      const client = invoice.client 
        ? clients.find(c => c.id === invoice.client!.id)
        : null;
      setSelectedClient(client || null);
      
      setInvoiceNumber(invoice.invoice_number);
      setDate(invoice.date);
      setDueDate(invoice.due_date || '');
      setStatus(invoice.status);
      setNotes(invoice.notes || '');
      
      // Charger les items de la facture avec les produits associés
      if (invoice.items && invoice.items.length > 0) {
        setItems(
          invoice.items.map(item => {
            // Trouver le produit correspondant dans la liste
            const product = item.product_id 
              ? products.find(p => p.id === item.product_id)
              : undefined;
            
            return {
              product_id: item.product_id,
              product: product,
              description: item.description,
              quantity: item.quantity,
              unit_price: Number(item.unit_price),
              tva_rate: 19, // Valeur par défaut
              subtotal: Number(item.total),
            };
          })
        );
      }
    } else if (!invoice && open) {
      // Générer un nouveau numéro de facture/devis
      generateInvoiceNumber();
      // Réinitialiser les items si c'est une nouvelle facture
      setItems([{ description: '', quantity: 1, unit_price: 0, tva_rate: 19, subtotal: 0 }]);
    }
  }, [invoice, products, clients, open]);

  const loadData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        clientService.getAll(),
        productService.getAll(),
      ]);
      setClients(clientsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const prefix = isQuote ? 'DEV' : 'FAC';
    const timestamp = Date.now().toString().slice(-6);
    setInvoiceNumber(`${prefix}-${timestamp}`);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, tva_rate: 19, subtotal: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculer le sous-total
    if (field === 'quantity' || field === 'unit_price' || field === 'tva_rate') {
      const item = newItems[index];
      const htAmount = item.quantity * item.unit_price;
      item.subtotal = htAmount * (1 + item.tva_rate / 100);
    }
    
    setItems(newItems);
  };

  const handleProductSelect = (index: number, product: Product | null) => {
    if (product) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product_id: product.id,
        product: product,
        description: product.name,
        unit_price: product.price,
        tva_rate: product.tva_rate,
      };
      
      // Recalculer le sous-total
      const item = newItems[index];
      const htAmount = item.quantity * item.unit_price;
      item.subtotal = htAmount * (1 + item.tva_rate / 100);
      
      setItems(newItems);
    }
  };

  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    items.forEach(item => {
      const htAmount = item.quantity * item.unit_price;
      const tvaAmount = htAmount * (item.tva_rate / 100);
      
      totalHT += htAmount;
      totalTVA += tvaAmount;
      totalTTC += htAmount + tvaAmount;
    });

    return { totalHT, totalTVA, totalTTC };
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert('Veuillez sélectionner un client');
      return;
    }

    if (items.length === 0 || items.every(item => !item.description)) {
      alert('Veuillez ajouter au moins une ligne');
      return;
    }

    const { totalHT, totalTVA, totalTTC } = calculateTotals();

    try {
      setLoading(true);
      
      const invoiceData = {
        client_id: selectedClient.id,
        invoice_number: invoiceNumber,
        date: date,
        due_date: dueDate || undefined,
        status: status,
        is_quote: isQuote,
        notes: notes || undefined,
        total_ht: Number(totalHT),
        total_tva: Number(totalTVA),
        total_ttc: Number(totalTTC),
        items: items.map(item => ({
          product_id: item.product_id || undefined,
          description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };

      console.log('Données envoyées:', JSON.stringify(invoiceData, null, 2));

      if (invoice) {
        await invoiceService.update(invoice.id, invoiceData);
      } else {
        await invoiceService.create(invoiceData);
      }

      onSave();
      handleClose();
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Réinitialiser le formulaire
    setSelectedClient(null);
    setInvoiceNumber('');
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setStatus(isQuote ? 'draft' : 'unpaid');
    setItems([{ description: '', quantity: 1, unit_price: 0, tva_rate: 19, subtotal: 0 }]);
    setNotes('');
    onClose();
  };

  const { totalHT, totalTVA, totalTTC } = calculateTotals();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#6366f1', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {invoice ? 'Modifier' : 'Créer'} {isQuote ? 'un Devis' : 'une Facture'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Informations de base */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={selectedClient}
              onChange={(_, newValue) => setSelectedClient(newValue)}
              options={clients}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Client *" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={isQuote ? "Numéro de devis" : "Numéro de facture"}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Date d'échéance"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                label="Statut"
              >
                <MenuItem value="draft">Brouillon</MenuItem>
                <MenuItem value="unpaid">Non payée</MenuItem>
                <MenuItem value="paid">Payée</MenuItem>
                <MenuItem value="partial">Paiement partiel</MenuItem>
                <MenuItem value="cancelled">Annulée</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Lignes de la facture */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Lignes de {isQuote ? 'devis' : 'facture'}</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              variant="outlined"
              size="small"
            >
              Ajouter une ligne
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell width="25%">Produit/Service</TableCell>
                  <TableCell width="35%">Description</TableCell>
                  <TableCell width="10%" align="center">Qté</TableCell>
                  <TableCell width="12%" align="right">Prix HT</TableCell>
                  <TableCell width="8%" align="center">TVA %</TableCell>
                  <TableCell width="12%" align="right">Total TTC</TableCell>
                  <TableCell width="5%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        value={item.product || null}
                        onChange={(_, newValue) => handleProductSelect(index, newValue)}
                        options={products}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Sélectionner..." />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        inputProps={{ min: 1, step: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={item.tva_rate}
                        onChange={(e) => handleItemChange(index, 'tva_rate', Number(e.target.value))}
                        inputProps={{ min: 0, max: 100, step: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {item.subtotal.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DA
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Totaux */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Total HT:</Typography>
              <Typography fontWeight={600}>{totalHT.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DA</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Total TVA:</Typography>
              <Typography fontWeight={600}>{totalTVA.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DA</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total TTC:</Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {totalTTC.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DA
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notes */}
        <TextField
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          sx={{ mt: 3 }}
          placeholder="Notes additionnelles (conditions de paiement, etc.)"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<SaveIcon />}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceForm;
