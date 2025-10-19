"""
Catégories de dépenses prédéfinies pour l'Algérie
"""

EXPENSE_CATEGORIES = [
    # Services publics
    "Électricité",
    "Eau",
    "Gaz",
    "Internet",
    "Téléphone",
    
    # Transport
    "Carburant",
    "Transport",
    "Parking",
    "Péage",
    
    # Bureau
    "Loyer",
    "Fournitures",
    "Papeterie",
    "Mobilier",
    
    # Services professionnels
    "Comptabilité",
    "Juridique",
    "Assurances",
    "Banque",
    
    # Marketing
    "Publicité",
    "Communication",
    "Marketing Digital",
    
    # Formation
    "Formation",
    "Livres et Documentation",
    
    # Informatique
    "Logiciels",
    "Matériel Informatique",
    "Hébergement Web",
    "Maintenance",
    
    # Personnel
    "Salaires",
    "CNAS",
    "Formation du Personnel",
    
    # Autres
    "Repas d'Affaires",
    "Cadeaux Clients",
    "Autres Dépenses",
]


# Taux de TVA en Algérie
TVA_RATES = {
    "standard": 19.0,  # Taux standard
    "reduit": 9.0,     # Taux réduit
    "zero": 0.0        # Exonéré
}


# Formats de numéros fiscaux algériens
NIF_FORMAT = "15 chiffres"  # Numéro d'Identification Fiscale
NIS_FORMAT = "15 chiffres"  # Numéro d'Identification Statistique


# Configuration de devise
CURRENCY = {
    "code": "DZD",
    "symbol": "DA",
    "name": "Dinar Algérien"
}


def get_expense_categories():
    """Retourner la liste des catégories de dépenses"""
    return sorted(EXPENSE_CATEGORIES)


def get_tva_rates():
    """Retourner les taux de TVA disponibles"""
    return TVA_RATES


def format_currency(amount):
    """Formater un montant en devise algérienne"""
    return f"{amount:,.2f} {CURRENCY['symbol']}"
