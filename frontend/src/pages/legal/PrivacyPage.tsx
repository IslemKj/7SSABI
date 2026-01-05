/**
 * Privacy Policy Page
 */
import { Box, Container, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const PrivacyPage = () => {
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
          Politique de Confidentialité
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 6 }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </Typography>

        <Box sx={{ '& h4': { fontWeight: 700, mt: 4, mb: 2, color: '#1e293b' }, '& p': { color: '#475569', lineHeight: 1.8, mb: 2 } }}>
          <Typography variant="h4">1. Introduction</Typography>
          <Typography>
            Chez Involeo, nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous
            collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre service.
          </Typography>

          <Typography variant="h4">2. Informations que Nous Collectons</Typography>
          <Typography>Nous collectons les types d'informations suivants :</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              <strong>Informations de compte :</strong> nom, prénom, email, numéro de téléphone, adresse de l'entreprise
            </li>
            <li>
              <strong>Données commerciales :</strong> informations sur vos clients, factures, produits, dépenses
            </li>
            <li>
              <strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation
            </li>
            <li>
              <strong>Données d'utilisation :</strong> pages visitées, fonctionnalités utilisées, temps passé sur la plateforme
            </li>
          </Typography>

          <Typography variant="h4">3. Comment Nous Utilisons Vos Informations</Typography>
          <Typography>Nous utilisons vos informations pour :</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Fournir et améliorer nos services</li>
            <li>Gérer votre compte et vos abonnements</li>
            <li>Traiter vos paiements</li>
            <li>Vous envoyer des notifications importantes sur le service</li>
            <li>Analyser l'utilisation de la plateforme pour l'améliorer</li>
            <li>Assurer la sécurité et prévenir la fraude</li>
          </Typography>

          <Typography variant="h4">4. Partage de Vos Informations</Typography>
          <Typography>
            Nous ne vendons jamais vos informations personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              <strong>Prestataires de services :</strong> nous travaillons avec des prestataires tiers pour l'hébergement, le traitement des
              paiements
            </li>
            <li>
              <strong>Obligations légales :</strong> si requis par la loi ou pour protéger nos droits
            </li>
            <li>
              <strong>Avec votre consentement :</strong> dans d'autres cas, uniquement avec votre autorisation explicite
            </li>
          </Typography>

          <Typography variant="h4">5. Sécurité des Données</Typography>
          <Typography>
            Nous utilisons des mesures de sécurité de niveau industriel pour protéger vos données, notamment :
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Chiffrement des données sensibles dans notre base de données</li>
            <li>Accès restreint aux données par notre personnel</li>
            <li>Sauvegardes régulières et sécurisées</li>
            <li>Surveillance continue de la sécurité</li>
          </Typography>

          <Typography variant="h4">6. Conservation des Données</Typography>
          <Typography>
            Nous conservons vos données aussi longtemps que votre compte est actif ou selon les besoins pour vous fournir le service. Si vous
            supprimez votre compte, vos données personnelles seront supprimées dans un délai de 30 jours, sauf obligation légale de
            conservation.
          </Typography>

          <Typography variant="h4">7. Vos Droits</Typography>
          <Typography>Vous avez le droit de :</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Accéder à vos données personnelles</li>
            <li>Corriger ou mettre à jour vos informations</li>
            <li>Supprimer votre compte et vos données</li>
            <li>Exporter vos données dans un format portable</li>
            <li>Vous opposer au traitement de vos données pour certaines finalités</li>
            <li>Retirer votre consentement à tout moment</li>
          </Typography>

          <Typography variant="h4">8. Cookies</Typography>
          <Typography>
            Nous utilisons des cookies et technologies similaires pour améliorer votre expérience. Les cookies nous aident à vous
            reconnaître, mémoriser vos préférences et analyser l'utilisation de notre service. Vous pouvez désactiver les cookies dans les
            paramètres de votre navigateur, mais cela peut affecter certaines fonctionnalités.
          </Typography>

          <Typography variant="h4">9. Services Tiers</Typography>
          <Typography>
            Notre service peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables des pratiques de confidentialité
            de ces sites. Nous vous encourageons à lire leurs politiques de confidentialité.
          </Typography>

          <Typography variant="h4">10. Modifications de la Politique</Typography>
          <Typography>
            Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement
            important par email ou via une notification sur la plateforme. Votre utilisation continue du service après les modifications
            constitue votre acceptation de la nouvelle politique.
          </Typography>

          <Typography variant="h4">11. Protection des Mineurs</Typography>
          <Typography>
            Involeo n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment d'informations sur les mineurs. Si
            vous pensez qu'un mineur a créé un compte, veuillez nous contacter.
          </Typography>

          <Typography variant="h4">12. Transferts Internationaux</Typography>
          <Typography>
            Vos données sont stockées en Algérie. Si elles doivent être transférées à l'étranger pour traitement, nous nous assurerons que
            des protections adéquates sont en place conformément aux lois algériennes.
          </Typography>

          <Typography variant="h4">13. Contact</Typography>
          <Typography>
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter :
            <br />
            Email : support@involeo.dz
            <br />
            Téléphone : +213 550 45 04 02
            <br />
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
