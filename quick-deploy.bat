@echo off
COLOR 0A
echo.
echo ========================================
echo    AI RESUME ANALYZER - QUICK DEPLOY
echo ========================================
echo.
echo This script will help you deploy your app to GitHub
echo.
pause

REM Navigate to project directory
cd /d "%~dp0"

echo.
echo [1/6] Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo [2/6] Initializing Git repository...
git init

echo.
echo [3/6] Configuring Git user...
echo Please enter your name for Git commits:
set /p git_name="Your Name: "
git config --global user.name "%git_name%"

echo Please enter your email for Git commits:
set /p git_email="Your Email: "
git config --global user.email "%git_email%"

echo.
echo [4/6] Adding all files to Git...
git add .

echo.
echo [5/6] Creating initial commit...
git commit -m "Initial commit - AI Resume Analyzer Pro"

echo.
echo [6/6] Creating main branch...
git branch -M main

echo.
echo ========================================
echo    LOCAL GIT SETUP COMPLETE!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: ai-resume-analyzer
echo    - Click "Create repository"
echo.
echo 2. Copy your repository URL from GitHub
echo    Example: https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
echo.
set /p repo_url="Paste your GitHub repository URL here: "

if not "%repo_url%"=="" (
    echo.
    echo Adding remote repository...
    git remote add origin %repo_url%
    
    echo.
    echo Pushing to GitHub...
    echo You may be asked to login to GitHub
    git push -u origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo    SUCCESS! CODE PUSHED TO GITHUB!
        echo ========================================
        echo.
        echo Your code is now on GitHub!
        echo Repository: %repo_url%
        echo.
        echo FINAL STEP - DEPLOY TO RENDER:
        echo.
        echo 1. Go to: https://render.com
        echo 2. Sign up with GitHub
        echo 3. New + Web Service
        echo 4. Select your repository
        echo 5. Add these environment variables:
        echo.
        echo    GROQ_API_KEY = YOUR_GROQ_API_KEY_HERE
        echo    NODE_ENV = production
        echo    PORT = 3001
        echo.
        echo 6. Click "Create Web Service"
        echo.
        echo Your app will be live in 5 minutes!
        echo.
        echo Full guide: DEPLOY-WITH-GIT.md
    ) else (
        echo.
        echo ERROR: Failed to push to GitHub
        echo.
        echo Possible solutions:
        echo 1. Check your GitHub username/password
        echo 2. Use Personal Access Token instead of password
        echo 3. Verify the repository URL is correct
        echo.
        echo Try running manually:
        echo git push -u origin main
    )
) else (
    echo.
    echo No repository URL provided.
    echo.
    echo Please create a GitHub repository and run:
    echo git remote add origin YOUR_REPO_URL
    echo git push -u origin main
)

echo.
echo ========================================
echo.
pause
