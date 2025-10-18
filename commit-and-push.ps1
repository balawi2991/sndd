# Git Commit and Push Script

Write-Host "🚀 Starting Git commit and push..." -ForegroundColor Cyan

# Commit
Write-Host "`n📝 Committing changes..." -ForegroundColor Yellow
git commit -m "Complete Sanad project: Railway-ready with automation and docs"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    
    # Push
    Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 Push successful!" -ForegroundColor Green
        Write-Host "`n✅ Project is now on GitHub: https://github.com/balawi2991/sabot" -ForegroundColor Green
        Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Go to https://railway.app" -ForegroundColor White
        Write-Host "   2. Create new project from GitHub" -ForegroundColor White
        Write-Host "   3. Select balawi2991/sabot" -ForegroundColor White
        Write-Host "   4. Add PostgreSQL service" -ForegroundColor White
        Write-Host "   5. Set environment variables" -ForegroundColor White
        Write-Host "   6. Deploy!" -ForegroundColor White
    } else {
        Write-Host "`n❌ Push failed!" -ForegroundColor Red
        Write-Host "   Try: git push -u origin main --force" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Commit failed!" -ForegroundColor Red
}
