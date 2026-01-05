// /**
//  * Page Dépenses
//  */
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Paper,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import { expenseService } from '@/services/expenseService';
// import { config } from '@/config/config';
// import type { Expense, ExpenseFormData } from '@/types';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

// const ExpensesPage = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
//   const [formData, setFormData] = useState<ExpenseFormData>({
//     category: '',
//     amount: 0,
//     date: new Date().toISOString().split('T')[0],
//     description: '',
//   });

//   useEffect(() => {
//     loadExpenses();
//   }, []);

//   const loadExpenses = async () => {
//     try {
//       const data = await expenseService.getAll();
//       setExpenses(data);
//     } catch (error) {
//       console.error('Erreur chargement dépenses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenDialog = (expense?: Expense) => {
//     if (expense) {
//       setEditingExpense(expense);
//       setFormData({
//         category: expense.category,
//         amount: expense.amount,
//         date: expense.date.split('T')[0],
//         description: expense.description || '',
//       });
//     } else {
//       setEditingExpense(null);
//       setFormData({
//         category: '',
//         amount: 0,
//         date: new Date().toISOString().split('T')[0],
//         description: '',
//       });
//     }
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setEditingExpense(null);
//   };

//   const handleChange = (e: any) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingExpense) {
//         await expenseService.update(editingExpense.id, formData);
//       } else {
//         await expenseService.create(formData);
//       }
//       handleCloseDialog();
//       loadExpenses();
//     } catch (error) {
//       console.error('Erreur sauvegarde dépense:', error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
//       try {
//         await expenseService.delete(id);
//         loadExpenses();
//       } catch (error) {
//         console.error('Erreur suppression dépense:', error);
//       }
//     }
//   };

//   // Calculer le total
//   const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Box>
//           <Typography variant="h4">Dépenses</Typography>
//           <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
//             Total: {totalExpenses.toFixed(2)} DA
//           </Typography>
//         </Box>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpenDialog()}
//         >
//           Nouvelle dépense
//         </Button>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Catégorie</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell align="right">Montant</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {expenses.map((expense) => (
//               <TableRow key={expense.id}>
//                 <TableCell>
//                   {format(new Date(expense.date), 'dd/MM/yyyy', { locale: fr })}
//                 </TableCell>
//                 <TableCell>{expense.category}</TableCell>
//                 <TableCell>{expense.description || '-'}</TableCell>
//                 <TableCell align="right">{expense.amount.toFixed(2)} DA</TableCell>
//                 <TableCell align="right">
//                   <IconButton onClick={() => handleOpenDialog(expense)} size="small">
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(expense.id)} size="small" color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Dialog de formulaire */}
//       <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingExpense ? 'Modifier' : 'Nouvelle'} Dépense</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
//             <TextField
//               label="Date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />
//             <FormControl fullWidth required>
//               <InputLabel>Catégorie</InputLabel>
//               <Select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 label="Catégorie"
//               >
//                 {config.expenseCategories.map((cat) => (
//                   <MenuItem key={cat} value={cat}>
//                     {cat}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               label="Montant (DA)"
//               name="amount"
//               type="number"
//               value={formData.amount}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               multiline
//               rows={3}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Annuler</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             {editingExpense ? 'Modifier' : 'Créer'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ExpensesPage;



/**
 * Page Dépenses - Design Moderne
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
  Chip,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  TrendingDown,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { expenseService } from '@/services/expenseService';
import { config } from '@/config/config';
import type { Expense, ExpenseFormData } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ExpenseFormData>({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    loadExpenses();
  }, [page, pageSize]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll(page, pageSize);
      setExpenses(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement dépenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        category: expense.category,
        amount: expense.amount,
        date: expense.date.split('T')[0],
        description: expense.description || '',
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, formData);
      } else {
        await expenseService.create(formData);
      }
      handleCloseDialog();
      loadExpenses();
    } catch (error) {
      console.error('Erreur sauvegarde dépense:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await expenseService.delete(id);
        loadExpenses();
      } catch (error) {
        console.error('Erreur suppression dépense:', error);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(expense.date), 'dd/MM/yyyy').includes(searchTerm)
  );

  // Grouper par catégorie
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    'Salaires': '#6366f1',
    'Loyer': '#8b5cf6',
    'Électricité': '#f59e0b',
    'Internet': '#3b82f6',
    'Fournitures': '#10b981',
    'Marketing': '#ec4899',
    'Transport': '#14b8a6',
    'Autre': '#64748b',
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
          <CircularProgress size={60} thickness={4} sx={{ color: '#ef4444' }} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <AccountBalanceIcon sx={{ color: '#ef4444', fontSize: 28 }} />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des dépenses...
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
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
              Dépenses
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {totalExpenses.toLocaleString('fr-FR')} DA
              </Typography>
              <Chip
                icon={<TrendingDown sx={{ fontSize: 16 }} />}
                label={`${expenses.length} dépense${expenses.length !== 1 ? 's' : ''}`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: 'white',
              color: '#ef4444',
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
            Nouvelle dépense
          </Button>
        </Box>
      </Box>

      {/* Statistiques par catégorie */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(categoryColors[category] || '#64748b', 0.2),
                  background: alpha(categoryColors[category] || '#64748b', 0.05),
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 20px ${alpha(categoryColors[category] || '#64748b', 0.2)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: categoryColors[category] || '#64748b',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {category}
                    </Typography>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: alpha(categoryColors[category] || '#64748b', 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 18, color: categoryColors[category] || '#64748b' }} />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {amount.toLocaleString('fr-FR')} DA
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
            placeholder="Rechercher par catégorie, description ou date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#ef4444' }} />
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
                bgcolor: alpha('#ef4444', 0.03),
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: alpha('#ef4444', 0.2),
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ef4444',
                  borderWidth: 2,
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tableau des dépenses */}
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
                bgcolor: alpha('#ef4444', 0.05),
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
                Date
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
                Description
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
                Montant
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
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
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
                        bgcolor: alpha('#ef4444', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AccountBalanceIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {searchTerm ? 'Aucune dépense trouvée' : 'Aucune dépense enregistrée'}
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
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': {
                            borderColor: '#ef4444',
                            bgcolor: alpha('#ef4444', 0.05),
                          },
                        }}
                      >
                        Créer votre première dépense
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha('#ef4444', 0.02),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          bgcolor: alpha('#ef4444', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {format(new Date(expense.date), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                      label={expense.category}
                      size="small"
                      sx={{
                        bgcolor: alpha(categoryColors[expense.category] || '#64748b', 0.1),
                        color: categoryColors[expense.category] || '#64748b',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: alpha(categoryColors[expense.category] || '#64748b', 0.3),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {expense.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: '#ef4444',
                        fontSize: '1rem',
                      }}
                    >
                      {expense.amount.toLocaleString('fr-FR')} DA
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={() => handleOpenDialog(expense)}
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
                        onClick={() => handleDelete(expense.id)}
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
              ))
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
            bgcolor: alpha('#ef4444', 0.03),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)} sur {total} dépenses
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
            py: 3,
          }}
        >
          {editingExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: '#ef4444' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#ef4444',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ef4444',
                  fontWeight: 600,
                },
              }}
            />
            <FormControl
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#ef4444',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ef4444',
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
                    <CategoryIcon sx={{ color: '#ef4444' }} />
                  </InputAdornment>
                }
              >
                {config.expenseCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: categoryColors[cat] || '#64748b',
                        }}
                      />
                      {cat}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Montant (DA)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: '#ef4444' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#ef4444',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ef4444',
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
                    <DescriptionIcon sx={{ color: '#ef4444' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#ef4444',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ef4444',
                  fontWeight: 600,
                },
              }}
            />
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
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
              },
            }}
          >
            {editingExpense ? 'Enregistrer les modifications' : 'Créer la dépense'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesPage;