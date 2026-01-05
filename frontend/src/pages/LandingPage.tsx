// /**
//  * Landing Page - Involeo
//  */
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   alpha,
//   AppBar,
//   Toolbar,
//   Chip,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import {
//   Receipt as ReceiptIcon,
//   People as PeopleIcon,
//   TrendingUp as TrendingUpIcon,
//   Speed as SpeedIcon,
//   Security as SecurityIcon,
//   Cloud as CloudIcon,
//   CheckCircle as CheckIcon,
//   ArrowForward as ArrowIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
// } from '@mui/icons-material';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const [demoEmail, setDemoEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleGetStarted = () => {
//     navigate('/register');
//   };

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleDemoRequest = async () => {
//     if (!demoEmail) {
//       setErrorMessage('Veuillez entrer votre email');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       await axios.post('http://localhost:8000/api/contact/demo', {
//         email: demoEmail,
//       });

//       setSuccessMessage('Merci! Nous vous contacterons très bientôt pour finaliser votre inscription.');
//       setDemoEmail('');
      
//       // Clear success message after 5 seconds
//       setTimeout(() => setSuccessMessage(''), 5000);
//     } catch (error) {
//       console.error('Error submitting demo request:', error);
//       setErrorMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const features = [
//     {
//       icon: <ReceiptIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Facturation Professionnelle',
//       description: 'Créez des factures et devis en quelques clics. Format conforme aux normes algériennes.',
//     },
//     {
//       icon: <PeopleIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Gestion Clients',
//       description: 'Centralisez vos clients, suivez leur historique et gérez vos relations commerciales.',
//     },
//     {
//       icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Tableau de Bord',
//       description: 'Visualisez vos performances en temps réel avec des statistiques détaillées.',
//     },
//     {
//       icon: <SpeedIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Gain de Temps',
//       description: 'Automatisez vos tâches répétitives et concentrez-vous sur votre activité.',
//     },
//     {
//       icon: <SecurityIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Sécurisé',
//       description: 'Vos données sont protégées avec un chiffrement de niveau bancaire.',
//     },
//     {
//       icon: <CloudIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
//       title: 'Accessible Partout',
//       description: 'Accédez à vos données depuis n\'importe quel appareil, à tout moment.',
//     },
//   ];

//   const plans = [
//     {
//       name: 'Involeo',
//       price: '5,000',
//       period: '/mois',
//       features: [
//         'Clients illimités',
//         'Factures illimitées',
//         'Devis professionnels',
//         'Export PDF professionnel',
//         'Multi-devises (DZD, EUR, USD)',
//         'Gestion des dépenses',
//         'Gestion des produits',
//         'Tableau de bord avancé',
//         'Statistiques détaillées',
//         'Support prioritaire',
//         'Mises à jour régulières',
//         'Données sécurisées',
//       ],
//       cta: 'Contactez-nous',
//       primary: true,
//     },
//   ];

//   return (
//     <Box sx={{ bgcolor: '#f9f8fcff', minHeight: '100vh' }}>
//       {/* Header */}
//       <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(192, 144, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//             <img src="/logo.svg" alt="Involeo" style={{ height: '40px' }} />
//           </Box>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button onClick={handleLogin} sx={{ color: '#1e293b', fontWeight: 600 }}>
//               Connexion
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleGetStarted}
//               sx={{
//                 bgcolor: '#6366f1',
//                 '&:hover': { bgcolor: '#4f46e5' },
//                 fontWeight: 700,
//                 px: 3,
//                 borderRadius: 2,
//               }}
//             >
//               Commencer
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Hero Section */}
//       <Box
//         sx={{
//           pt: 20,
//           pb: 12,
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: 'white',
//           position: 'relative',
//           overflow: 'hidden',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: -200,
//             right: -200,
//             width: 600,
//             height: 600,
//             borderRadius: '50%',
//             background: 'rgba(255, 255, 255, 0.1)',
//           },
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={6} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
//                 Gérez votre entreprise avec{' '}
//                 <Box component="span" sx={{ color: '#fbbf24' }}>
//                   simplicité
//                 </Box>
//               </Typography>
//               <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontWeight: 400, lineHeight: 1.8 }}>
//                 La solution de facturation et comptabilité conçue pour les micro-entrepreneurs et petites entreprises algériennes.
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 <Button
//                   variant="contained"
//                   size="large"
//                   onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
//                   endIcon={<ArrowIcon />}
//                   sx={{
//                     bgcolor: 'white',
//                     color: '#6366f1',
//                     fontWeight: 700,
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: 3,
//                     fontSize: '1.1rem',
//                     '&:hover': {
//                       bgcolor: '#f1f5f9',
//                       transform: 'translateY(-2px)',
//                       boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
//                     },
//                     transition: 'all 0.3s',
//                   }}
//                 >
//                   Commencer
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="large"
//                   sx={{
//                     borderColor: 'white',
//                     color: 'white',
//                     fontWeight: 600,
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: 3,
//                     fontSize: '1.1rem',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.1)',
//                     },
//                   }}
//                   onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
//                 >
//                   Voir la Démo
//                 </Button>
//               </Box>
//               <Box sx={{ display: 'flex', gap: 3, mt: 4, alignItems: 'center', flexWrap: 'wrap' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CheckIcon sx={{ color: '#10b981' }} />
//                   <Typography variant="body2">Paiement simple et sécurisé</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CheckIcon sx={{ color: '#10b981' }} />
//                   <Typography variant="body2">Support en français</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CheckIcon sx={{ color: '#10b981' }} />
//                   <Typography variant="body2">Activation rapide</Typography>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Box
//                 component="img"
//                 src="/hero-dashboard.png"
//                 alt="Involeo Dashboard"
//                 sx={{
//                   width: '100%',
//                   borderRadius: 4,
//                   boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
//                   border: '4px solid rgba(255,255,255,0.2)',
//                 }}
//                 onError={(e) => {
//                   e.currentTarget.style.display = 'none';
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Features Section */}
//       <Container maxWidth="lg" sx={{ py: 10 }}>
//         <Box sx={{ textAlign: 'center', mb: 8 }}>
//           <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
//             Tout ce dont vous avez besoin
//           </Typography>
//           <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
//             Une solution complète pour gérer votre activité professionnelle
//           </Typography>
//         </Box>

//         <Grid container spacing={4}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   borderRadius: 3,
//                   border: '1px solid',
//                   borderColor: 'rgba(0,0,0,0.06)',
//                   transition: 'all 0.3s',
//                   '&:hover': {
//                     transform: 'translateY(-8px)',
//                     boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
//                     borderColor: '#6366f1',
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 4 }}>
//                   <Box sx={{ mb: 2 }}>{feature.icon}</Box>
//                   <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#1e293b' }}>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
//                     {feature.description}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Pricing Section */}
//       <Box sx={{ bgcolor: alpha('#6366f1', 0.03), py: 10 }}>
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: 'center', mb: 8 }}>
//             <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
//               5,000 DA par mois
//             </Typography>
//             <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
//               Accès complet à toutes les fonctionnalités • Paiement sécurisé
//             </Typography>
//           </Box>

//           <Grid container spacing={4} justifyContent="center">
//             {plans.map((plan, index) => (
//               <Grid item xs={12} md={6} lg={5} key={index}>
//                 <Card
//                   sx={{
//                     height: '100%',
//                     borderRadius: 3,
//                     border: plan.primary ? '2px solid #6366f1' : '1px solid rgba(0,0,0,0.06)',
//                     transform: plan.primary ? 'scale(1.05)' : 'scale(1)',
//                     boxShadow: plan.primary ? '0 20px 60px rgba(99, 102, 241, 0.2)' : 'none',
//                     position: 'relative',
//                   }}
//                 >
//                   {plan.badge && (
//                     <Chip
//                       label={plan.badge}
//                       sx={{
//                         position: 'absolute',
//                         top: 16,
//                         right: 16,
//                         bgcolor: '#fbbf24',
//                         color: 'white',
//                         fontWeight: 700,
//                       }}
//                     />
//                   )}
//                   <CardContent sx={{ p: 4 }}>
//                     <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
//                       {plan.name}
//                     </Typography>
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="h3" sx={{ fontWeight: 800, color: '#6366f1', display: 'inline' }}>
//                         {plan.price}
//                       </Typography>
//                       <Typography variant="h6" sx={{ color: '#64748b', display: 'inline', ml: 1 }}>
//                         DA{plan.period}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ mb: 3 }}>
//                       {plan.features.map((feature, i) => (
//                         <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
//                           <CheckIcon sx={{ color: '#10b981', fontSize: 20 }} />
//                           <Typography variant="body2" sx={{ color: '#475569' }}>
//                             {feature}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </Box>
//                     <Button
//                       variant={plan.primary ? 'contained' : 'outlined'}
//                       fullWidth
//                       size="large"
//                       onClick={handleGetStarted}
//                       sx={{
//                         py: 1.5,
//                         borderRadius: 2,
//                         fontWeight: 700,
//                         bgcolor: plan.primary ? '#6366f1' : 'transparent',
//                         borderColor: '#6366f1',
//                         color: plan.primary ? 'white' : '#6366f1',
//                         '&:hover': {
//                           bgcolor: plan.primary ? '#4f46e5' : alpha('#6366f1', 0.1),
//                           borderColor: '#4f46e5',
//                         },
//                       }}
//                     >
//                       {plan.cta}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Demo Request Section */}
//       <Container maxWidth="md" sx={{ py: 10 }} id="demo">
//         <Card
//           sx={{
//             borderRadius: 4,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             p: 6,
//           }}
//         >
//           <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
//             Contactez-nous pour Commencer
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', opacity: 0.95 }}>
//             Laissez-nous votre email et nous vous contacterons pour finaliser votre inscription (CCP, virement bancaire, ou paiement en espèces)
//           </Typography>
          
//           {successMessage && (
//             <Alert severity="success" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
//               {successMessage}
//             </Alert>
//           )}
          
//           {errorMessage && (
//             <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
//               {errorMessage}
//             </Alert>
//           )}
          
//           <Box sx={{ display: 'flex', gap: 2, maxWidth: 500, mx: 'auto' }}>
//             <TextField
//               fullWidth
//               placeholder="votre@email.com"
//               type="email"
//               value={demoEmail}
//               onChange={(e) => setDemoEmail(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && !loading && handleDemoRequest()}
//               disabled={loading}
//               error={!!errorMessage}
//               sx={{
//                 bgcolor: 'white',
//                 borderRadius: 2,
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': { borderColor: 'transparent' },
//                 },
//               }}
//             />
//             <Button
//               variant="contained"
//               size="large"
//               onClick={handleDemoRequest}
//               disabled={loading || !demoEmail.trim()}
//               sx={{
//                 bgcolor: '#fbbf24',
//                 color: '#1e293b',
//                 fontWeight: 700,
//                 px: 4,
//                 borderRadius: 2,
//                 minWidth: 140,
//                 '&:hover': { bgcolor: '#f59e0b' },
//               }}
//             >
//               {loading ? <CircularProgress size={24} sx={{ color: '#1e293b' }} /> : 'Envoyer'}
//             </Button>
//           </Box>
//         </Card>
//       </Container>

//       {/* Footer */}
//       <Box sx={{ bgcolor: '#1e293b', color: 'white', py: 8 }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={4}>
//               <img src="/logo.svg" alt="Involeo" style={{ height: '40px', marginBottom: '16px' }} />
//               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
//                 La solution de gestion pour les entrepreneurs algériens
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
//                 Liens Rapides
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                 <Button onClick={() => navigate('/login')} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start' }}>
//                   Connexion
//                 </Button>
//                 <Button onClick={() => navigate('/register')} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start' }}>
//                   Inscription
//                 </Button>
//                 <Button onClick={() => navigate('/terms')} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start' }}>
//                   Conditions d'utilisation
//                 </Button>
//                 <Button onClick={() => navigate('/privacy')} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start' }}>
//                   Politique de confidentialité
//                 </Button>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
//                 Contact
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 <EmailIcon sx={{ fontSize: 20 }} />
//                 <Typography variant="body2">contact@involeo.dz</Typography>
//               </Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <PhoneIcon sx={{ fontSize: 20 }} />
//                 <Typography variant="body2">+213 550 45 04 02</Typography>
//               </Box>
//             </Grid>
//           </Grid>
//           <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
//             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
//               © 2026 Involeo. Tous droits réservés.
//             </Typography>
//           </Box>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default LandingPage


/**
 * Landing Page - Involeo
 * Modern & Responsive Design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  alpha,
  AppBar,
  Toolbar,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { config } from '@/config/config';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [demoEmail, setDemoEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDemoRequest = async () => {
    if (!demoEmail) {
      setErrorMessage('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post(`${config.apiUrl}/api/contact/demo`, {
        email: demoEmail,
        name: ''
      });
      
      setSuccessMessage('Merci! Nous vous contacterons très bientôt pour finaliser votre inscription.');
      setDemoEmail('');
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ReceiptIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Facturation Professionnelle',
      description: 'Créez des factures et devis en quelques clics. Format conforme aux normes algériennes.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Gestion Clients',
      description: 'Centralisez vos clients, suivez leur historique et gérez vos relations commerciales.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Tableau de Bord',
      description: 'Visualisez vos performances en temps réel avec des statistiques détaillées.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Gain de Temps',
      description: 'Automatisez vos tâches répétitives et concentrez-vous sur votre activité.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Sécurisé',
      description: 'Vos données sont protégées avec un chiffrement de niveau bancaire.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: { xs: 36, md: 40 }, color: '#6366f1' }} />,
      title: 'Accessible Partout',
      description: 'Accédez à vos données depuis n\'importe quel appareil, à tout moment.',
    },
  ];

  const plans = [
    {
      name: 'Involeo',
      price: '5,000',
      period: '/mois',
      features: [
        'Clients illimités',
        'Factures illimitées',
        'Devis professionnels',
        'Export PDF professionnel',
        'Multi-devises (DZD, EUR, USD)',
        'Gestion des dépenses',
        'Gestion des produits',
        'Tableau de bord avancé',
        'Statistiques détaillées',
        'Support prioritaire',
        'Mises à jour régulières',
        'Données sécurisées',
      ],
      cta: 'Contactez-nous',
      primary: true,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 1, md: 0.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="/logo2.png"
              alt="Involeo"
              sx={{
                height: 40,
                width: 'auto',
              }}
              onError={(e) => {
                // Fallback to gradient box with I if logo fails to load
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.style.cssText = 'width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1.2rem';
                fallback.textContent = 'I';
                e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
              }}
            />
            {/* <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: '#1e293b',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Involeo
            </Typography> */}
          </Box>
          
          {isMobile ? (
            <IconButton 
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: '#1e293b' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                onClick={handleLogin} 
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 600,
                  '&:hover': { color: '#1e293b' }
                }}
              >
                Connexion
              </Button>
              <Button
                variant="contained"
                onClick={handleGetStarted}
                sx={{
                  bgcolor: '#6366f1',
                  '&:hover': { 
                    bgcolor: '#4f46e5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                  },
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 2,
                  transition: 'all 0.3s',
                }}
              >
                Commencer
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 300,
            bgcolor: '#fafafa',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Menu
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>
                <ListItemText primary="Connexion" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                sx={{ 
                  bgcolor: '#6366f1', 
                  color: 'white',
                  borderRadius: 2,
                  mt: 1,
                  '&:hover': { bgcolor: '#4f46e5' }
                }}
              >
                <ListItemText primary="Commencer" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 16, md: 20 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: { xs: -100, md: -200 },
            right: { xs: -100, md: -200 },
            width: { xs: 300, md: 600 },
            height: { xs: 300, md: 600 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: { xs: -50, md: -100 },
            left: { xs: -50, md: -100 },
            width: { xs: 200, md: 400 },
            height: { xs: 200, md: 400 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: { xs: 2, md: 3 }, 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Gérez votre entreprise avec{' '}
                <Box component="span" sx={{ color: '#fbbf24' }}>
                  simplicité
                </Box>
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  opacity: 0.95, 
                  fontWeight: 400, 
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                La solution de facturation et comptabilité conçue pour les micro-entrepreneurs et petites entreprises algériennes.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  endIcon={<ArrowIcon />}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: 'white',
                    color: '#6366f1',
                    fontWeight: 700,
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.5, md: 1.5 },
                    borderRadius: 3,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    '&:hover': {
                      bgcolor: '#f1f5f9',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Commencer
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth={isMobile}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.5, md: 1.5 },
                    borderRadius: 3,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      bgcolor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Voir la Démo
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, mt: { xs: 3, md: 4 }, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#10b981', fontSize: { xs: 20, md: 24 } }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Paiement simple et sécurisé
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#10b981', fontSize: { xs: 20, md: 24 } }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Support en français
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#10b981', fontSize: { xs: 20, md: 24 } }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Activation rapide
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  p: 3,
                }}
              >
                {/* Dashboard Header */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
                    📊 Tableau de Bord
                  </Typography>
                  <Chip label="En direct" size="small" sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 600 }} />
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha('#6366f1', 0.1),
                      border: '1px solid',
                      borderColor: alpha('#6366f1', 0.2)
                    }}>
                      <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Chiffre d'Affaires
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 800 }}>
                        125,000 DA
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                        ↑ +12.5%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha('#10b981', 0.1),
                      border: '1px solid',
                      borderColor: alpha('#10b981', 0.2)
                    }}>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Factures Payées
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 800 }}>
                        24
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        Ce mois
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Chart Placeholder */}
                <Box sx={{ 
                  height: 180, 
                  borderRadius: 2, 
                  bgcolor: alpha('#6366f1', 0.05),
                  border: '1px solid',
                  borderColor: alpha('#6366f1', 0.1),
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                    Évolution du CA
                  </Typography>
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-around',
                    gap: 1
                  }}>
                    {[40, 65, 50, 80, 60, 95, 75].map((height, i) => (
                      <Box 
                        key={i}
                        sx={{ 
                          flex: 1,
                          height: `${height}%`,
                          bgcolor: i === 6 ? '#6366f1' : alpha('#6366f1', 0.3),
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              color: '#1e293b',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Tout ce dont vous avez besoin
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#64748b', 
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 2, md: 0 }
            }}
          >
            Une solution complète pour gérer votre activité professionnelle
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
                    borderColor: '#6366f1',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5, 
                      color: '#1e293b',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b', 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.875rem', md: '0.95rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: alpha('#6366f1', 0.03), py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 2, 
                color: '#1e293b',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              5,000 DA par mois
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 400,
                fontSize: { xs: '0.95rem', md: '1.25rem' },
                px: { xs: 2, md: 0 }
              }}
            >
              Accès complet à toutes les fonctionnalités • Paiement sécurisé
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={8} lg={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: '2px solid #6366f1',
                    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)',
                    position: 'relative',
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4, lg: 5 } }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1, 
                        color: '#1e293b',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800, 
                          color: '#6366f1', 
                          display: 'inline',
                          fontSize: { xs: '2rem', md: '3rem' }
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#64748b', 
                          display: 'inline', 
                          ml: 1,
                          fontSize: { xs: '1rem', md: '1.25rem' }
                        }}
                      >
                        DA{plan.period}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={1}>
                        {plan.features.map((feature, i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <CheckIcon sx={{ color: '#10b981', fontSize: 20, flexShrink: 0 }} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#475569',
                                  fontSize: { xs: '0.875rem', md: '0.95rem' }
                                }}
                              >
                                {feature}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleGetStarted}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                        fontWeight: 700,
                        bgcolor: '#6366f1',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        '&:hover': {
                          bgcolor: '#4f46e5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Demo Request Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }} id="demo">
        <Card
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: { xs: 3, sm: 4, md: 6 },
            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Contactez-nous pour Commencer
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              textAlign: 'center', 
              opacity: 0.95,
              fontSize: { xs: '0.95rem', md: '1rem' },
              px: { xs: 0, md: 4 }
            }}
          >
            Laissez-nous votre email et nous vous contacterons pour finaliser votre inscription (CCP, virement bancaire, ou paiement en espèces)
          </Typography>
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {successMessage}
            </Alert>
          )}
          
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {errorMessage}
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            maxWidth: 500, 
            mx: 'auto' 
          }}>
            <TextField
              fullWidth
              placeholder="votre@email.com"
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleDemoRequest()}
              disabled={loading}
              error={!!errorMessage}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'transparent' },
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth={isMobile}
              onClick={handleDemoRequest}
              disabled={loading || !demoEmail.trim()}
              sx={{
                bgcolor: '#fbbf24',
                color: '#1e293b',
                fontWeight: 700,
                px: 4,
                borderRadius: 2,
                minWidth: { xs: '100%', sm: 140 },
                '&:hover': { 
                  bgcolor: '#f59e0b',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#1e293b' }} /> : 'Envoyer'}
            </Button>
          </Box>
        </Card>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Involeo"
                  sx={{
                    height: 40,
                    width: 'auto',
                  }}
                  onError={(e) => {
                    // Fallback to gradient box with I if logo fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.style.cssText = 'width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1.2rem';
                    fallback.textContent = 'I';
                    e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                  }}
                />

              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  mb: 2,
                  fontSize: { xs: '0.875rem', md: '0.95rem' }
                }}
              >
                La solution de gestion pour les entrepreneurs algériens
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Liens Rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Button 
                  onClick={handleLogin} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Connexion
                </Button>
                <Button 
                  onClick={handleGetStarted} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Inscription
                </Button>
                <Button 
                  onClick={() => navigate('/help')}
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Conditions d'utilisation
                </Button>
                <Button 
                  onClick={() => navigate('/help')}
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Politique de confidentialité
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Contact
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.875rem', md: '0.95rem' } }}
                >
                  contact@involeo.dz
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.875rem', md: '0.95rem' } }}
                >
                  +213 550 45 04 02
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ 
            mt: { xs: 4, md: 6 }, 
            pt: { xs: 3, md: 4 }, 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            textAlign: 'center' 
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              }}
            >
              © 2026 Involeo. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;