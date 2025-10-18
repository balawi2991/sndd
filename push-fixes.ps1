# Push Railway Fixes
Set-Location $PSScriptRoot

Write-Host "Committing Railway fixes..." -ForegroundColor Green
git commit -m "Fix: Add package-lock.json and update for Railway deployment"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "Done! Ready for Railway deployment." -ForegroundColor Green
Read-Host "Press Enter to exit"
