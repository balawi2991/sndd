# Git Commit and Push Script

Write-Host "Starting Git commit and push..." -ForegroundColor Cyan

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Complete Sanad project with Railway config and automation"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit successful!" -ForegroundColor Green
    
    # Push
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful!" -ForegroundColor Green
        Write-Host "Project is now on GitHub: https://github.com/balawi2991/sabot" -ForegroundColor Green
    } else {
        Write-Host "Push failed! Try: git push -u origin main --force" -ForegroundColor Red
    }
} else {
    Write-Host "Commit failed!" -ForegroundColor Red
}
