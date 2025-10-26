/**
 * Page Dashboard Analytics avec graphiques
 */
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService, RevenueTrendData, TopClient, TopProduct, KPIs } from '@/services/dashboardService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardAnalytics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [kpis, setKPIs] = useState<KPIs | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [trendData, clientsData, productsData, kpisData] = await Promise.all([
        dashboardService.getRevenueTrend(6), // 6 derniers mois
        dashboardService.getTopClients(5),
        dashboardService.getTopProducts(5),
        dashboardService.getKPIs(),
      ]);
      
      setRevenueTrend(trendData);
      setTopClients(clientsData);
      setTopProducts(productsData);
      setKPIs(kpisData);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          📊 Analytics & Statistiques
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue d'ensemble de vos performances commerciales
        </Typography>
      </Box>

      {/* KPIs Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* CA Mois Actuel */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {kpis?.current_month_revenue.toLocaleString('fr-DZ')} DA
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                CA Mois Actuel
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Croissance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: kpis && kpis.growth_percentage >= 0 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {kpis && kpis.growth_percentage >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                )}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {kpis?.growth_percentage >= 0 ? '+' : ''}{kpis?.growth_percentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Croissance vs Mois Dernier
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket Moyen */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {kpis?.average_invoice.toLocaleString('fr-DZ')} DA
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Ticket Moyen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Taux de Conversion */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChartIcon sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {kpis?.conversion_rate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Taux Conversion Devis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        {/* Évolution du CA */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              📈 Évolution du Chiffre d'Affaires (6 derniers mois)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 8 
                  }}
                  formatter={(value: number) => `${value.toLocaleString('fr-DZ')} DA`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  name="Chiffre d'affaires"
                  dot={{ fill: '#6366f1', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Dépenses"
                  dot={{ fill: '#ef4444', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Profit"
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top 5 Clients */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              👥 Top 5 Clients
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topClients}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topClients.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString('fr-DZ')} DA`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Produits/Services les Plus Vendus */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              🏆 Produits & Services les Plus Vendus
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 8 
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [`${value.toLocaleString('fr-DZ')} DA`, 'CA Généré'];
                    if (name === 'quantity') return [value, 'Quantité'];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#6366f1" name="CA Généré" radius={[8, 8, 0, 0]} />
                <Bar dataKey="quantity" fill="#10b981" name="Quantité Vendue" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAnalytics;
