# 🧪 Tests pour 7SSABI Backend

## Installation des dépendances de test

```powershell
pip install pytest pytest-asyncio httpx
```

## Structure des tests

```
tests/
├── test_auth.py           # Tests d'authentification
├── test_clients.py        # Tests clients
├── test_products.py       # Tests produits
├── test_invoices.py       # Tests factures
├── test_expenses.py       # Tests dépenses
├── test_dashboard.py      # Tests dashboard
└── conftest.py            # Configuration pytest
```

## Lancer les tests

```powershell
# Tous les tests
pytest

# Avec verbose
pytest -v

# Tests spécifiques
pytest tests/test_auth.py

# Avec couverture
pytest --cov=app tests/
```

## TODO: Créer les tests
