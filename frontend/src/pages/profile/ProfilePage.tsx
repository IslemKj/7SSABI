// import React, { useEffect, useState } from 'react';
// import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
// import { userService } from '@/services/userService';
// import type { User } from '@/types';

// const ProfilePage: React.FC = () => {

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     userService.getMe().then(setUser);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!user) return;
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;
//     setLoading(true);
//     setSuccess(false);
//     try {
//       await userService.updateMe(user);
//       setSuccess(true);
//     } catch (err) {
//       // Optionally handle error
//     }
//     setLoading(false);
//   };

//   return (
//     <Box maxWidth={600} mx="auto" mt={5}>
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h5" fontWeight={700} mb={2}>
//           Mon Profil
//         </Typography>
//         {user ? (
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Nom"
//                   name="name"
//                   value={user.name}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Email"
//                   name="email"
//                   value={user.email}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   disabled
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Nom de l'entreprise"
//                   name="entreprise_name"
//                   value={user.entreprise_name || ''}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="NIF"
//                   name="nif"
//                   value={user.nif || ''}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Téléphone"
//                   name="phone"
//                   value={user.phone || ''}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Adresse"
//                   name="address"
//                   value={user.address || ''}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               sx={{ mt: 2 }}
//             >
//               {loading ? 'Mise à jour...' : 'Mettre à jour'}
//             </Button>
//             {success && (
//               <Typography color="success.main" mt={2}>
//                 Profil mis à jour !
//               </Typography>
//             )}
//           </form>
//         ) : (
//           <Typography>Chargement...</Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
  AccountBalance as RCIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

import { userService } from '@/services/userService';
import type { User } from '@/types';
import { config } from '@/config/config';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    userService.getMe().then(data => {
      setUser(data);
      setInitialLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    try {
      await userService.updateMe(user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 5 Mo');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    
    setUploadingLogo(true);
    try {
      const updatedUser = await userService.uploadLogo(file);
      console.log('Logo uploaded, user data:', updatedUser);
      console.log('Logo URL from upload:', updatedUser.logo_url);
      setUser(updatedUser);
      // Reload user data to ensure we have the latest logo URL
      const refreshedUser = await userService.getMe();
      console.log('Refreshed user data:', refreshedUser);
      console.log('Refreshed logo URL:', refreshedUser.logo_url);
      console.log('Full logo URL:', `${config.apiUrl}/${refreshedUser.logo_url}`);
      setUser(refreshedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Erreur lors du téléchargement du logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          👤 Mon Profil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez vos informations personnelles et professionnelles
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          ✅ Profil mis à jour avec succès !
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Carte Avatar & Info Principale */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            height: '100%',
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 4 
            }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={user?.logo_url && user.logo_url.trim() !== '' ? `${config.apiUrl}/${user.logo_url}` : undefined}
                  imgProps={{ 
                    onError: (e) => {
                      console.error('Failed to load logo:', user?.logo_url);
                      e.currentTarget.style.display = 'none';
                    },
                    onLoad: () => console.log('Logo loaded successfully:', user?.logo_url)
                  }}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    bgcolor: user?.logo_url && user.logo_url.trim() !== '' ? '#f0f0f0' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {(!user?.logo_url || user.logo_url.trim() === '') && (user ? getInitials(user.name) : '?')}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="logo-upload">
                  <IconButton
                    component="span"
                    disabled={uploadingLogo}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      color: '#667eea',
                      width: 36,
                      height: 36,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {uploadingLogo ? <CircularProgress size={20} /> : <PhotoCameraIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </label>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                {user?.email}
              </Typography>
              <Divider sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
              <Box sx={{ width: '100%', textAlign: 'left', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1.5, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Entreprise
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user?.entreprise_name || 'Non renseigné'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon sx={{ mr: 1.5, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      NIF
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user?.nif || 'Non renseigné'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulaire de Modification */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              📝 Informations du Profil
            </Typography>
            
            {user ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Nom */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: '#6366f1', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Nom Complet
                      </Typography>
                    </Box>
                    <TextField
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Votre nom complet"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: '#10b981', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Adresse Email
                      </Typography>
                    </Box>
                    <TextField
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      fullWidth
                      disabled
                      placeholder="email@example.com"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                        }
                      }}
                    />
                  </Grid>

                  {/* Entreprise */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: '#f59e0b', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Nom de l'Entreprise
                      </Typography>
                    </Box>
                    <TextField
                      name="entreprise_name"
                      value={user.entreprise_name || ''}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Nom de votre entreprise"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  {/* NIF */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BadgeIcon sx={{ mr: 1, color: '#ef4444', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Numéro NIF
                      </Typography>
                    </Box>
                    <TextField
                      name="nif"
                      value={user.nif || ''}
                      onChange={handleChange}
                      fullWidth
                      placeholder="123456789012345"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  {/* RC Number */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RCIcon sx={{ mr: 1, color: '#3b82f6', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        N° RC ou CAE
                      </Typography>
                    </Box>
                    <TextField
                      name="rc_number"
                      value={user.rc_number || ''}
                      onChange={handleChange}
                      fullWidth
                      placeholder="123456789012345"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  {/* Téléphone */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: '#8b5cf6', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Téléphone
                      </Typography>
                    </Box>
                    <TextField
                      name="phone"
                      value={user.phone || ''}
                      onChange={handleChange}
                      fullWidth
                      placeholder="+213 555 123 456"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  {/* Adresse */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: '#06b6d4', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Adresse
                      </Typography>
                    </Box>
                    <TextField
                      name="address"
                      value={user.address || ''}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Votre adresse complète"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Bouton de Sauvegarde */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                      },
                      '&:disabled': {
                        background: '#cbd5e1',
                      }
                    }}
                  >
                    {loading ? 'Mise à jour en cours...' : 'Enregistrer les modifications'}
                  </Button>
                </Box>
              </form>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;