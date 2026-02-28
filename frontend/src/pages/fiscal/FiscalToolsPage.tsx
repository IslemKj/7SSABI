/**
 * Outils Fiscaux - IFU Estimator + CASNOS + Plafond CA
 * Dédié aux auto-entrepreneurs algériens
 */
import { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, Divider, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  alpha, Container,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  HealthAndSafety as HealthIcon,
} from '@mui/icons-material';
import api from '@/services/api';

interface FiscalStats {
  year: number;
  year_revenue_dzd: number;
  monthly_breakdown: { month: number; revenue: number }[];
  ceiling_services: number;
  ceiling_goods: number;
}

// IFU rates by activity type (Article 8 & 9 - Code des Impôts Directs Algérie)
const IFU_RATES: Record<string, { label: string; rate: number; description: string }[]> = {
  services: [
    { label: 'Prestations de services intellectuels / libérales', rate: 0.5, description: 'IT, design, conseil, enseignement...' },
    { label: 'Prestations de services ordinaires', rate: 1.5, description: 'Artisans, réparations, services divers' },
    { label: 'Activités hôtelières et de restauration', rate: 5, description: 'Cafés, restaurants, hôtels' },
    { label: 'Activités de transport', rate: 3, description: 'Transport de personnes ou de marchandises' },
  ],
  goods: [
    { label: 'Vente en détail de produits', rate: 1, description: 'Commerce de détail' },
    { label: 'Vente en gros de produits', rate: 0.5, description: 'Commerce de gros' },
    { label: 'Activités artisanales (production)', rate: 1, description: 'Fabrication et vente' },
  ],
};

const MONTHS_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
];

// CASNOS cotisation - Décret exécutif Algérie
// Base = bénéfice fiscal ou plafond (1/12 du SNMG × 12 × 32%)
// Simplified: 15% of annual revenue, min 25 000 DA
const CASNOS_RATE = 0.15;
const CASNOS_MIN = 25_000;
const CASNOS_MAX = 400_000;

const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

const FiscalToolsPage = () => {
  const [stats, setStats] = useState<FiscalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState<'services' | 'goods'>('services');
  const [selectedRate, setSelectedRate] = useState(0);

  useEffect(() => {
    api.get('/api/dashboard/fiscal-stats').then(r => {
      setStats(r.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (IFU_RATES[activityType].length > 0) {
      setSelectedRate(IFU_RATES[activityType][0].rate);
    }
  }, [activityType]);

  const revenue = stats?.year_revenue_dzd ?? 0;
  const ceiling = activityType === 'services'
    ? (stats?.ceiling_services ?? 8_000_000)
    : (stats?.ceiling_goods ?? 15_000_000);
  const ceilingPct = Math.min((revenue / ceiling) * 100, 100);

  const ifu = revenue * (selectedRate / 100);
  const casnos = Math.min(Math.max(revenue * CASNOS_RATE, CASNOS_MIN), CASNOS_MAX);
  const totalFiscal = ifu + casnos;
  const provision = totalFiscal / 12;

  const ceilingColor = ceilingPct >= 90 ? '#ef4444' : ceilingPct >= 75 ? '#f59e0b' : '#10b981';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="text.secondary">Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4, pt: { xs: 3, sm: 4 }, pb: { xs: 4, sm: 5 }, px: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <CalculateIcon sx={{ fontSize: 36 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
                Outils Fiscaux
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Estimations IFU · CASNOS · Plafond Chiffre d'Affaires — Année {stats?.year}
            </Typography>
          </Box>
        </Box>

        {/* Alert info */}
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.875rem' } }}
        >
          Ces estimations sont indicatives. Consultez votre recette des impôts ou un comptable pour vos obligations fiscales précises.
        </Alert>

        <Grid container spacing={3}>
          {/* ── Colonne gauche : configurateur ── */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalculateIcon sx={{ color: '#0d9488' }} /> Paramètres
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Type d'activité</InputLabel>
                  <Select
                    value={activityType}
                    label="Type d'activité"
                    onChange={(e) => setActivityType(e.target.value as 'services' | 'goods')}
                  >
                    <MenuItem value="services">Prestation de services</MenuItem>
                    <MenuItem value="goods">Vente de marchandises</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Nature de l'activité</InputLabel>
                  <Select
                    value={selectedRate}
                    label="Nature de l'activité"
                    onChange={(e) => setSelectedRate(Number(e.target.value))}
                  >
                    {IFU_RATES[activityType].map((r) => (
                      <MenuItem key={r.rate} value={r.rate}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{r.description}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#0d9488', 0.07), border: '1px solid', borderColor: alpha('#0d9488', 0.2) }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}>
                    CA {stats?.year} (factures encaissées)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0d9488', mt: 0.5 }}>
                    {fmt(revenue)} DA
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ── Colonne centre + droite : résultats ── */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>

              {/* Plafond CA */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: ceilingColor }} />
                        Plafond du Chiffre d'Affaires
                      </Typography>
                      <Chip
                        label={
                          ceilingPct >= 90 ? '⚠️ Proche du plafond !' :
                          ceilingPct >= 75 ? 'Attention (75%+)' : 'Dans les limites'
                        }
                        sx={{
                          bgcolor: alpha(ceilingColor, 0.12),
                          color: ceilingColor,
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    {ceilingPct >= 90 && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        Vous approchez du plafond légal ! Consultez un comptable pour régulariser votre situation fiscale.
                      </Alert>
                    )}
                    {ceilingPct >= 75 && ceilingPct < 90 && (
                      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                        Vous avez dépassé 75% du plafond autorisé. Anticipez votre situation fiscale.
                      </Alert>
                    )}

                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {fmt(revenue)} DA réalisés sur {fmt(ceiling)} DA autorisés
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: ceilingColor }}>
                        {ceilingPct.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={ceilingPct}
                      sx={{
                        height: 14, borderRadius: 7,
                        bgcolor: alpha(ceilingColor, 0.15),
                        '& .MuiLinearProgress-bar': { bgcolor: ceilingColor, borderRadius: 7 }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">0 DA</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reste : {fmt(Math.max(0, ceiling - revenue))} DA
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{fmt(ceiling)} DA</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
                      Plafond {activityType === 'services' ? 'services (8 000 000 DA)' : 'marchandises (15 000 000 DA)'} — Art. 282 bis CIDTA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* IFU */}
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceIcon sx={{ color: '#6366f1' }} /> Impôt Forfaitaire Unique
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                        Taux applicable
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>
                        {selectedRate}%
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Base imposable</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmt(revenue)} DA</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Taux IFU</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRate}%</Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: alpha('#6366f1', 0.07) }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>IFU estimé {stats?.year}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#6366f1' }}>{fmt(ifu)} DA</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                      À déclarer avant le 30 avril de l'année suivante. Acomptes provisionnels trimestriels recommandés.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* CASNOS */}
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HealthIcon sx={{ color: '#10b981' }} /> CASNOS
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                        Cotisation estimée
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
                        {fmt(casnos)} DA
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Taux (15% du CA)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmt(revenue * CASNOS_RATE)} DA</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Plancher</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmt(CASNOS_MIN)} DA</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Plafond</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmt(CASNOS_MAX)} DA</Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: alpha('#10b981', 0.07) }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>CASNOS {stats?.year}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#10b981' }}>{fmt(casnos)} DA</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                      Échéance : 30 septembre de l'année en cours. Payable à la CASNOS de votre wilaya.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Récapitulatif & Provisions */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, opacity: 0.9 }}>
                      Récapitulatif & Provisions conseillées
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
                          <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>IFU Annuel</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{fmt(ifu)} DA</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
                          <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>CASNOS Annuel</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{fmt(casnos)} DA</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Provision / mois</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{fmt(provision)} DA</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }}>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        💡 <strong>Conseil :</strong> Mettez de côté <strong>{fmt(provision)} DA par mois</strong> pour couvrir vos obligations fiscales et sociales de l'année {stats?.year}.
                        Total charges estimées : <strong>{fmt(totalFiscal)} DA</strong>.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Grid>

          {/* Tableau mensuel */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Détail mensuel — CA encaissé {stats?.year}
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Mois</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>CA (DA)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>IFU estimé</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Provision CASNOS</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total charges</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(stats?.monthly_breakdown ?? []).map((m) => {
                        const monthIFU = m.revenue * (selectedRate / 100);
                        const monthCasnos = m.revenue * CASNOS_RATE;
                        return (
                          <TableRow key={m.month} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                            <TableCell sx={{ fontWeight: 600 }}>{MONTHS_FR[m.month - 1]}</TableCell>
                            <TableCell align="right">{fmt(m.revenue)} DA</TableCell>
                            <TableCell align="right" sx={{ color: '#6366f1', fontWeight: 600 }}>{fmt(monthIFU)} DA</TableCell>
                            <TableCell align="right" sx={{ color: '#10b981', fontWeight: 600 }}>{fmt(monthCasnos)} DA</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>{fmt(monthIFU + monthCasnos)} DA</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FiscalToolsPage;
