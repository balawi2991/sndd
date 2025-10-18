@echo off
cd /d "%~dp0"

echo Configuring git...
git config user.email "balawi2991@gmail.com"
git config user.name "balawi2991"

echo Committing changes...
git commit -m "Complete backend: RAG + DeepSeek + Multi-tenancy + Railway"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
