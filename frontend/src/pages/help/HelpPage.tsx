/**
 * Help & FAQ Page
 */
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  TextField,
  Paper,
  Divider,
  Chip,
  alpha,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  HelpOutline as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Send as SendIcon,
  Support as SupportIcon,
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { contactService } from '@/services/contactService';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: 'Général',
    question: 'Qu\'est-ce que Involeo ?',
    answer: 'Involeo est une solution complète de gestion et de comptabilité qui vous permet de gérer vos clients, produits, factures, devis et dépenses en toute simplicité. Notre plateforme offre des outils d\'analyse avancés et des tableaux de bord intuitifs pour suivre votre activité en temps réel.',
  },
  {
    category: 'Général',
    question: 'Comment créer un compte ?',
    answer: 'Pour créer un compte, cliquez sur le bouton "S\'inscrire" sur la page de connexion. Remplissez le formulaire avec vos informations (nom, email, mot de passe) et validez. Vous recevrez un email de confirmation pour activer votre compte.',
  },
  {
    category: 'Clients',
    question: 'Comment ajouter un nouveau client ?',
    answer: 'Accédez à la page "Clients" depuis le menu principal, puis cliquez sur le bouton "Ajouter un client". Remplissez les informations requises (nom, email, adresse, etc.) et cliquez sur "Enregistrer". Le client sera immédiatement disponible pour la création de factures et devis.',
  },
  {
    category: 'Clients',
    question: 'Puis-je importer plusieurs clients en une fois ?',
    answer: 'Oui, la fonctionnalité d\'import en masse est disponible. Sur la page Clients, cliquez sur "Importer CSV" et téléchargez un fichier CSV contenant vos clients. Vous pouvez télécharger un modèle CSV pour voir le format attendu. Le fichier doit contenir les colonnes : name, email, phone, address, nif, rc_number, company_name.',
  },
  {
    category: 'Factures',
    question: 'Comment créer une facture ?',
    answer: 'Allez sur la page "Factures et Devis", cliquez sur "Nouvelle facture". Sélectionnez un client, ajoutez les produits ou services, définissez les quantités et les prix. Le système calculera automatiquement les totaux et la TVA. Vous pouvez ensuite générer un PDF ou envoyer la facture par email.',
  },
  {
    category: 'Factures',
    question: 'Quelle est la différence entre une facture et un devis ?',
    answer: 'Un devis est une proposition commerciale non définitive que vous envoyez à un client avant la vente. Une facture est un document comptable définitif émis après la livraison d\'un bien ou service. Les devis peuvent être convertis en factures en un clic une fois acceptés.',
  },
  {
    category: 'Factures',
    question: 'Comment gérer la TVA sur mes factures ?',
    answer: 'Le système gère automatiquement le calcul de la TVA. Vous définissez le taux de TVA applicable lors de la création de chaque produit ou directement lors de la création d\'une facture. Le montant total TTC est calculé automatiquement en fonction du taux spécifié.',
  },
  {
    category: 'Produits',
    question: 'Comment ajouter des produits ou services ?',
    answer: 'Rendez-vous sur la page "Produits", cliquez sur "Ajouter un produit". Renseignez le nom, la description, le prix unitaire, et le taux de TVA. Vous pouvez également ajouter une référence SKU et gérer votre stock si nécessaire.',
  },
  {
    category: 'Produits',
    question: 'Puis-je gérer mon stock de produits ?',
    answer: 'Oui, pour chaque produit (pas les services), vous pouvez définir et gérer la quantité en stock. Lors de la création ou modification d\'un produit, un champ "Stock disponible" vous permet de saisir la quantité. Le stock est affiché dans le tableau des produits avec un code couleur : vert (>10), orange (1-10), rouge (0).',
  },
  {
    category: 'Dépenses',
    question: 'Comment enregistrer une dépense ?',
    answer: 'Sur la page "Dépenses", cliquez sur "Ajouter une dépense". Renseignez le montant, la catégorie, la date et une description. Ces données seront prises en compte dans vos rapports financiers et analyses.',
  },
  {
    category: 'Dépenses',
    question: 'Quelles catégories de dépenses sont disponibles ?',
    answer: 'Le système propose plusieurs catégories de dépenses par défaut : fournitures, loyer, salaires, marketing, transport, etc. Ces catégories vous permettent de bien organiser et analyser vos dépenses professionnelles.',
  },
  {
    category: 'Rapports',
    question: 'Quels types de rapports sont disponibles ?',
    answer: 'Le tableau de bord Analytics vous offre plusieurs rapports : chiffre d\'affaires, évolution des ventes, analyse par client, analyse par produit, suivi des dépenses, et rentabilité. Tous les rapports peuvent être exportés en PDF ou Excel.',
  },
  {
    category: 'Rapports',
    question: 'Puis-je exporter mes données ?',
    answer: 'Vous pouvez générer et télécharger vos factures et devis individuellement au format PDF. L\'export en masse des données (CSV/Excel) est prévu pour une prochaine mise à jour.',
  },
  {
    category: 'Sécurité',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous utilisons les protocoles de sécurité les plus avancés (HTTPS, chiffrement des données au repos et en transit). Des sauvegardes régulières sont effectuées automatiquement.',
  },
  {
    category: 'Sécurité',
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?". Entrez votre adresse email et vous recevrez un lien de réinitialisation. Cliquez sur ce lien et créez un nouveau mot de passe sécurisé.',
  },
  {
    category: 'Paramètres',
    question: 'Puis-je personnaliser mes factures ?',
    answer: 'Dans les paramètres de votre profil, vous pouvez configurer les informations de votre entreprise qui apparaîtront sur vos factures (nom, adresse, numéro RC, etc.). Vous pouvez également télécharger votre logo d\'entreprise qui sera affiché sur vos documents. La personnalisation avancée (couleurs, modèles multiples) est prévue pour une prochaine mise à jour.',
  },
  {
    category: 'Paramètres',
    question: 'Comment gérer les devises ?',
    answer: 'Vous pouvez définir la devise lors de la création de chaque facture ou produit. Le système permet de travailler avec différentes devises selon vos besoins commerciaux.',
  },
];

const HelpPage = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | false>('Général');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitContact = async () => {
    // Validate form
    if (!contactForm.name.trim() || !contactForm.email.trim() || 
        !contactForm.subject.trim() || !contactForm.message.trim()) {
      setSubmitError('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await contactService.sendMessage(contactForm);
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.detail || 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Général':
        return <HelpIcon />;
      case 'Clients':
        return <QuestionAnswerIcon />;
      case 'Factures':
        return <DescriptionIcon />;
      case 'Produits':
        return <LocalOfferIcon />;
      case 'Dépenses':
        return <AssignmentIcon />;
      case 'Rapports':
        return <AssessmentIcon />;
      case 'Sécurité':
      case 'Paramètres':
        return <SupportIcon />;
      default:
        return <HelpIcon />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          Centre d'Aide
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Trouvez des réponses à vos questions et contactez notre équipe de support
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Contact Information Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SupportIcon
                  sx={{
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Contactez-nous
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: alpha('#667eea', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <EmailIcon sx={{ color: '#667eea' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@involeo.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      contact@involeo.com
                    </Typography>
                  </Box>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: alpha('#667eea', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PhoneIcon sx={{ color: '#667eea' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Téléphone
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +213 550 45 04 02
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dim - Jeu: 9h00 - 18h00
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Horaires de support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Lundi - Vendredi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    9h00 - 18h00
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Samedi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    10h00 - 14h00
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Vendredi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Fermé
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* FAQ Section */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <QuestionAnswerIcon
                  sx={{
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Questions Fréquentes (FAQ)
                </Typography>
              </Box>

              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Rechercher dans les questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Categories */}
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    icon={getCategoryIcon(category)}
                    onClick={() =>
                      setExpandedCategory(expandedCategory === category ? false : category)
                    }
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor:
                        expandedCategory === category
                          ? alpha('#667eea', 0.15)
                          : alpha('#667eea', 0.05),
                      color: expandedCategory === category ? '#667eea' : 'text.secondary',
                      border: '1px solid',
                      borderColor:
                        expandedCategory === category
                          ? '#667eea'
                          : alpha('#667eea', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#667eea', 0.15),
                        borderColor: '#667eea',
                      },
                    }}
                  />
                ))}
              </Box>

              {/* FAQ Accordions */}
              <Box>
                {categories.map((category) => {
                  const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category);
                  if (categoryFaqs.length === 0) return null;

                  return (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: '#667eea',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {category}
                      </Typography>
                      {categoryFaqs.map((faq, index) => (
                        <Accordion
                          key={index}
                          sx={{
                            mb: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'rgba(0, 0, 0, 0.06)',
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              '&:hover': {
                                bgcolor: alpha('#667eea', 0.05),
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {faq.question}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" color="text.secondary">
                              {faq.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: alpha('#667eea', 0.05),
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Aucune question ne correspond à votre recherche.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SendIcon
                  sx={{
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Envoyez-nous un message
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Vous n'avez pas trouvé de réponse à votre question ? Notre équipe est là pour vous
                aider. Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus
                brefs délais.
              </Typography>

              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </Alert>
              )}

              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={contactForm.name}
                    onChange={(e) => handleContactFormChange('name', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactFormChange('email', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sujet"
                    value={contactForm.subject}
                    onChange={(e) => handleContactFormChange('subject', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitContact}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{
                      borderRadius: 2.5,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HelpPage;
