/**
 * Page d'inscription - Design Moderne
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
  Grid,
  InputAdornment,
  IconButton,
  alpha,
  Divider,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward,
  CheckCircle,
  Rocket,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    nif: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setPasswordError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register({
        email: formData.email,
        full_name: formData.full_name,
        company_name: formData.company_name,
        nif: formData.nif || undefined,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      navigate('/login');
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
      <Container component="main" maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* En-tête */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                }}
              >
                <Rocket sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Créer un compte
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                Rejoignez Involeo et simplifiez votre gestion
              </Typography>
              
              {/* Avantages */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Gratuit"
                  size="small"
                  sx={{
                    bgcolor: alpha('#10b981', 0.1),
                    color: '#10b981',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: alpha('#10b981', 0.3),
                  }}
                />
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Rapide"
                  size="small"
                  sx={{
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: alpha('#6366f1', 0.3),
                  }}
                />
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Sécurisé"
                  size="small"
                  sx={{
                    bgcolor: alpha('#f59e0b', 0.1),
                    color: '#f59e0b',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: alpha('#f59e0b', 0.3),
                  }}
                />
              </Box>
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

            {passwordError && (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#f59e0b',
                  },
                }}
              >
                {passwordError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2.5}>
                {/* Section Compte */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#667eea',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 1,
                    }}
                  >
                    Informations de compte
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
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
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
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
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmer le mot de passe"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#64748b' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
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
                </Grid>

                {/* Section Profil */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#667eea',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 1,
                    }}
                  >
                    Informations personnelles
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="full_name"
                    label="Nom complet"
                    name="full_name"
                    autoComplete="name"
                    value={formData.full_name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
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
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="company_name"
                    label="Nom de l'entreprise"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
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
                </Grid>

                {/* Section Optionnelle */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 1,
                    }}
                  >
                    Informations complémentaires (optionnel)
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="nif"
                    label="NIF"
                    name="nif"
                    value={formData.nif}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha('#64748b', 0.03),
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#64748b', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#64748b',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#64748b',
                        fontWeight: 600,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha('#64748b', 0.03),
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#64748b', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#64748b',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#64748b',
                        fontWeight: 600,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Adresse"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha('#64748b', 0.03),
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#64748b', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#64748b',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#64748b',
                        fontWeight: 600,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  mt: 4,
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
                Créer mon compte
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  ou
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', mr: 1 }}>
                  Vous avez déjà un compte ?
                </Typography>
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#667eea',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Se connecter
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;