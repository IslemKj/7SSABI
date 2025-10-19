# Script de démarrage rapide pour 7SSABI Backend
# Usage: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Demarrage de 7SSABI Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si l'environnement virtuel existe
if (-not (Test-Path "venv")) {
    Write-Host "[X] Environnement virtuel non trouve!" -ForegroundColor Red
    Write-Host "  Veuillez executer .\install.ps1 d'abord" -ForegroundColor Red
    exit 1
}

# Vérifier si .env existe
if (-not (Test-Path ".env")) {
    Write-Host "[X] Fichier .env non trouve!" -ForegroundColor Red
    Write-Host "  Veuillez copier .env.example vers .env et le configurer" -ForegroundColor Red
    exit 1
}

# Activer l'environnement virtuel
Write-Host "[OK] Activation de l'environnement virtuel..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

Write-Host "[OK] Demarrage du serveur..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Serveur accessible sur:" -ForegroundColor Green
Write-Host "  - API: http://localhost:8000" -ForegroundColor White
Write-Host "  - Documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - ReDoc: http://localhost:8000/redoc" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur CTRL+C pour arreter le serveur" -ForegroundColor Yellow
Write-Host ""

# Lancer le serveur
python run.py
