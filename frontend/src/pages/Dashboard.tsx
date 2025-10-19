// /**
//  * Page Dashboard - Design Moderne
//  */
// import { useEffect, useState } from 'react';
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Avatar,
//   Chip,
//   LinearProgress,
//   useTheme,
//   alpha,
// } from '@mui/material';
// import {
//   TrendingUp,
//   People,
//   Receipt,
//   AccountBalance,
//   CheckCircle,
//   HourglassEmpty,
//   Description,
//   ArrowUpward,
//   ArrowDownward,
// } from '@mui/icons-material';
// import { dashboardService } from '@/services/dashboardService';
// import type { DashboardStats } from '@/types';

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   subtitle?: string;
//   trend?: number;
// }

// const StatCard = ({ title, value, icon, color, subtitle, trend }: StatCardProps) => {
//   const theme = useTheme();
  
//   return (
//     <Card
//       sx={{
//         height: '100%',
//         background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
//         border: `1px solid ${alpha(color, 0.2)}`,
//         transition: 'all 0.3s ease-in-out',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: `0 12px 24px ${alpha(color, 0.2)}`,
//           border: `1px solid ${alpha(color, 0.4)}`,
//         },
//       }}
//     >
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: 'text.secondary',
//                 fontWeight: 500,
//                 textTransform: 'uppercase',
//                 letterSpacing: 0.5,
//                 mb: 1,
//               }}
//             >
//               {title}
//             </Typography>
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 700,
//                 color: color,
//                 mb: 0.5,
//               }}
//             >
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Avatar
//             sx={{
//               width: 64,
//               height: 64,
//               bgcolor: alpha(color, 0.15),
//               color: color,
//               boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
//             }}
//           >
//             {icon}
//           </Avatar>
//         </Box>
        
//         {trend !== undefined && (
//           <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//             {trend >= 0 ? (
//               <ArrowUpward sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
//             ) : (
//               <ArrowDownward sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
//             )}
//             <Typography
//               variant="caption"
//               sx={{
//                 color: trend >= 0 ? 'success.main' : 'error.main',
//                 fontWeight: 600,
//               }}
//             >
//               {Math.abs(trend)}% vs mois dernier
//             </Typography>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const Dashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     try {
//       const data = await dashboardService.getStats();
//       setStats(data);
//     } catch (error) {
//       console.error('Erreur chargement stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const theme = useTheme();

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '60vh',
//           gap: 2,
//         }}
//       >
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="body1" color="text.secondary">
//           Chargement des statistiques...
//         </Typography>
//       </Box>
//     );
//   }

//   // Calculer les pourcentages
//   const invoiceCompletionRate = stats?.total_invoices
//     ? Math.round((stats.paid_invoices / stats.total_invoices) * 100)
//     : 0;
  
//   const netProfit = (stats?.total_revenue || 0) - (stats?.total_expenses || 0);

//   return (
//     <Box>
//       {/* En-tête avec gradient */}
//       <Box
//         sx={{
//           mb: 4,
//           p: 3,
//           borderRadius: 3,
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//           color: 'white',
//           boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
//         }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
//           Tableau de bord
//         </Typography>
//         <Typography variant="body1" sx={{ opacity: 0.9 }}>
//           Vue d'ensemble de votre activité • {new Date().toLocaleDateString('fr-DZ', { 
//             weekday: 'long', 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric' 
//           })}
//         </Typography>
//       </Box>

//       <Grid container spacing={3}>
//         {/* Statistiques principales - 4 cards */}
//         <Grid item xs={12} sm={6} lg={3}>
//           <StatCard
//             title="Chiffre d'affaires"
//             value={`${(stats?.total_revenue || 0).toLocaleString('fr-DZ')} DA`}
//             icon={<TrendingUp sx={{ fontSize: 32 }} />}
//             color={theme.palette.primary.main}
//             subtitle="Factures payées"
//             trend={12.5}
//           />
//         </Grid>
        
//         <Grid item xs={12} sm={6} lg={3}>
//           <StatCard
//             title="Clients actifs"
//             value={stats?.total_clients || 0}
//             icon={<People sx={{ fontSize: 32 }} />}
//             color={theme.palette.success.main}
//             subtitle="Base clients"
//             trend={8.3}
//           />
//         </Grid>
        
//         <Grid item xs={12} sm={6} lg={3}>
//           <StatCard
//             title="Total factures"
//             value={stats?.total_invoices || 0}
//             icon={<Receipt sx={{ fontSize: 32 }} />}
//             color={theme.palette.warning.main}
//             subtitle="Documents émis"
//           />
//         </Grid>
        
//         <Grid item xs={12} sm={6} lg={3}>
//           <StatCard
//             title="Dépenses"
//             value={`${(stats?.total_expenses || 0).toLocaleString('fr-DZ')} DA`}
//             icon={<AccountBalance sx={{ fontSize: 32 }} />}
//             color={theme.palette.error.main}
//             subtitle="Total dépensé"
//             trend={-3.2}
//           />
//         </Grid>

//         {/* Bénéfice net - Card spéciale */}
//         <Grid item xs={12} md={4}>
//           <Card
//             sx={{
//               height: '100%',
//               background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)} 0%, ${alpha(theme.palette.success.dark, 0.9)} 100%)`,
//               color: 'white',
//               transition: 'all 0.3s ease-in-out',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 boxShadow: `0 12px 24px ${alpha(theme.palette.success.main, 0.4)}`,
//               },
//             }}
//           >
//             <CardContent sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Avatar
//                   sx={{
//                     bgcolor: alpha('#fff', 0.2),
//                     width: 48,
//                     height: 48,
//                     mr: 2,
//                   }}
//                 >
//                   <TrendingUp />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
//                     BÉNÉFICE NET
//                   </Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700 }}>
//                     {netProfit.toLocaleString('fr-DZ')} DA
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box sx={{ mt: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="caption">Revenus vs Dépenses</Typography>
//                   <Typography variant="caption" sx={{ fontWeight: 600 }}>
//                     {stats?.total_revenue && stats?.total_expenses
//                       ? Math.round(((stats.total_revenue - stats.total_expenses) / stats.total_revenue) * 100)
//                       : 0}%
//                   </Typography>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={
//                     stats?.total_revenue
//                       ? Math.min(((stats.total_revenue - stats.total_expenses) / stats.total_revenue) * 100, 100)
//                       : 0
//                   }
//                   sx={{
//                     height: 8,
//                     borderRadius: 4,
//                     bgcolor: alpha('#fff', 0.2),
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: '#fff',
//                       borderRadius: 4,
//                     },
//                   }}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Statut des factures */}
//         <Grid item xs={12} md={4}>
//           <Card
//             sx={{
//               height: '100%',
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//               transition: 'all 0.3s ease-in-out',
//               '&:hover': {
//                 boxShadow: 4,
//               },
//             }}
//           >
//             <CardContent sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <CheckCircle sx={{ fontSize: 32, color: theme.palette.success.main, mr: 1.5 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Factures payées
//                 </Typography>
//               </Box>
              
//               <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
//                 <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
//                   {stats?.paid_invoices || 0}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//                   / {stats?.total_invoices || 0} factures
//                 </Typography>
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Taux de règlement
//                   </Typography>
//                   <Typography variant="caption" sx={{ fontWeight: 600 }}>
//                     {invoiceCompletionRate}%
//                   </Typography>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={invoiceCompletionRate}
//                   sx={{
//                     height: 8,
//                     borderRadius: 4,
//                     bgcolor: alpha(theme.palette.success.main, 0.1),
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: theme.palette.success.main,
//                       borderRadius: 4,
//                     },
//                   }}
//                 />
//               </Box>

//               <Chip
//                 label={`${invoiceCompletionRate >= 80 ? 'Excellent' : invoiceCompletionRate >= 50 ? 'Bon' : 'À améliorer'}`}
//                 color={invoiceCompletionRate >= 80 ? 'success' : invoiceCompletionRate >= 50 ? 'warning' : 'error'}
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//               />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Factures en attente */}
//         <Grid item xs={12} md={4}>
//           <Card
//             sx={{
//               height: '100%',
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//               transition: 'all 0.3s ease-in-out',
//               '&:hover': {
//                 boxShadow: 4,
//               },
//             }}
//           >
//             <CardContent sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <HourglassEmpty sx={{ fontSize: 32, color: theme.palette.warning.main, mr: 1.5 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   En attente
//                 </Typography>
//               </Box>
              
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.warning.main, mb: 1 }}>
//                   {stats?.pending_invoices || 0}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Factures à encaisser
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   p: 1.5,
//                   borderRadius: 2,
//                   bgcolor: alpha(theme.palette.warning.main, 0.1),
//                 }}
//               >
//                 <Description sx={{ fontSize: 24, color: theme.palette.info.main, mr: 1.5 }} />
//                 <Box>
//                   <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                     {stats?.total_quotes || 0} Devis
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     En attente de validation
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Section activité récente - Design moderne */}
//         <Grid item xs={12}>
//           <Card
//             sx={{
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//               transition: 'all 0.3s ease-in-out',
//               '&:hover': {
//                 boxShadow: 4,
//               },
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <Avatar
//                   sx={{
//                     bgcolor: alpha(theme.palette.primary.main, 0.1),
//                     color: theme.palette.primary.main,
//                     mr: 2,
//                   }}
//                 >
//                   <Receipt />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     Activité récente
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Suivez vos dernières transactions
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box
//                 sx={{
//                   p: 4,
//                   borderRadius: 2,
//                   bgcolor: alpha(theme.palette.primary.main, 0.03),
//                   border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
//                   textAlign: 'center',
//                 }}
//               >
//                 <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
//                   📊 Fonctionnalité à venir
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Vous pourrez bientôt consulter l'historique détaillé de vos factures, devis et dépenses
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

/**
 * Page Dashboard - Design Moderne et Responsive
 */
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Container,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Receipt,
  AccountBalance,
  CheckCircle,
  HourglassEmpty,
  Description,
  ArrowUpward,
  ArrowDownward,
  Timeline,
} from '@mui/icons-material';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats } from '@/types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: number;
}

const StatCard = ({ title, value, icon, color, subtitle, trend }: StatCardProps) => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: '#FFFFFF',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          borderColor: color,
          '&::before': {
            transform: 'translateX(100%)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                mb: 1.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: color,
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha(color, 0.05)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              flexShrink: 0,
              ml: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {trend !== undefined && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor: trend >= 0 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
              }}
            >
              {trend >= 0 ? (
                <ArrowUpward sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: '#ef4444', mr: 0.5 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              vs mois dernier
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

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
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{
              color: '#6366f1',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Timeline sx={{ color: '#6366f1', fontSize: 28 }} />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Chargement des statistiques...
        </Typography>
      </Box>
    );
  }

  const invoiceCompletionRate = stats?.total_invoices
    ? Math.round((stats.paid_invoices / stats.total_invoices) * 100)
    : 0;
  
  const netProfit = (stats?.total_revenue || 0) - (stats?.total_expenses || 0);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="xl">
        {/* En-tête moderne avec dégradé */}
        <Box
          sx={{
            mb: 4,
            pt: { xs: 3, sm: 4 },
            pb: { xs: 4, sm: 5 },
            px: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Tableau de bord
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.95,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              Vue d'ensemble de votre activité • {new Date().toLocaleDateString('fr-DZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Statistiques principales */}
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Chiffre d'affaires"
              value={`${(stats?.total_revenue || 0).toLocaleString('fr-DZ')} DA`}
              icon={<TrendingUp sx={{ fontSize: { xs: 28, sm: 32 } }} />}
              color="#6366f1"
              subtitle="Factures payées"
              trend={12.5}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Clients actifs"
              value={stats?.total_clients || 0}
              icon={<People sx={{ fontSize: { xs: 28, sm: 32 } }} />}
              color="#10b981"
              subtitle="Base clients"
              trend={8.3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total factures"
              value={stats?.total_invoices || 0}
              icon={<Receipt sx={{ fontSize: { xs: 28, sm: 32 } }} />}
              color="#f59e0b"
              subtitle="Documents émis"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Dépenses"
              value={`${(stats?.total_expenses || 0).toLocaleString('fr-DZ')} DA`}
              icon={<AccountBalance sx={{ fontSize: { xs: 28, sm: 32 } }} />}
              color="#ef4444"
              subtitle="Total dépensé"
              trend={-3.2}
            />
          </Grid>

          {/* Bénéfice net */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      width: { xs: 44, sm: 52 },
                      height: { xs: 44, sm: 52 },
                      mr: 2,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.95, mb: 0.5, fontWeight: 600, letterSpacing: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      BÉNÉFICE NET
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                      {netProfit.toLocaleString('fr-DZ')} DA
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Revenus vs Dépenses</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {stats?.total_revenue && stats?.total_expenses
                        ? Math.round(((stats.total_revenue - stats.total_expenses) / stats.total_revenue) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      stats?.total_revenue
                        ? Math.min(((stats.total_revenue - stats.total_expenses) / stats.total_revenue) * 100, 100)
                        : 0
                    }
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#fff',
                        borderRadius: 5,
                        boxShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Factures payées */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                background: '#FFFFFF',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: { xs: 26, sm: 28 }, color: '#10b981' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Factures payées
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2.5 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981', fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                    {stats?.paid_invoices || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                    / {stats?.total_invoices || 0} factures
                  </Typography>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Taux de règlement
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {invoiceCompletionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={invoiceCompletionRate}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha('#10b981', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#10b981',
                        borderRadius: 5,
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                      },
                    }}
                  />
                </Box>

                <Chip
                  label={`${invoiceCompletionRate >= 80 ? 'Excellent' : invoiceCompletionRate >= 50 ? 'Bon' : 'À améliorer'}`}
                  sx={{
                    fontWeight: 700,
                    bgcolor: invoiceCompletionRate >= 80 ? alpha('#10b981', 0.15) : invoiceCompletionRate >= 50 ? alpha('#f59e0b', 0.15) : alpha('#ef4444', 0.15),
                    color: invoiceCompletionRate >= 80 ? '#10b981' : invoiceCompletionRate >= 50 ? '#f59e0b' : '#ef4444',
                    border: '1px solid',
                    borderColor: invoiceCompletionRate >= 80 ? alpha('#10b981', 0.3) : invoiceCompletionRate >= 50 ? alpha('#f59e0b', 0.3) : alpha('#ef4444', 0.3),
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Factures en attente */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                background: '#FFFFFF',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                    }}
                  >
                    <HourglassEmpty sx={{ fontSize: { xs: 26, sm: 28 }, color: '#f59e0b' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    En attente
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#f59e0b', mb: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                    {stats?.pending_invoices || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Factures à encaisser
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
                    border: '1px solid',
                    borderColor: alpha('#6366f1', 0.2),
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 40, sm: 44 },
                      height: { xs: 40, sm: 44 },
                      borderRadius: 2,
                      bgcolor: alpha('#6366f1', 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    <Description sx={{ fontSize: { xs: 20, sm: 22 }, color: '#6366f1' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#6366f1', fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
                      {stats?.total_quotes || 0} Devis
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      En attente de validation
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Activité récente */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                background: '#FFFFFF',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Timeline sx={{ fontSize: { xs: 26, sm: 30 }, color: '#6366f1' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
                      Activité récente
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                      Suivez vos dernières transactions
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(102, 126, 234, 0.03))',
                    border: '2px dashed',
                    borderColor: alpha('#6366f1', 0.2),
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 56, sm: 64 },
                      height: { xs: 56, sm: 64 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>📊</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#6366f1', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                    Fonctionnalité à venir
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Vous pourrez bientôt consulter l'historique détaillé de vos factures, devis et dépenses
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;