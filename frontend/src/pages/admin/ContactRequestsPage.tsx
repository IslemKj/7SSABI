/**
 * Page Admin - Contact Requests
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
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  TablePagination,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { contactService, type ContactRequest } from '@/services/contactService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContactRequestsPage = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [unprocessedOnly, setUnprocessedOnly] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [page, pageSize, unprocessedOnly]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await contactService.getContactRequests(page + 1, pageSize, unprocessedOnly);
      setRequests(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: ContactRequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || '');
    setDialogOpen(true);
  };

  const handleMarkProcessed = async () => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    try {
      await contactService.markAsProcessed(selectedRequest.id, notes);
      setDialogOpen(false);
      loadRequests();
    } catch (error) {
      console.error('Error marking as processed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Demandes de Contact
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Total: {total} demande{total !== 1 ? 's' : ''}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={unprocessedOnly}
                  onChange={(e) => {
                    setUnprocessedOnly(e.target.checked);
                    setPage(0);
                  }}
                />
              }
              label="Non traitées uniquement"
            />
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Sujet</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Chip
                      size="small"
                      label={request.request_type}
                      color={request.request_type === 'demo' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{request.name || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      {request.email}
                    </Box>
                  </TableCell>
                  <TableCell>{request.subject || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={request.is_processed ? <CheckIcon /> : undefined}
                      label={request.is_processed ? 'Traité' : 'En attente'}
                      color={request.is_processed ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewRequest(request)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Aucune demande trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </TableContainer>
      )}

      {/* View/Process Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Détails de la demande</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                <Chip label={selectedRequest.request_type} size="small" />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
                <Typography>{selectedRequest.name || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography>{selectedRequest.email}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Sujet</Typography>
                <Typography>{selectedRequest.subject || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                <Typography>{selectedRequest.message || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                <Typography>
                  {format(new Date(selectedRequest.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                <Chip
                  label={selectedRequest.is_processed ? 'Traité' : 'En attente'}
                  color={selectedRequest.is_processed ? 'success' : 'warning'}
                  size="small"
                />
              </Box>

              {!selectedRequest.is_processed && (
                <TextField
                  label="Notes (optionnel)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur le traitement de cette demande..."
                  fullWidth
                />
              )}

              {selectedRequest.is_processed && selectedRequest.notes && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography>{selectedRequest.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Fermer
          </Button>
          {selectedRequest && !selectedRequest.is_processed && (
            <Button
              variant="contained"
              onClick={handleMarkProcessed}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={16} /> : <CheckIcon />}
            >
              Marquer comme traité
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactRequestsPage;
