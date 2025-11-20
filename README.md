# 🎯 AI Resume Analyzer Pro

<div align="center">

![AI Resume Analyzer](https://img.shields.io/badge/AI-Claude%20Sonnet%204-blue)
![Version](https://img.shields.io/badge/version-2.0.0-success)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

**Professional AI-Powered Resume Analysis using Claude AI**

*Get unique, personalized feedback on every resume with REAL artificial intelligence*

[Features](#-features) • [Quick Start](#-quick-start) • [Setup](#-detailed-setup) • [How It Works](#-how-it-works) • [API](#-api-documentation)

</div>

---

## ✨ Features

### 🤖 REAL AI Analysis
- **Claude Sonnet 4** - Latest AI model from Anthropic
- **Unique Analysis** - Every resume gets personalized feedback
- **Content-Based Scoring** - Scores based on actual resume content
- **Intelligent Feedback** - Specific, actionable suggestions

### 📊 Comprehensive Scoring
- **Overall Score** (0-100) - Holistic resume quality
- **Structure Score** - Organization and formatting
- **Content Score** - Achievements and impact
- **ATS Compatibility** - Applicant Tracking System optimization
- **Skills Score** - Technical and soft skills presentation

### 💡 Actionable Insights
- ✅ **Strengths** - What you're doing right
- 🎯 **Improvements** - Specific areas to enhance
- 🏷️ **Keywords** - Present and missing keywords
- 🚀 **Recommendations** - Immediate actions + long-term goals

### 📈 Reports Dashboard
- **View All Analyses** - Access complete history
- **Analytics** - Average scores, trends, progress
- **Re-access Anytime** - All reports saved permanently
- **Export Ready** - JSON format for easy sharing

### 🎨 Professional UI
- **Modern Design** - Clean, intuitive interface
- **Drag & Drop** - Easy file upload
- **Responsive** - Works on all devices
- **Beautiful Graphics** - Professional icons and animations

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v14+ and npm
Anthropic API key (free tier available)
```

### Installation

```bash
# 1. Navigate to project folder
cd "C:\AI Resume Analyzer"

# 2. Run installation script
install.bat

# OR manually:
npm install @anthropic-ai/sdk dotenv

# 3. Configure API key
# Edit .env file and add your key from https://console.anthropic.com/

# 4. Start server
node server.js

# 5. Open browser
# Go to http://localhost:3001
```

---

## 🔧 Detailed Setup

### 1. Get Anthropic API Key

1. Visit **https://console.anthropic.com/**
2. Sign up (free $5 credit for new users)
3. Go to **API Keys** section
4. Click **"Create Key"**
5. Copy your key (format: `sk-ant-api03-...`)

### 2. Configure Environment

Create/edit `.env` file:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
NODE_ENV=development
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- `@anthropic-ai/sdk` - Anthropic Claude API client
- `express` - Web server
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `cors` - Cross-origin support
- `dotenv` - Environment variables

### 4. Start Application

```bash
node server.js
```

Expected output:
```
============================================================
🚀 AI Resume Analyzer Pro - REAL AI EDITION
============================================================

📡 Server running on: http://localhost:3001
📁 Uploads directory: C:\AI Resume Analyzer\uploads
📊 Reports directory: C:\AI Resume Analyzer\reports
✅ AI Service: CONFIGURED (Claude Sonnet 4)

============================================================
```

---

## 🎯 How It Works

### Analysis Pipeline

```
1. Upload Resume (PDF/TXT)
           ↓
2. Extract Text (pdf-parse)
           ↓
3. Send to Claude AI (Anthropic API)
           ↓
4. AI Analyzes Content (Real Intelligence)
           ↓
5. Generate Unique Feedback (Personalized)
           ↓
6. Display Results & Save Report
```

### What Claude AI Analyzes

**Resume Structure**
- Section organization
- Heading clarity
- Formatting consistency
- Logical flow

**Content Quality**
- Quantifiable achievements
- Action verb usage
- Impact statements
- Detail level

**ATS Optimization**
- Keyword density
- Standard formatting
- Machine readability
- Industry terms

**Skills Presentation**
- Technical skills coverage
- Soft skills mention
- Organization
- Relevance to field

---

## 💰 Pricing

### Anthropic Claude Sonnet 4

- **Input**: $3 / million tokens
- **Output**: $15 / million tokens

### Typical Resume Analysis

- **Input**: ~2,000 tokens (resume text)
- **Output**: ~800 tokens (analysis)
- **Cost per resume**: ~$0.02 (2 cents)

### Example Usage Costs

| Resumes | Cost |
|---------|------|
| 1 | $0.02 |
| 10 | $0.20 |
| 50 | $1.00 |
| 100 | $2.00 |
| 1,000 | $20.00 |

**New users get $5 free credit = ~250 free analyses!**

---

## 📚 API Documentation

### Endpoints

#### POST `/api/analyze`
Upload and analyze resume

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -F "resume=@resume.pdf"
```

**Response:**
```json
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
```

#### GET `/api/reports`
Get all analysis reports

**Response:**
```json
{
  "reports": [
    {
      "id": "report-1234567890.json",
      "filename": "resume.pdf",
      "date": "2025-11-18T10:30:00.000Z",
      "score": 85,
      "aiModel": "claude-sonnet-4-20250514"
    }
  ],
  "total": 1
}
```

#### GET `/api/reports/:reportId`
Get specific report details

**Response:**
```json
{
  "filename": "resume.pdf",
  "uploadDate": "2025-11-18T10:30:00.000Z",
  "analysis": {...},
  "aiModel": "claude-sonnet-4-20250514"
}
```

#### GET `/api/health`
Check server status

**Response:**
```json
{
  "status": "running",
  "aiConfigured": true,
  "timestamp": "2025-11-18T10:30:00.000Z",
  "model": "claude-sonnet-4-20250514"
}
```

#### GET `/api/config-check`
Verify AI configuration

**Response:**
```json
{
  "configured": true,
  "message": "AI service is properly configured"
}
```

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks needed
- **Font Awesome 6.4** - Professional icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Anthropic SDK** - Claude AI integration
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction
- **dotenv** - Environment configuration

---

## 📁 Project Structure

```
AI-Resume-Analyzer/
├── public/
│   ├── index.html         # Professional UI
│   └── script.js          # Frontend logic
├── uploads/               # Uploaded resumes
├── reports/               # Analysis reports
├── server.js              # Express server + AI
├── package.json           # Dependencies
├── .env                   # API configuration (DO NOT COMMIT)
├── .env.example           # Template
├── .gitignore             # Git exclusions
├── install.bat            # Windows installer
├── README.md              # This file
└── SETUP.md               # Detailed setup guide
```

---

## 🔒 Security

### API Key Protection
```bash
# ✅ CORRECT: Environment variable
ANTHROPIC_API_KEY=sk-ant-api03-...

# ❌ WRONG: Hardcoded
const apiKey = "sk-ant-api03-..."
```

### Important
- `.env` file is **NEVER** committed to Git
- Already added to `.gitignore`
- Use `.env.example` as template

---

## 🐛 Troubleshooting

### "AI service not configured"

**Cause**: API key missing or invalid

**Solution**:
1. Check `.env` file exists
2. Verify API key format: `sk-ant-api03-...`
3. Restart server after editing `.env`

### "Invalid API key"

**Cause**: Wrong or expired key

**Solution**:
1. Generate new key at https://console.anthropic.com/
2. Update `.env` file
3. Restart server

### "Rate limit exceeded"

**Cause**: Too many requests

**Solution**:
- Wait 60 seconds
- Check usage in Anthropic dashboard

### PDF not parsing

**Cause**: Image-only PDF or password-protected

**Solution**:
- Ensure PDF has selectable text
- Remove password protection
- Try converting to plain text

---

## 📊 Features Comparison

| Feature | Demo Version | AI Version (Current) |
|---------|--------------|---------------------|
| Analysis | ❌ Template | ✅ Real AI |
| Unique Feedback | ❌ Same every time | ✅ Personalized |
| Content-Based | ❌ No | ✅ Yes |
| Scores | ❌ Static | ✅ Dynamic |
| Keywords | ❌ Hardcoded | ✅ Extracted |
| Useful | ❌ Demo only | ✅ Production-ready |

---

## 🚀 Roadmap

### Phase 1 (Current) ✅
- [x] Real AI integration (Claude Sonnet 4)
- [x] Dynamic analysis
- [x] Reports dashboard
- [x] Professional UI

### Phase 2 (Next)
- [ ] Multiple AI models (GPT-4, Gemini)
- [ ] Job description matching
- [ ] Industry-specific analysis
- [ ] Resume templates
- [ ] PDF report export

### Phase 3 (Future)
- [ ] User authentication
- [ ] Resume comparison
- [ ] Version tracking
- [ ] Email delivery
- [ ] Mobile app
- [ ] API for third parties

---

## 💡 Tips for Best Results

1. **Clear PDFs** - Ensure text is selectable, not image-only
2. **Complete Resume** - Include all sections for comprehensive analysis
3. **Regular Updates** - Re-analyze after changes to track improvement
4. **Follow AI Advice** - Implement suggestions and re-test
5. **Test Multiple Versions** - Compare different resume formats

---

## 📝 License

MIT License - Free for personal and commercial use

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

---

## 📧 Support

**Issues?**
1. Check console logs
2. Verify `.env` configuration
3. Test: `curl http://localhost:3001/api/health`
4. Check Anthropic status: https://status.anthropic.com/

**Questions?**
- Create an issue on GitHub
- Check SETUP.md for detailed instructions

---

## 🌟 Acknowledgments

- **Anthropic** - Claude AI technology
- **Express.js** - Web framework
- **Font Awesome** - Icons
- **PDF-Parse** - PDF text extraction
- **Community** - All contributors

---

<div align="center">

**Made with ❤️ using Claude AI**

*Helping job seekers land their dream jobs through AI-powered insights*

**[Get Started](#-quick-start)** • **[Documentation](SETUP.md)** • **[Report Issue](#-support)**

</div>
