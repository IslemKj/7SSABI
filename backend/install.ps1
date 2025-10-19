# Script d'installation pour 7SSABI Backend
# Usage: .\install.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation de 7SSABI Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier Python
Write-Host "[OK] Verification de Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Python n'est pas installe!" -ForegroundColor Red
    Write-Host "  Veuillez installer Python 3.9+ depuis https://www.python.org/" -ForegroundColor Red
    exit 1
}
Write-Host "  $pythonVersion" -ForegroundColor Green

# Creer l'environnement virtuel
Write-Host ""
Write-Host "[OK] Creation de l'environnement virtuel..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "  L'environnement virtuel existe deja" -ForegroundColor Green
} else {
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] Echec de la creation de l'environnement virtuel" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Environnement virtuel cree" -ForegroundColor Green
}

# Activer l'environnement virtuel
Write-Host ""
Write-Host "[OK] Activation de l'environnement virtuel..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Installer les dependances
Write-Host ""
Write-Host "[OK] Installation des dependances..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Echec de l'installation des dependances" -ForegroundColor Red
    exit 1
}
Write-Host "  Dependances installees" -ForegroundColor Green

# Copier .env.example vers .env si .env n'existe pas
Write-Host ""
Write-Host "[OK] Configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Fichier .env cree a partir de .env.example" -ForegroundColor Green
    Write-Host "  [!] N'oubliez pas de modifier .env avec vos parametres!" -ForegroundColor Yellow
} else {
    Write-Host "  Le fichier .env existe deja" -ForegroundColor Green
}

# Creer les dossiers necessaires
Write-Host ""
Write-Host "[OK] Creation des dossiers..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "invoices" | Out-Null
New-Item -ItemType Directory -Force -Path "receipts" | Out-Null
Write-Host "  Dossiers crees" -ForegroundColor Green

# Resume
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation terminee avec succes!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "  1. Editer le fichier .env avec vos parametres" -ForegroundColor White
Write-Host "  2. Lancer le serveur: python run.py" -ForegroundColor White
Write-Host "  3. Acceder a la documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
