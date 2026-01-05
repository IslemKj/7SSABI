// /**
//  * Page Clients
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
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import { clientService } from '@/services/clientService';
// import type { Client, ClientFormData } from '@/types';

// const ClientsPage = () => {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingClient, setEditingClient] = useState<Client | null>(null);
//   const [formData, setFormData] = useState<ClientFormData>({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     nif: '',
//   });

//   useEffect(() => {
//     loadClients();
//   }, []);

//   const loadClients = async () => {
//     try {
//       const data = await clientService.getAll();
//       setClients(data);
//     } catch (error) {
//       console.error('Erreur chargement clients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenDialog = (client?: Client) => {
//     if (client) {
//       setEditingClient(client);
//       setFormData({
//         name: client.name,
//         email: client.email || '',
//         phone: client.phone || '',
//         address: client.address || '',
//         nif: client.nif || '',
//       });
//     } else {
//       setEditingClient(null);
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         address: '',
//         nif: '',
//       });
//     }
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setEditingClient(null);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingClient) {
//         await clientService.update(editingClient.id, formData);
//       } else {
//         await clientService.create(formData);
//       }
//       handleCloseDialog();
//       loadClients();
//     } catch (error) {
//       console.error('Erreur sauvegarde client:', error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
//       try {
//         await clientService.delete(id);
//         loadClients();
//       } catch (error) {
//         console.error('Erreur suppression client:', error);
//       }
//     }
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
//         <Typography variant="h4">Clients</Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpenDialog()}
//         >
//           Nouveau client
//         </Button>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Nom</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Téléphone</TableCell>
//               <TableCell>NIF</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {clients.map((client) => (
//               <TableRow key={client.id}>
//                 <TableCell>{client.name}</TableCell>
//                 <TableCell>{client.email || '-'}</TableCell>
//                 <TableCell>{client.phone || '-'}</TableCell>
//                 <TableCell>{client.nif || '-'}</TableCell>
//                 <TableCell align="right">
//                   <IconButton onClick={() => handleOpenDialog(client)} size="small">
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(client.id)} size="small" color="error">
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
//         <DialogTitle>{editingClient ? 'Modifier' : 'Nouveau'} Client</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
//             <TextField
//               label="Nom"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Téléphone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Adresse"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               multiline
//               rows={2}
//               fullWidth
//             />
//             <TextField
//               label="NIF"
//               name="nif"
//               value={formData.nif}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Annuler</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             {editingClient ? 'Modifier' : 'Créer'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ClientsPage;



/**
 * Page Clients - Design Moderne
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
  alpha,
  InputAdornment,
  Chip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { clientService } from '@/services/clientService';
import type { Client, ClientFormData } from '@/types';

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{success: boolean; created_count: number; errors: string[]; message: string} | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    nif: '',
    rc_number: '',
  });

  useEffect(() => {
    loadClients();
  }, [page, pageSize]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll(page, pageSize);
      setClients(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        nif: client.nif || '',
        rc_number: client.rc_number || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        nif: '',
        rc_number: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, formData);
      } else {
        await clientService.create(formData);
      }
      handleCloseDialog();
      loadClients();
    } catch (error) {
      console.error('Erreur sauvegarde client:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.delete(id);
        loadClients();
      } catch (error) {
        console.error('Erreur suppression client:', error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImportFile(event.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImportCSV = async () => {
    if (!importFile) return;
    
    setImporting(true);
    try {
      const result = await clientService.importCSV(importFile);
      setImportResult(result);
      loadClients();
      setImportFile(null);
    } catch (error) {
      console.error('Erreur import CSV:', error);
      alert('Erreur lors de l\'import du fichier CSV');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = 'name,email,phone,address,nif,rc_number,company_name\n' +
                      'Jean Dupont,jean@example.com,0123456789,123 rue Example,FR123456789,RC123,Dupont SARL\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_clients.csv';
    link.click();
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm) ||
    client.nif?.includes(searchTerm)
  );

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
            <PeopleIcon sx={{ color: '#6366f1', fontSize: 28 }} />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des clients...
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
              Clients
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.95,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              Gérez votre base de clients • {clients.length} client{clients.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setImportDialogOpen(true)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                px: 2.5,
                py: 1.5,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              Importer CSV
            </Button>
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
              Nouveau client
            </Button>
          </Box>
        </Box>
      </Box>

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
            placeholder="Rechercher un client par nom, email, téléphone ou NIF..."
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

      {/* Tableau des clients */}
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
                Client
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
                Contact
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
                NIF
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
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 8 }}>
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
                      <PeopleIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré'}
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
                        Créer votre premier client
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client, index) => (
                <TableRow
                  key={client.id}
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
                          bgcolor: alpha('#6366f1', 0.15),
                          color: '#6366f1',
                          fontWeight: 700,
                          fontSize: '1.125rem',
                        }}
                      >
                        {client.name.charAt(0).toUpperCase()}
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
                          {client.name}
                        </Typography>
                        <Box
                          sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexDirection: 'column',
                            gap: 0.5,
                          }}
                        >
                          {client.email && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <EmailIcon sx={{ fontSize: 14 }} />
                              {client.email}
                            </Typography>
                          )}
                          {client.phone && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <PhoneIcon sx={{ fontSize: 14 }} />
                              {client.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {client.email ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {client.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          -
                        </Typography>
                      )}
                      {client.phone ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {client.phone}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          -
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {client.nif ? (
                      <Chip
                        icon={<BadgeIcon sx={{ fontSize: 16 }} />}
                        label={client.nif}
                        size="small"
                        sx={{
                          bgcolor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: alpha('#10b981', 0.3),
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={() => handleOpenDialog(client)}
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
                        onClick={() => handleDelete(client.id)}
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
            bgcolor: alpha('#6366f1', 0.03),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)} sur {total} clients
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
          {editingClient ? 'Modifier le client' : 'Nouveau client'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nom complet"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon sx={{ color: '#6366f1' }} />
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#6366f1' }} />
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
              label="Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#6366f1' }} />
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
              label="Adresse"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <LocationIcon sx={{ color: '#6366f1' }} />
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
              label="NIF (Numéro d'Identification Fiscale)"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: '#6366f1' }} />
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
              label="N° RC ou CAE"
              name="rc_number"
              value={formData.rc_number}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: '#6366f1' }} />
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
            {editingClient ? 'Enregistrer les modifications' : 'Créer le client'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);
          setImportFile(null);
          setImportResult(null);
        }}
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
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <UploadIcon sx={{ fontSize: 28 }} />
            Importer des clients (CSV)
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Instructions */}
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Importez plusieurs clients en une fois à l'aide d'un fichier CSV. Le fichier doit contenir les colonnes suivantes :
              </Typography>
              <Box sx={{ 
                bgcolor: alpha('#667eea', 0.05), 
                p: 2, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#667eea', 0.2),
              }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  name, email, phone, address, nif, rc_number, company_name
                </Typography>
              </Box>
            </Box>

            {/* Download Template */}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5568d3',
                  bgcolor: alpha('#667eea', 0.05),
                },
              }}
            >
              Télécharger le modèle CSV
            </Button>

            {/* File Upload */}
            <Box>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="csv-file-upload">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: alpha('#667eea', 0.1),
                    color: '#667eea',
                    border: '2px dashed',
                    borderColor: '#667eea',
                    '&:hover': {
                      background: alpha('#667eea', 0.15),
                    },
                  }}
                >
                  {importFile ? importFile.name : 'Choisir un fichier CSV'}
                </Button>
              </label>
            </Box>

            {/* Import Result */}
            {importResult && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: importResult.success ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                  border: '1px solid',
                  borderColor: importResult.success ? '#10b981' : '#ef4444',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {importResult.message}
                </Typography>
                {importResult.errors.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#ef4444' }}>
                      Erreurs :
                    </Typography>
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <Typography key={index} variant="caption" sx={{ display: 'block', color: '#ef4444' }}>
                        • {error}
                      </Typography>
                    ))}
                    {importResult.errors.length > 5 && (
                      <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic' }}>
                        ... et {importResult.errors.length - 5} autre(s) erreur(s)
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => {
              setImportDialogOpen(false);
              setImportFile(null);
              setImportResult(null);
            }}
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
            Fermer
          </Button>
          <Button
            onClick={handleImportCSV}
            variant="contained"
            disabled={!importFile || importing}
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
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              },
            }}
          >
            {importing ? 'Import en cours...' : 'Importer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;