# 🎯 AI Resume Analyzer Pro

![AI Resume Analyzer](https://img.shields.io/badge/AI-Groq%20Llama%203-blue)
![Version](https://img.shields.io/badge/version-2.0.0-success)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)
Professional AI-Powered Resume Analysis using Groq AI

Get unique, personalized feedback on every resume with REAL artificial intelligence powered by Groq's ultra-fast inference

Features • Quick Start • Setup • How It Works • API

✨ Features
🤖 REAL AI Analysis
Groq Llama 3 - Ultra-fast AI model from Groq
Unique Analysis - Every resume gets personalized feedback
Content-Based Scoring - Scores based on actual resume content
Intelligent Feedback - Specific, actionable suggestions
Lightning Fast - Powered by Groq's LPU™ Inference Engine
📊 Comprehensive Scoring
Overall Score (0-100) - Holistic resume quality
Structure Score - Organization and formatting
Content Score - Achievements and impact
ATS Compatibility - Applicant Tracking System optimization
Skills Score - Technical and soft skills presentation
💡 Actionable Insights
✅ Strengths - What you're doing right
🎯 Improvements - Specific areas to enhance
🏷️ Keywords - Present and missing keywords
🚀 Recommendations - Immediate actions + long-term goals
📈 Reports Dashboard
View All Analyses - Access complete history
Analytics - Average scores, trends, progress
Re-access Anytime - All reports saved permanently
Export Ready - JSON format for easy sharing
🎨 Professional UI
Modern Design - Clean, intuitive interface
Drag & Drop - Easy file upload
Responsive - Works on all devices
Beautiful Graphics - Professional icons and animations
🚀 Quick Start
Prerequisites
Node.js v14+ and npm
Groq API key (free tier available)
Installation
bash
# 1. Navigate to project folder
cd "C:\AI Resume Analyzer"

# 2. Run installation script
install.bat

# OR manually:
npm install groq-sdk dotenv

# 3. Configure API key
# Edit .env file and add your key from https://console.groq.com/

# 4. Start server
node server.js

# 5. Open browser
# Go to http://localhost:3001
🔧 Detailed Setup
1. Get Groq API Key
Visit https://console.groq.com/
Sign up (free tier includes generous credits)
Go to API Keys section
Click "Create API Key"
Copy your key (format: gsk_...)
2. Configure Environment
Create/edit .env file:

env
GROQ_API_KEY=gsk_your-actual-key-here
PORT=3001
NODE_ENV=development
3. Install Dependencies
bash
npm install
This installs:

groq-sdk - Groq AI API client
express - Web server
multer - File upload handling
pdf-parse - PDF text extraction
cors - Cross-origin support
dotenv - Environment variables
4. Start Application
bash
node server.js
Expected output:

============================================================
🚀 AI Resume Analyzer Pro - REAL AI EDITION
============================================================
📡 Server running on: http://localhost:3001
📁 Uploads directory: C:\AI Resume Analyzer\uploads
📊 Reports directory: C:\AI Resume Analyzer\reports
✅ AI Service: CONFIGURED (Groq Llama 3)
============================================================
🎯 How It Works
Analysis Pipeline
1. Upload Resume (PDF/TXT)
   ↓
2. Extract Text (pdf-parse)
   ↓
3. Send to Groq AI (Groq API)
   ↓
4. AI Analyzes Content (Real Intelligence)
   ↓
5. Generate Unique Feedback (Personalized)
   ↓
6. Display Results & Save Report
What Groq AI Analyzes
Resume Structure

Section organization
Heading clarity
Formatting consistency
Logical flow
Content Quality

Quantifiable achievements
Action verb usage
Impact statements
Detail level
ATS Optimization

Keyword density
Standard formatting
Machine readability
Industry terms
Skills Presentation

Technical skills coverage
Soft skills mention
Organization
Relevance to field
💰 Pricing
Groq Cloud
Free Tier - Generous free credits for testing
Pay-as-you-go - Extremely affordable pricing
Ultra-Fast - Industry-leading inference speed
Typical Resume Analysis
Input: ~2,000 tokens (resume text)
Output: ~800 tokens (analysis)
Cost per resume: ~$0.001 (0.1 cents)
Speed: Analysis completed in seconds!
Example Usage Costs
Resumes	Cost
1	$0.001
10	$0.01
50	$0.05
100	$0.10
1,000	$1.00
Free tier includes thousands of free analyses!

📚 API Documentation
Endpoints
POST /api/analyze
Upload and analyze resume

Request:

bash
curl -X POST http://localhost:3001/api/analyze \
  -F "resume=@resume.pdf"
Response:

json
{
  "success": true,
  "filename": "resume.pdf",
  "analysis": {
    "overallScore": 85,
    "sections": {...},
    "strengths": [...],
    "improvements": [...],
    "keywords": {...},
    "recommendations": {...}
  },
  "reportId": "report-1234567890.json"
}
GET /api/reports
Get all analysis reports

Response:

json
{
  "reports": [
    {
      "id": "report-1234567890.json",
      "filename": "resume.pdf",
      "date": "2025-11-18T10:30:00.000Z",
      "score": 85,
      "aiModel": "llama3-70b-8192"
    }
  ],
  "total": 1
}
GET /api/reports/:reportId
Get specific report details

Response:

json
{
  "filename": "resume.pdf",
  "uploadDate": "2025-11-18T10:30:00.000Z",
  "analysis": {...},
  "aiModel": "llama3-70b-8192"
}
GET /api/health
Check server status

Response:

json
{
  "status": "running",
  "aiConfigured": true,
  "timestamp": "2025-11-18T10:30:00.000Z",
  "model": "llama3-70b-8192"
}
GET /api/config-check
Verify AI configuration

Response:

json
{
  "configured": true,
  "message": "AI service is properly configured"
}
🛠️ Tech Stack
Frontend
HTML5 - Semantic markup
CSS3 - Modern styling with animations
Vanilla JavaScript - No frameworks needed
Font Awesome 6.4 - Professional icons
Backend
Node.js - JavaScript runtime
Express.js - Web framework
Groq SDK - Groq AI integration
Multer - File upload handling
PDF-Parse - PDF text extraction
dotenv - Environment configuration
📁 Project Structure
AI-Resume-Analyzer/
├── public/
│   ├── index.html        # Professional UI
│   └── script.js         # Frontend logic
├── uploads/              # Uploaded resumes
├── reports/              # Analysis reports
├── server.js             # Express server + AI
├── package.json          # Dependencies
├── .env                  # API configuration (DO NOT COMMIT)
├── .env.example          # Template
├── .gitignore            # Git exclusions
├── install.bat           # Windows installer
├── README.md             # This file
└── GROQ-SETUP.md         # Detailed Groq setup guide
🔒 Security
API Key Protection
bash
# ✅ CORRECT: Environment variable
GROQ_API_KEY=gsk_...

# ❌ WRONG: Hardcoded
const apiKey = "gsk_..."
Important
.env file is NEVER committed to Git
Already added to .gitignore
Use .env.example as template
🐛 Troubleshooting
"AI service not configured"
Cause: API key missing or invalid

Solution:

Check .env file exists
Verify API key format: gsk_...
Restart server after editing .env
"Invalid API key"
Cause: Wrong or expired key

Solution:

Generate new key at https://console.groq.com/
Update .env file
Restart server
"Rate limit exceeded"
Cause: Too many requests

Solution:

Wait 60 seconds
Check usage in Groq dashboard
Consider upgrading your plan
PDF not parsing
Cause: Image-only PDF or password-protected

Solution:

Ensure PDF has selectable text
Remove password protection
Try converting to plain text
📊 Features Comparison
Feature	Demo Version	AI Version (Current)
Analysis	❌ Template	✅ Real AI
Unique Feedback	❌ Same every time	✅ Personalized
Content-Based	❌ No	✅ Yes
Scores	❌ Static	✅ Dynamic
Keywords	❌ Hardcoded	✅ Extracted
Useful	❌ Demo only	✅ Production-ready
🚀 Roadmap
Phase 1 (Current) ✅
 Real AI integration (Groq Llama 3)
 Dynamic analysis
 Reports dashboard
 Professional UI
Phase 2 (Next)
 Multiple AI models support
 Job description matching
 Industry-specific analysis
 Resume templates
 PDF report export
Phase 3 (Future)
 User authentication
 Resume comparison
 Version tracking
 Email delivery
 Mobile app
 API for third parties
💡 Tips for Best Results
Clear PDFs - Ensure text is selectable, not image-only
Complete Resume - Include all sections for comprehensive analysis
Regular Updates - Re-analyze after changes to track improvement
Follow AI Advice - Implement suggestions and re-test
Test Multiple Versions - Compare different resume formats
📝 License
MIT License - Free for personal and commercial use

🤝 Contributing
Contributions welcome! Please feel free to submit pull requests.

📧 Support
Issues?

Check console logs
Verify .env configuration
Test: curl http://localhost:3001/api/health
Check Groq status: https://status.groq.com/
Questions?

Create an issue on GitHub
Check GROQ-SETUP.md for detailed instructions
🌟 Acknowledgments
Groq - Ultra-fast AI inference platform
Express.js - Web framework
Font Awesome - Icons
PDF-Parse - PDF text extraction
Community - All contributors
Made with ❤️ using Groq AI

Helping job seekers land their dream jobs through AI-powered insights

Get Started • Documentation • Report Issue

