/**
 * Suivi des Créances — Vieillissement des factures impayées
 */
import { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Chip, Button, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, alpha, Container, Divider, LinearProgress, Tooltip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  WhatsApp as WhatsAppIcon,
  HourglassEmpty as HourglassIcon,
  CheckCircle as OkIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import api from '@/services/api';

interface AgingRecord {
  id: number;
  invoice_number: string;
  client_name: string;
  date: string;
  due_date: string;
  total_ttc: number;
  paid_amount: number;
  remaining: number;
  currency: string;
  total_dzd: number;
  days_late: number;
}

interface DebtAgingData {
  total_outstanding_dzd: number;
  total_invoices: number;
  buckets: {
    '0_30': AgingRecord[];
    '31_60': AgingRecord[];
    '61_90': AgingRecord[];
    'over_90': AgingRecord[];
  };
}

const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
const fmtDate = (s: string) => new Date(s).toLocaleDateString('fr-FR');

const BUCKETS = [
  { key: '0_30' as const, label: '0 — 30 jours', color: '#10b981', severity: 'Courant' },
  { key: '31_60' as const, label: '31 — 60 jours', color: '#f59e0b', severity: 'Retard modéré' },
  { key: '61_90' as const, label: '61 — 90 jours', color: '#f97316', severity: 'Retard important' },
  { key: 'over_90' as const, label: '+ 90 jours', color: '#ef4444', severity: 'Critique' },
];

const getCurrencySymbol = (c: string) =>
  ({ EUR: '€', GBP: '£', USD: '$', DZD: 'DA' }[c] ?? c);

const buildWhatsappMessage = (inv: AgingRecord) => {
  const msg = `Bonjour,\n\nNous vous rappelons que la facture N°${inv.invoice_number} d'un montant de ${fmt(inv.remaining)} ${getCurrencySymbol(inv.currency)} est impayée depuis le ${fmtDate(inv.due_date)}.\n\nMerci de régulariser votre situation dans les meilleurs délais.\n\nCordialement.`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
};

const InvoiceTable = ({ records, color }: { records: AgingRecord[]; color: string }) => {
  if (records.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <OkIcon sx={{ color: '#10b981', fontSize: 32, mb: 1 }} />
        <Typography variant="body2" color="text.secondary">Aucune facture dans cette tranche</Typography>
      </Box>
    );
  }
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>N° Facture</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Échéance</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Retard</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Restant dû</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Relance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((inv) => (
            <TableRow key={inv.id} sx={{ '&:hover': { bgcolor: alpha(color, 0.04) } }}>
              <TableCell sx={{ fontWeight: 600, color }}>{inv.invoice_number}</TableCell>
              <TableCell>{inv.client_name}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{fmtDate(inv.due_date)}</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${inv.days_late} j`}
                  size="small"
                  sx={{
                    bgcolor: alpha(color, 0.1),
                    color,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {fmt(inv.remaining)} {getCurrencySymbol(inv.currency)}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  href={buildWhatsappMessage(inv)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: '#25d366',
                    color: '#25d366',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: alpha('#25d366', 0.08), borderColor: '#25d366' },
                  }}
                >
                  Relancer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DebtAgingPage = () => {
  const [data, setData] = useState<DebtAgingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/dashboard/debt-aging').then(r => setData(r.data))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Typography color="text.secondary">Chargement...</Typography>
    </Box>;
  }

  const bucketTotals = BUCKETS.map(b => ({
    ...b,
    records: data?.buckets[b.key] ?? [],
    total: (data?.buckets[b.key] ?? []).reduce((a, i) => a + i.remaining, 0),
  }));

  const totalOutstanding = data?.total_outstanding_dzd ?? 0;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4, pt: { xs: 3, sm: 4 }, pb: { xs: 4, sm: 5 }, px: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <HourglassIcon sx={{ fontSize: 36 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
                Suivi des Créances
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Vieillissement des factures impayées · Relances WhatsApp intégrées
            </Typography>
          </Box>
        </Box>

        {/* KPI summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}>
                  Total impayé
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', mt: 0.5 }}>
                  {fmt(totalOutstanding)} DA
                </Typography>
                <Typography variant="caption" color="text.secondary">{data?.total_invoices ?? 0} facture(s)</Typography>
              </CardContent>
            </Card>
          </Grid>
          {bucketTotals.map(b => (
            <Grid item xs={12} sm={6} md={3} key={b.key}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: alpha(b.color, 0.25), background: alpha(b.color, 0.04) }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1, color: b.color }}>
                    {b.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: b.color, mt: 0.5 }}>
                    {fmt(b.total)} DA
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{b.records.length} facture(s)</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Repartition bar */}
        {totalOutstanding > 0 && (
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Répartition du solde impayé</Typography>
              <Box sx={{ display: 'flex', height: 24, borderRadius: 2, overflow: 'hidden' }}>
                {bucketTotals.filter(b => b.total > 0).map(b => (
                  <Tooltip title={`${b.label}: ${fmt(b.total)} DA`} key={b.key}>
                    <Box
                      sx={{
                        width: `${(b.total / totalOutstanding) * 100}%`,
                        bgcolor: b.color,
                        transition: 'all 0.3s',
                        '&:hover': { filter: 'brightness(1.1)' },
                        cursor: 'default',
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                {bucketTotals.filter(b => b.total > 0).map(b => (
                  <Box key={b.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: b.color }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tables per bucket */}
        {bucketTotals.map(b => (
          <Card key={b.key} elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: b.records.length > 0 ? alpha(b.color, 0.25) : 'rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 2, bgcolor: b.color }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{b.label}</Typography>
                <Chip label={b.severity} size="small" sx={{ bgcolor: alpha(b.color, 0.12), color: b.color, fontWeight: 600 }} />
                {b.records.length > 0 && (
                  <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 700, color: b.color }}>
                    {fmt(b.total)} DA
                  </Typography>
                )}
              </Box>
              <InvoiceTable records={b.records} color={b.color} />
            </CardContent>
          </Card>
        ))}

        {(data?.total_invoices ?? 0) === 0 && (
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <CardContent sx={{ py: 6 }}>
              <OkIcon sx={{ fontSize: 56, color: '#10b981', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>Excellent !</Typography>
              <Typography color="text.secondary">Vous n'avez aucune facture impayée en ce moment.</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default DebtAgingPage;
