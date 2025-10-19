// /**
//  * Page Factures
//  */
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Paper,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Tabs,
//   Tab,
// } from '@mui/material';
// import { 
//   Add as AddIcon, 
//   Visibility as ViewIcon, 
//   Download as DownloadIcon,
//   Edit as EditIcon,
// } from '@mui/icons-material';
// import { invoiceService } from '@/services/invoiceService';
// import type { Invoice } from '@/types';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

// const InvoicesPage = () => {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tabValue, setTabValue] = useState(0);

//   useEffect(() => {
//     loadInvoices();
//   }, [tabValue]);

//   const loadInvoices = async () => {
//     try {
//       const isQuote = tabValue === 1;
//       const data = await invoiceService.getAll(undefined, isQuote);
//       setInvoices(data);
//     } catch (error) {
//       console.error('Erreur chargement factures:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadPDF = async (id: number) => {
//     try {
//       const blob = await invoiceService.downloadPDF(id);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `facture-${id}.pdf`;
//       link.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Erreur téléchargement PDF:', error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return 'success';
//       case 'unpaid':
//         return 'error';
//       case 'partial':
//         return 'warning';
//       case 'cancelled':
//         return 'default';
//       default:
//         return 'default';
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     const labels: Record<string, string> = {
//       paid: 'Payée',
//       unpaid: 'Non payée',
//       partial: 'Partielle',
//       cancelled: 'Annulée',
//     };
//     return labels[status] || status;
//   };

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
//         <Typography variant="h4">Factures & Devis</Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => alert('Création de facture à venir')}
//         >
//           Nouvelle facture
//         </Button>
//       </Box>

//       <Paper sx={{ mb: 2 }}>
//         <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
//           <Tab label="Factures" />
//           <Tab label="Devis" />
//         </Tabs>
//       </Paper>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Numéro</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Client</TableCell>
//               <TableCell align="right">Montant HT</TableCell>
//               <TableCell align="right">TVA</TableCell>
//               <TableCell align="right">Total TTC</TableCell>
//               <TableCell>Statut</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {invoices.map((invoice) => (
//               <TableRow key={invoice.id}>
//                 <TableCell>{invoice.invoice_number}</TableCell>
//                 <TableCell>
//                   {format(new Date(invoice.date), 'dd/MM/yyyy', { locale: fr })}
//                 </TableCell>
//                 <TableCell>Client #{invoice.client_id}</TableCell>
//                 <TableCell align="right">{invoice.total_ht.toFixed(2)} DA</TableCell>
//                 <TableCell align="right">{invoice.tva_amount.toFixed(2)} DA</TableCell>
//                 <TableCell align="right">{invoice.total_ttc.toFixed(2)} DA</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={getStatusLabel(invoice.status)} 
//                     color={getStatusColor(invoice.status) as any}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell align="right">
//                   <IconButton size="small" onClick={() => alert('Voir détails')}>
//                     <ViewIcon />
//                   </IconButton>
//                   <IconButton size="small" onClick={() => handleDownloadPDF(invoice.id)}>
//                     <DownloadIcon />
//                   </IconButton>
//                   <IconButton size="small" onClick={() => alert('Modifier facture')}>
//                     <EditIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {invoices.length === 0 && (
//         <Box sx={{ textAlign: 'center', py: 4 }}>
//           <Typography color="text.secondary">
//             Aucune {tabValue === 0 ? 'facture' : 'devis'} trouvée
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default InvoicesPage;




/**
 * Page Factures - Design Moderne
 */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Grid,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon, 
  Download as DownloadIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { invoiceService } from '@/services/invoiceService';
import type { Invoice } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
  }, [tabValue]);

  const loadInvoices = async () => {
    try {
      const isQuote = tabValue === 1;
      const data = await invoiceService.getAll(undefined, isQuote);
      setInvoices(data);
    } catch (error) {
      console.error('Erreur chargement factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const blob = await invoiceService.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'unpaid':
        return '#ef4444';
      case 'partial':
        return '#f59e0b';
      case 'cancelled':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'unpaid':
        return <CancelIcon sx={{ fontSize: 16 }} />;
      case 'partial':
        return <HourglassIcon sx={{ fontSize: 16 }} />;
      case 'cancelled':
        return <CancelIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Payée',
      unpaid: 'Non payée',
      partial: 'Partielle',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client_id.toString().includes(searchTerm)
  );

  // Statistiques
  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.total_ttc, 0),
    paid: invoices.filter(inv => inv.status === 'paid').length,
    unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
    partial: invoices.filter(inv => inv.status === 'partial').length,
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
            <ReceiptIcon sx={{ color: '#6366f1', fontSize: 28 }} />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des {tabValue === 0 ? 'factures' : 'devis'}...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
              Factures & Devis
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<ReceiptIcon sx={{ fontSize: 16 }} />}
                label={`${invoices.length} document${invoices.length !== 1 ? 's' : ''}`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                label={`${stats.total.toLocaleString('fr-DZ')} DA`}
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
            onClick={() => alert('Création de facture à venir')}
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
            Nouvelle facture
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
                  Payées
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
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.paid}
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
              borderColor: alpha('#ef4444', 0.2),
              background: alpha('#ef4444', 0.05),
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 20px ${alpha('#ef4444', 0.2)}`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444', fontSize: '0.8125rem' }}>
                  Non payées
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha('#ef4444', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CancelIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.unpaid}
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
                  Partielles
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
                  <HourglassIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {stats.partial}
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
                  Total
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
                  <ReceiptIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onglets modernes */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, val) => setTabValue(val)}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 56,
              color: '#64748b',
              '&.Mui-selected': {
                color: '#6366f1',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              bgcolor: '#6366f1',
            },
          }}
        >
          <Tab
            icon={<ReceiptIcon sx={{ fontSize: 20, mb: 0.5 }} />}
            iconPosition="start"
            label="Factures"
          />
          <Tab
            icon={<DescriptionIcon sx={{ fontSize: 20, mb: 0.5 }} />}
            iconPosition="start"
            label="Devis"
          />
        </Tabs>
      </Card>

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
            placeholder="Rechercher par numéro ou client..."
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

      {/* Tableau des factures */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
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
                Numéro
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
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                Client
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
                Montant HT
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
                Total TTC
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
                Statut
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
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
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
                      {tabValue === 0 ? (
                        <ReceiptIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                      ) : (
                        <DescriptionIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                      )}
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {searchTerm
                        ? `Aucun${tabValue === 0 ? 'e facture' : ' devis'} trouvé${tabValue === 0 ? 'e' : ''}`
                        : `Aucun${tabValue === 0 ? 'e facture' : ' devis'} enregistré${tabValue === 0 ? 'e' : ''}`}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => alert('Création de facture à venir')}
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
                        Créer votre premi{tabValue === 0 ? 'ère facture' : 'er devis'}
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha('#6366f1', 0.02),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#6366f1' }}>
                      {invoice.invoice_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                      {format(new Date(invoice.date), 'dd/MM/yyyy', { locale: fr })}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Chip
                      label={`Client #${invoice.client_id}`}
                      size="small"
                      sx={{
                        bgcolor: alpha('#6366f1', 0.1),
                        color: '#6366f1',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                      {invoice.total_ht.toLocaleString('fr-DZ')} DA
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                      {invoice.tva_amount.toLocaleString('fr-DZ')} DA
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {invoice.total_ttc.toLocaleString('fr-DZ')} DA
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(invoice.status)}
                      label={getStatusLabel(invoice.status)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(invoice.status), 0.1),
                        color: getStatusColor(invoice.status),
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: alpha(getStatusColor(invoice.status), 0.3),
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={() => alert('Voir détails')}
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
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDownloadPDF(invoice.id)}
                        size="small"
                        sx={{
                          bgcolor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          '&:hover': {
                            bgcolor: alpha('#10b981', 0.2),
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => alert('Modifier facture')}
                        size="small"
                        sx={{
                          bgcolor: alpha('#f59e0b', 0.1),
                          color: '#f59e0b',
                          '&:hover': {
                            bgcolor: alpha('#f59e0b', 0.2),
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoicesPage;