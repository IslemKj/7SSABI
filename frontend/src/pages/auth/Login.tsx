/**
 * Page de connexion - Design Moderne
 */
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  alpha,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  TrendingUp,
  Assessment,
  AccountBalance,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        username: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      // Erreur gérée par le store
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              gap: 4,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Section gauche - Informations */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                px: { xs: 2, md: 4 },
              }}
            >
              {/* Logo et titre */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src="/profile.png"
                      alt="Involeo"
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    Involeo
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    opacity: 0.95,
                    fontWeight: 600,
                    mb: 2,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  Gestion & Comptabilité Simplifiée
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                  }}
                >
                  Gérez votre entreprise en toute simplicité avec notre plateforme complète de
                  facturation, gestion clients et suivi des dépenses.
                </Typography>
              </Box>

              {/* Fonctionnalités */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Tableau de bord intelligent
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Visualisez vos performances en temps réel
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Assessment />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Facturation rapide
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Créez et envoyez vos factures en quelques clics
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalance />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Suivi des dépenses
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Contrôlez vos coûts et optimisez vos finances
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Section droite - Formulaire */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  width: '100%',
                  maxWidth: 480,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Bon retour !
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Connectez-vous pour accéder à votre espace
                  </Typography>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#ef4444',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: alpha('#667eea', 0.03),
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#667eea', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea',
                        fontWeight: 600,
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#64748b' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: alpha('#667eea', 0.03),
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#667eea', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea',
                        fontWeight: 600,
                      },
                    }}
                  />

                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link
                      href="#"
                      variant="body2"
                      sx={{
                        color: '#667eea',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Mot de passe oublié ?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.75,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Se connecter
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{
                        color: '#667eea',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontSize: '0.9375rem',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Mot de passe oublié ?
                    </Link>
                  </Box>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      ou
                    </Typography>
                  </Divider>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', mr: 1 }}>
                      Pas encore de compte ?
                    </Typography>
                    <Link
                      component={RouterLink}
                      to="/register"
                      sx={{
                        color: '#667eea',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      S'inscrire gratuitement
                    </Link>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;