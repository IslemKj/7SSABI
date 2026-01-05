/**
 * Page Admin - Gestion des Utilisateurs
 */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  PersonOff as PersonOffIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { adminService } from '@/services/adminService';
import type { User, UserStats } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedUserStats, setSelectedUserStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, pageSize]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(page, pageSize, searchTerm || undefined);
      setUsers(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleToggleActive = async (userId: number) => {
    try {
      await adminService.toggleUserActive(userId);
      loadUsers();
    } catch (error) {
      console.error('Erreur toggle active:', error);
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      if (user.role === 'admin') {
        if (confirm(`Retirer les droits administrateur de ${user.name} ?`)) {
          await adminService.removeUserAdmin(user.id);
          loadUsers();
        }
      } else {
        if (confirm(`Promouvoir ${user.name} en administrateur ?`)) {
          await adminService.makeUserAdmin(user.id);
          loadUsers();
        }
      }
    } catch (error) {
      console.error('Erreur toggle admin:', error);
      alert('Erreur lors de la modification du rôle');
    }
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ?\n\nToutes ses données (clients, factures, produits, dépenses) seront également supprimées. Cette action est irréversible.`)) {
      try {
        await adminService.deleteUser(user.id);
        loadUsers();
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleViewStats = async (user: User) => {
    try {
      setLoadingStats(true);
      setStatsDialogOpen(true);
      const stats = await adminService.getUserStats(user.id);
      setSelectedUserStats(stats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      alert('Erreur lors du chargement des statistiques');
      setStatsDialogOpen(false);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading && users.length === 0) {
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
        <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des utilisateurs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
          Administration
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.95, fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}>
          Gestion des utilisateurs • {total} utilisateur{total !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Barre de recherche */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.06)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#dc2626' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearchTerm(''); setPage(1); loadUsers(); }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: alpha('#dc2626', 0.03),
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: alpha('#dc2626', 0.2) },
                  '&.Mui-focused fieldset': { borderColor: '#dc2626', borderWidth: 2 },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                bgcolor: '#dc2626',
                '&:hover': { bgcolor: '#b91c1c' },
                borderRadius: 2,
                px: 4,
                minWidth: 120,
              }}
            >
              Rechercher
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.06)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha('#dc2626', 0.05) }}>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Utilisateur
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5, display: { xs: 'none', md: 'table-cell' } }}>
                Entreprise
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Rôle
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Statut
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{user.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>{user.email}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Créé le {format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr })}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Typography variant="body2">{user.entreprise_name || '-'}</Typography>
                  {user.nif && <Typography variant="caption" sx={{ color: '#64748b' }}>NIF: {user.nif}</Typography>}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={user.role === 'admin' ? <AdminIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
                    label={user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    size="small"
                    sx={{
                      bgcolor: user.role === 'admin' ? alpha('#dc2626', 0.1) : alpha('#6366f1', 0.1),
                      color: user.role === 'admin' ? '#dc2626' : '#6366f1',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: user.role === 'admin' ? alpha('#dc2626', 0.3) : alpha('#6366f1', 0.3),
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={user.is_active ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <BlockIcon sx={{ fontSize: 16 }} />}
                    label={user.is_active ? 'Actif' : 'Inactif'}
                    size="small"
                    sx={{
                      bgcolor: user.is_active ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                      color: user.is_active ? '#10b981' : '#64748b',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: user.is_active ? alpha('#10b981', 0.3) : alpha('#64748b', 0.3),
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => handleViewStats(user)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#6366f1', 0.1),
                        color: '#6366f1',
                        '&:hover': { bgcolor: alpha('#6366f1', 0.2) },
                      }}
                      title="Voir statistiques"
                    >
                      <AssessmentIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleToggleActive(user.id)}
                      size="small"
                      sx={{
                        bgcolor: user.is_active ? alpha('#f59e0b', 0.1) : alpha('#10b981', 0.1),
                        color: user.is_active ? '#f59e0b' : '#10b981',
                        '&:hover': { bgcolor: user.is_active ? alpha('#f59e0b', 0.2) : alpha('#10b981', 0.2) },
                      }}
                      title={user.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {user.is_active ? <PersonOffIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleToggleAdmin(user)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#8b5cf6', 0.1),
                        color: '#8b5cf6',
                        '&:hover': { bgcolor: alpha('#8b5cf6', 0.2) },
                      }}
                      title={user.role === 'admin' ? 'Retirer admin' : 'Promouvoir admin'}
                    >
                      <AdminIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                        '&:hover': { bgcolor: alpha('#ef4444', 0.2) },
                      }}
                      title="Supprimer"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
            bgcolor: alpha('#dc2626', 0.03),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)} sur {total} utilisateurs
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

      {/* Dialog Statistiques */}
      <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#dc2626', color: 'white', fontWeight: 700 }}>
          Statistiques Utilisateur
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {loadingStats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedUserStats && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                {selectedUserStats.user_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedUserStats.user_email}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#6366f1', 0.1), border: '1px solid', borderColor: alpha('#6366f1', 0.3) }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>
                        {selectedUserStats.invoice_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Factures</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#10b981', 0.1), border: '1px solid', borderColor: alpha('#10b981', 0.3) }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
                        {selectedUserStats.total_revenue.toLocaleString()} DA
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Revenu Total</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#f59e0b', 0.1), border: '1px solid', borderColor: alpha('#f59e0b', 0.3) }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                        {selectedUserStats.client_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Clients</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#8b5cf6', 0.1), border: '1px solid', borderColor: alpha('#8b5cf6', 0.3) }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#8b5cf6' }}>
                        {selectedUserStats.product_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Produits</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)} sx={{ borderRadius: 2 }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
