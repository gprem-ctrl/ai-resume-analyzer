@echo off
echo Cleaning up unnecessary files...

del COMPLETE-DEPLOYMENT-GUIDE.md
del DEPLOY-WITH-GIT.md
del DEPLOY-WITHOUT-GIT.md
del DEPLOYMENT-CHECKLIST.md
del DEPLOYMENT-GUIDE.md
del DEPLOYMENT-SUMMARY.md
del ERROR-FIX-README.md
del FIX-ERROR.md
del PRODUCTION-READY-SUMMARY.md
del PRODUCTION-READY.md
del QUICKSTART-OPENAI.md
del START-HERE.md
del SUCCESS.md
del TESTING.md
del CRITICAL-FIXES-APPLIED.md
del FEATURES-ADDED.md
del FAVICON-FIX.md
del RATING-SYSTEM-DOCS.md
del RATING-SYSTEM-SUMMARY.md
del config.js
del deploy-to-github.bat
del fix-and-push.bat
del git-setup.bat
del install-groq.bat
del install-openai.bat
del install.bat
del test-api-key.bat
del test-openai.js
del public\generate-favicon.html

echo Done! Now commit the changes:
echo git add .
echo git commit -m "Remove unnecessary files"
echo git push

pause