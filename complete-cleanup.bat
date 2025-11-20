@echo off
echo Cleaning Git history and removing exposed secrets...

REM Step 1: Remove .git folder completely
rd /s /q .git

REM Step 2: Delete all files that might contain API keys
del /f GIT-FIXED-README.md 2>nul
del /f START-HERE-GIT-FIX.md 2>nul
del /f READ-ME-FIRST.txt 2>nul
del /f QUICK-DEPLOY.md 2>nul
del /f fix-git-and-push.bat 2>nul
del /f FINAL-FIX-README.md 2>nul
del /f COMPLETE-GIT-FIX.bat 2>nul
del /f "!!!-DOUBLE-CLICK-THIS-!!!.txt" 2>nul
del /f START-HERE.txt 2>nul
del /f DEPLOYMENT.md 2>nul

REM Step 3: Initialize fresh Git repository
git init

REM Step 4: Add all files
git add .

REM Step 5: Create initial commit
git commit -m "Initial commit - Clean version"

REM Step 6: Add remote
git remote add origin https://github.com/gprem-ctrl/ai-resume-analyzer.git

REM Step 7: Force push
git push -u origin main --force

echo Done!
pause
