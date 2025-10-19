# Guide de Contribution - 7SSABI

Merci de votre intérêt pour contribuer à 7SSABI ! 🎉

## Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub
# Puis cloner votre fork
git clone https://github.com/VOTRE-USERNAME/7SSABI.git
cd 7SSABI
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

Nommage des branches:
- `feature/` pour les nouvelles fonctionnalités
- `fix/` pour les corrections de bugs
- `docs/` pour la documentation
- `refactor/` pour le refactoring
- `test/` pour ajouter des tests

### 3. Configuration de l'environnement

```bash
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt

# Frontend (quand disponible)
cd frontend
npm install
```

### 4. Développer

- Suivre les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire

### 5. Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### 6. Commit

Suivre la convention Conventional Commits:

```bash
git add .
git commit -m "feat: ajouter la fonctionnalité X"
# ou
git commit -m "fix: corriger le bug Y"
# ou
git commit -m "docs: mettre à jour README"
```

Types de commit:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, points-virgules manquants, etc.
- `refactor`: Refactoring du code
- `test`: Ajout de tests
- `chore`: Maintenance

### 7. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créer une Pull Request sur GitHub avec:
- Titre clair et descriptif
- Description détaillée des changements
- Référence aux issues concernées (#123)
- Screenshots si changements visuels

## Standards de Code

### Python (Backend)

```python
# Utiliser PEP 8
# Docstrings pour toutes les fonctions publiques

def ma_fonction(param1: str, param2: int) -> bool:
    """
    Description de la fonction.
    
    Args:
        param1: Description du paramètre 1
        param2: Description du paramètre 2
    
    Returns:
        Description du retour
    """
    pass
```

### JavaScript/React (Frontend)

```javascript
// Utiliser ESLint et Prettier
// Composants fonctionnels avec hooks

/**
 * Description du composant
 * @param {Object} props - Les props du composant
 */
const MonComposant = ({ prop1, prop2 }) => {
  // Code ici
};
```

## Tests

### Backend (pytest)

```python
def test_ma_fonction():
    """Test de ma_fonction"""
    result = ma_fonction("test", 123)
    assert result is True
```

### Frontend (Jest/React Testing Library)

```javascript
describe('MonComposant', () => {
  it('devrait afficher le titre', () => {
    render(<MonComposant />);
    expect(screen.getByText('Titre')).toBeInTheDocument();
  });
});
```

## Documentation

- Documenter toutes les fonctions publiques
- Mettre à jour le README si nécessaire
- Ajouter des exemples d'utilisation
- Traduire en français ET en anglais si possible

## Checklist avant Pull Request

- [ ] Le code suit les standards du projet
- [ ] Les tests passent tous
- [ ] La documentation est à jour
- [ ] Le commit respecte Conventional Commits
- [ ] Pas de conflits avec la branche principale
- [ ] Le code est testé localement

## Review Process

1. Un mainteneur review votre PR
2. Des changements peuvent être demandés
3. Après validation, votre PR sera mergée
4. Votre contribution sera ajoutée aux release notes

## Types de Contributions

### 🐛 Reporter un Bug

Ouvrir une issue avec:
- Description claire du problème
- Steps to reproduce
- Comportement attendu vs obtenu
- Screenshots si applicable
- Environnement (OS, version Python/Node, etc.)

### ✨ Proposer une Fonctionnalité

Ouvrir une issue "Feature Request" avec:
- Description de la fonctionnalité
- Cas d'usage
- Bénéfices attendus
- Mockups si possible

### 📖 Améliorer la Documentation

- Corriger les typos
- Clarifier les instructions
- Ajouter des exemples
- Traduire

### 🧪 Ajouter des Tests

- Augmenter la couverture de tests
- Ajouter des tests d'intégration
- Tests end-to-end

## Questions ?

- Ouvrir une issue
- Rejoindre notre Discord (à venir)
- Email: contribute@7ssabi.dz

## Code of Conduct

### Notre Engagement

Nous nous engageons à faire de la participation à notre projet une expérience exempte de harcèlement pour tout le monde.

### Standards

Comportements encouragés:
- Être respectueux des différents points de vue
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté

Comportements inacceptables:
- Utilisation de langage ou d'images sexualisées
- Trolling, commentaires insultants
- Harcèlement public ou privé

## Attribution

Les contributeurs seront listés dans le fichier CONTRIBUTORS.md

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

**Merci de contribuer à 7SSABI ! 🚀**
