/**
 * Terms of Service Page
 */
import { Box, Container, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ color: '#1e293b' }}>
            Retour
          </Button>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img src="/logo.svg" alt="Involeo" style={{ height: '40px' }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 12, pb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
          Conditions d'Utilisation
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 6 }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </Typography>

        <Box sx={{ '& h4': { fontWeight: 700, mt: 4, mb: 2, color: '#1e293b' }, '& p': { color: '#475569', lineHeight: 1.8, mb: 2 } }}>
          <Typography variant="h4">1. Acceptation des Conditions</Typography>
          <Typography>
            En accédant et en utilisant Involeo, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces
            conditions, veuillez ne pas utiliser notre service.
          </Typography>

          <Typography variant="h4">2. Description du Service</Typography>
          <Typography>
            Involeo est une plateforme SaaS de gestion de facturation et de comptabilité conçue pour les micro-entrepreneurs et petites
            entreprises algériennes. Le service vous permet de créer des factures, gérer vos clients, suivre vos revenus et dépenses.
          </Typography>

          <Typography variant="h4">3. Inscription et Compte</Typography>
          <Typography>
            Vous devez créer un compte pour utiliser Involeo. Vous êtes responsable de la confidentialité de vos identifiants et de toutes
            les activités qui se produisent sous votre compte. Vous acceptez de :
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Fournir des informations exactes et complètes lors de l'inscription</li>
            <li>Maintenir la sécurité de votre mot de passe</li>
            <li>Nous notifier immédiatement de toute utilisation non autorisée de votre compte</li>
          </Typography>

          <Typography variant="h4">4. Abonnements et Paiements</Typography>
          <Typography>
            Involeo propose plusieurs plans tarifaires. Les paiements sont traités mensuellement. Actuellement, les paiements se font par
            virement bancaire ou en espèces. Vous pouvez annuler votre abonnement à tout moment.
          </Typography>

          <Typography variant="h4">5. Propriété Intellectuelle</Typography>
          <Typography>
            Le contenu, les fonctionnalités et la technologie d'Involeo sont la propriété exclusive d'Involeo et sont protégés par les lois
            sur la propriété intellectuelle. Vous conservez tous les droits sur les données que vous entrez dans le système.
          </Typography>

          <Typography variant="h4">6. Utilisation Acceptable</Typography>
          <Typography>Vous acceptez de ne pas :</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Utiliser le service à des fins illégales</li>
            <li>Tenter de pirater ou de compromettre la sécurité du système</li>
            <li>Partager votre compte avec d'autres personnes</li>
            <li>Utiliser le service pour envoyer du spam ou du contenu malveillant</li>
          </Typography>

          <Typography variant="h4">7. Confidentialité des Données</Typography>
          <Typography>
            Nous prenons la confidentialité de vos données très au sérieux. Consultez notre Politique de Confidentialité pour plus de
            détails sur la collecte et l'utilisation de vos informations.
          </Typography>

          <Typography variant="h4">8. Limitation de Responsabilité</Typography>
          <Typography>
            Involeo est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas responsables des dommages directs, indirects,
            accessoires ou consécutifs résultant de votre utilisation ou de votre incapacité à utiliser le service.
          </Typography>

          <Typography variant="h4">9. Résiliation</Typography>
          <Typography>
            Nous nous réservons le droit de suspendre ou de résilier votre compte si vous violez ces conditions d'utilisation. Vous pouvez
            également résilier votre compte à tout moment en nous contactant.
          </Typography>

          <Typography variant="h4">10. Modifications des Conditions</Typography>
          <Typography>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur
            publication. Votre utilisation continue du service après les modifications constitue votre acceptation des nouvelles conditions.
          </Typography>

          <Typography variant="h4">11. Droit Applicable</Typography>
          <Typography>
            Ces conditions sont régies par les lois algériennes. Tout litige sera soumis à la juridiction exclusive des tribunaux algériens.
          </Typography>

          <Typography variant="h4">12. Contact</Typography>
          <Typography>
            Pour toute question concernant ces conditions, veuillez nous contacter à :
            <br />
            Email : contact@involeo.dz
            <br />
            Téléphone : +213 550 45 04 02
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsPage;
