/**
 * Page de demande de réinitialisation de mot de passe
 */
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { authService } from '@/services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
        }}
      >
        {!success ? (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <EmailIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Mot de passe oublié ?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6941a0 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Envoyer le lien'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    textDecoration: 'none',
                    color: '#667eea',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Retour à la connexion
                </Link>
              </Box>
            </form>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#d4edda',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <EmailIcon sx={{ fontSize: 40, color: '#28a745' }} />
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Email envoyé !
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>N'oubliez pas de vérifier votre dossier spam</strong> si vous ne recevez pas l'email dans les prochaines minutes.
              </Typography>
            </Alert>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5568d3',
                  background: 'rgba(102, 126, 234, 0.04)',
                },
              }}
            >
              Retour à la connexion
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
