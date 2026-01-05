

/**
 * Page Produits - Design Moderne
 */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  Build as BuildIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';
import { productService } from '@/services/productService';
import { config } from '@/config/config';
import type { Product, ProductFormData } from '@/types';

// Type local pour le formulaire acceptant des strings pendant la saisie
interface ProductFormState {
  name: string;
  description?: string;
  category: string;
  unit_price: string | number;
  currency: string;
  tva_rate: string | number;
  stock?: string | number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ProductFormState>({
    name: '',
    description: '',
    category: 'produit',
    unit_price: '', // Always string for controlled input
    currency: 'EUR',
    tva_rate: 19,
    stock: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [page, pageSize]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll(page, pageSize);
      setProducts(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        unit_price: product.unit_price !== undefined && product.unit_price !== null ? product.unit_price.toString() : '',
        currency: product.currency || 'EUR',
        tva_rate: product.tva_rate,
        stock: product.stock !== undefined && product.stock !== null ? product.stock.toString() : '0',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'produit',
        unit_price: '',
        currency: 'EUR',
        tva_rate: 19,
        stock: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value); // DEBUG
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Convertir les champs numériques avant l'envoi
      const unit_price = Number(formData.unit_price);
      const tva_rate = Number(formData.tva_rate);
      const stock = formData.category === 'produit' ? Number(formData.stock || 0) : 0;
      
      // Validation
      if (!formData.name || !formData.category) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      if (isNaN(unit_price) || unit_price <= 0) {
        alert('Le prix doit être un nombre supérieur à 0');
        return;
      }
      
      if (isNaN(tva_rate) || tva_rate < 0) {
        alert('Le taux de TVA doit être un nombre positif');
        return;
      }
      
      if (formData.category === 'produit' && (isNaN(stock) || stock < 0)) {
        alert('Le stock doit être un nombre positif');
        return;
      }
      
      const dataToSubmit = {
        ...formData,
        unit_price: Number(unit_price),
        tva_rate: Number(tva_rate),
        stock: formData.category === 'produit' ? Number(stock) : 0,
      };
      
      console.log('Données envoyées:', dataToSubmit);
      
      if (editingProduct) {
        await productService.update(editingProduct.id, dataToSubmit);
      } else {
        await productService.create(dataToSubmit);
      }
      
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert('Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        loadProducts();
      } catch (error) {
        console.error('Erreur suppression produit:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const stats = {
    total: products.length,
    produits: products.filter(p => p.category === 'produit').length,
    services: products.filter(p => p.category === 'service').length,
    avgPrice: products.length > 0
      ? products.reduce((sum, p) => sum + p.unit_price, 0) / products.length
      : 0,
  };

  const getCategoryColor = (category: string) => {
    return category === 'produit' ? '#6366f1' : '#10b981';
  };

  const getCategoryIcon = (category: string) => {
    return category === 'produit' ? <ShoppingCartIcon /> : <BuildIcon />;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          gap: 2,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <InventoryIcon sx={{ color: '#6366f1', fontSize: 28 }} />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des produits...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* En-tête avec gradient */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.5rem' },
              }}
            >
              Produits & Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.95,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              Gérez votre catalogue • {products.length} article{products.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 700,
              px: 3,
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Nouveau produit
          </Button>
        </Box>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: alpha('#6366f1', 0.2),
              background: alpha('#6366f1', 0.05),
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 20px ${alpha('#6366f1', 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1', fontSize: '0.8125rem' }}>
                  Total Articles
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha('#6366f1', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: alpha('#6366f1', 0.2),
              background: alpha('#6366f1', 0.05),
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 20px ${alpha('#6366f1', 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1', fontSize: '0.8125rem' }}>
                  Produits
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha('#6366f1', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.produits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: alpha('#10b981', 0.2),
              background: alpha('#10b981', 0.05),
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 20px ${alpha('#10b981', 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', fontSize: '0.8125rem' }}>
                  Services
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha('#10b981', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BuildIcon sx={{ fontSize: 18, color: '#10b981' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.services}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: alpha('#f59e0b', 0.2),
              background: alpha('#f59e0b', 0.05),
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 20px ${alpha('#f59e0b', 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.8125rem' }}>
                  Dernier ajouté
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha('#f59e0b', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalOfferIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {(() => {
                  if (products.length === 0) return "Aucun produit";
                  const recentProduct = products.reduce((latest, p) => new Date(p.created_at) > new Date(latest.created_at) ? p : latest, products[0]);
                  return ` ${recentProduct.name}`;
                })()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, catégorie ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6366f1' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: alpha('#6366f1', 0.03),
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: alpha('#6366f1', 0.2),
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                  borderWidth: 2,
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tableau des produits */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          overflow: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: alpha('#6366f1', 0.05),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                }}
              >
                Produit
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                }}
              >
                Catégorie
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                Prix HT
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                TVA
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                }}
              >
                Prix TTC
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                  display: { xs: 'none', lg: 'table-cell' },
                }}
              >
                Stock
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: 2,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: alpha('#6366f1', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <InventoryIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit enregistré'}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: '#6366f1',
                          color: '#6366f1',
                          '&:hover': {
                            borderColor: '#6366f1',
                            bgcolor: alpha('#6366f1', 0.05),
                          },
                        }}
                      >
                        Créer votre premier produit
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const unit_price = Number(product.unit_price) || 0;
                const tvaRate = Number(product.tva_rate) || 0;
                const priceTTC = unit_price * (1 + tvaRate / 100);
                
                // Debug: vérifier les valeurs
                if (isNaN(priceTTC)) {
                  console.warn('Prix TTC invalide pour le produit:', {
                    product,
                    unit_price,
                    tvaRate,
                    priceTTC
                  });
                }
                
                return (
                  <TableRow
                    key={product.id}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.02),
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: alpha(getCategoryColor(product.category), 0.15),
                            color: getCategoryColor(product.category),
                          }}
                        >
                          {getCategoryIcon(product.category)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#1e293b',
                              mb: 0.5,
                            }}
                          >
                            {product.name}
                          </Typography>
                          {product.description && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: { xs: 'none', lg: 'block' },
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {product.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(product.category)}
                        label={product.category === 'produit' ? 'Produit' : 'Service'}
                        size="small"
                        sx={{
                          bgcolor: alpha(getCategoryColor(product.category), 0.1),
                          color: getCategoryColor(product.category),
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: alpha(getCategoryColor(product.category), 0.3),
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                        {(product.unit_price || 0).toLocaleString('fr-FR')} {product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : product.currency === 'USD' ? '$' : 'DA'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        icon={<PercentIcon sx={{ fontSize: 14 }} />}
                        label={`${product.tva_rate}%`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#f59e0b', 0.1),
                          color: '#f59e0b',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {priceTTC.toLocaleString('fr-FR')} {product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : product.currency === 'USD' ? '$' : 'DA'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                      {product.category === 'produit' ? (
                        <Chip
                          icon={<InventoryIcon sx={{ fontSize: 14 }} />}
                          label={`${product.stock || 0} unités`}
                          size="small"
                          sx={{
                            bgcolor: (product.stock || 0) > 10 ? alpha('#10b981', 0.1) : (product.stock || 0) > 0 ? alpha('#f59e0b', 0.1) : alpha('#ef4444', 0.1),
                            color: (product.stock || 0) > 10 ? '#10b981' : (product.stock || 0) > 0 ? '#f59e0b' : '#ef4444',
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton
                          onClick={() => handleOpenDialog(product)}
                          size="small"
                          sx={{
                            bgcolor: alpha('#6366f1', 0.1),
                            color: '#6366f1',
                            '&:hover': {
                              bgcolor: alpha('#6366f1', 0.2),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(product.id)}
                          size="small"
                          sx={{
                            bgcolor: alpha('#ef4444', 0.1),
                            color: '#ef4444',
                            '&:hover': {
                              bgcolor: alpha('#ef4444', 0.2),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {total > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            p: 2,
            bgcolor: alpha('#6366f1', 0.03),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)} sur {total} produits
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{ borderRadius: 1.5 }}
            >
              Précédent
            </Button>
            <Typography variant="body2" sx={{ px: 2 }}>
              Page {page} sur {Math.ceil(total / pageSize)}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              sx={{ borderRadius: 1.5 }}
            >
              Suivant
            </Button>
          </Box>
        </Box>
      )}

      {/* Dialog de formulaire moderne */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
            py: 3,
          }}
        >
          {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nom du produit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              label="Description (optionnelle)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <DescriptionIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            />
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            >
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Catégorie"
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="produit">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCartIcon sx={{ fontSize: 20, color: '#6366f1' }} />
                    Produit
                  </Box>
                </MenuItem>
                <MenuItem value="service">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BuildIcon sx={{ fontSize: 20, color: '#10b981' }} />
                    Service
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            >
              <InputLabel>Devise</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Devise"
                startAdornment={
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="EUR">€ Euro (EUR)</MenuItem>
                <MenuItem value="GBP">£ Livre Sterling (GBP)</MenuItem>
                <MenuItem value="USD">$ Dollar US (USD)</MenuItem>
                <MenuItem value="DZD">DA Dinar Algérien (DZD)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={`Prix HT (${formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : formData.currency === 'DZD' ? 'DA' : '$'})`}
              name="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            />
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
              }}
            >
              <InputLabel>Taux TVA</InputLabel>
              <Select
                name="tva_rate"
                value={formData.tva_rate}
                onChange={handleChange}
                label="Taux TVA"
                startAdornment={
                  <InputAdornment position="start">
                    <PercentIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                }
              >
                {config.tvaRates.map((rate) => (
                  <MenuItem key={rate.value} value={rate.value}>
                    {rate.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formData.category === 'produit' && (
              <TextField
                label="Stock disponible"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 0, step: "1" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon sx={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                    fontWeight: 600,
                  },
                }}
                helperText="Quantité disponible en stock"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              color: '#64748b',
              '&:hover': {
                bgcolor: alpha('#64748b', 0.1),
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            {editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;