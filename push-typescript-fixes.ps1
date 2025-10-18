# Push TypeScript Fixes
Set-Location $PSScriptRoot

Write-Host "Committing TypeScript fixes..." -ForegroundColor Green
git commit -m "Fix: TypeScript errors for Railway deployment"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "Done! Ready for Railway." -ForegroundColor Green
Read-Host "Press Enter to exit"
