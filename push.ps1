# Git Push Script
Set-Location $PSScriptRoot

Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Backend complete with RAG and Railway config"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "Done!" -ForegroundColor Green
Read-Host "Press Enter to exit"
