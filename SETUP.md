# 🚀 AI Resume Analyzer Pro - Setup Guide

## ⚡ Quick Start with REAL AI

### Step 1: Install Dependencies

```bash
cd "C:\AI Resume Analyzer"
npm install @anthropic-ai/sdk dotenv
```

### Step 2: Get Your Anthropic API Key

1. Go to **https://console.anthropic.com/**
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create Key"**
5. Copy your API key (starts with `sk-ant-api03-`)

### Step 3: Configure Your API Key

Open the `.env` file and replace with your actual key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
PORT=3001
NODE_ENV=development
```

### Step 4: Start the Server

```bash
node server.js
```

You should see:
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

### Step 5: Open Browser

Navigate to: **http://localhost:3001**

---

## 🎯 How It Works Now

### REAL AI Analysis Process:

1. **Upload Resume** → PDF text is extracted
2. **Send to Claude** → Your resume is sent to Anthropic's Claude Sonnet 4
3. **AI Analyzes** → Claude reads and analyzes your ACTUAL resume content
4. **Unique Feedback** → You get specific, personalized feedback
5. **Save Report** → Full analysis saved for future reference

### What Makes It Different:

✅ **Every analysis is UNIQUE**
✅ **Claude AI reads your ACTUAL resume**
✅ **Scores based on REAL content**
✅ **Personalized strengths identified**
✅ **Specific improvements suggested**
✅ **Keyword analysis from YOUR resume**
✅ **Actionable recommendations**

---

## 💰 API Costs

Anthropic Claude Sonnet 4:
- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

**Average resume analysis:**
- Input: ~2,000 tokens (resume text)
- Output: ~800 tokens (analysis)
- **Cost per analysis: ~$0.02** (2 cents)

**100 resumes = ~$2.00**

---

## 🔧 Troubleshooting

### "AI service not configured"

**Problem**: API key not set properly

**Solution**:
1. Check `.env` file exists
2. Verify API key is correct
3. Make sure key starts with `sk-ant-api03-`
4. Restart server after changing `.env`

### "Invalid API key"

**Problem**: API key is wrong or expired

**Solution**:
1. Go to https://console.anthropic.com/
2. Generate new API key
3. Update `.env` file
4. Restart server

### "Rate limit exceeded"

**Problem**: Too many requests too quickly

**Solution**:
- Wait a few seconds
- Claude has generous limits (shouldn't happen often)
- Check your Anthropic dashboard for limits

---

## 📊 API Check Endpoints

Test if AI is configured:

```bash
curl http://localhost:3001/api/config-check
```

Response if configured:
```json
{
  "configured": true,
  "message": "AI service is properly configured"
}
```

Response if NOT configured:
```json
{
  "configured": false,
  "message": "Please add your ANTHROPIC_API_KEY to the .env file",
  "instructions": "Get your API key from https://console.anthropic.com/"
}
```

---

## 🎓 Example Analysis Flow

### Input (Your Resume):
```
John Doe
Software Engineer

EXPERIENCE
- Developed React applications
- Improved performance by 40%
- Led team of 5 developers
...
```

### Claude's Analysis:
```json
{
  "overallScore": 82,
  "sections": {
    "structure": {
      "score": 85,
      "feedback": "Your resume has a clear structure with well-defined sections. The chronological format works well for your experience level. Consider adding a professional summary at the top to immediately capture attention."
    },
    "content": {
      "score": 78,
      "feedback": "Strong use of quantifiable achievements (40% performance improvement). You effectively use action verbs like 'Developed' and 'Led'. To improve, add more context about the scale and impact of your projects."
    },
    ...
  },
  "strengths": [
    "Excellent quantification of achievements (40% improvement metric)",
    "Clear demonstration of leadership experience managing 5 developers",
    "Strong technical skills in React and modern web technologies",
    ...
  ],
  "improvements": [
    "Add a professional summary highlighting your 5+ years of React expertise",
    "Include specific technologies used in each project (Redux, TypeScript, etc.)",
    "Quantify the impact of your team leadership (project delivery time, team productivity)",
    ...
  ]
}
```

---

## 🚨 Important Notes

### Security:
- **NEVER commit `.env` file to Git**
- `.env` is already in `.gitignore`
- Keep your API key private

### API Key Safety:
```bash
# ✅ GOOD: Environment variable
ANTHROPIC_API_KEY=sk-ant-api03-...

# ❌ BAD: Hardcoded in code
const apiKey = "sk-ant-api03-..."
```

### Testing:
- Start with a few test resumes
- Check console logs for AI responses
- Monitor Anthropic dashboard for usage

---

## 📝 Features

### Current (REAL AI):
✅ Unique analysis for each resume
✅ Claude Sonnet 4 AI model
✅ Specific, actionable feedback
✅ Content-based scoring
✅ Keyword extraction
✅ Personalized recommendations
✅ Report storage and history
✅ Professional UI
✅ Drag & drop upload

### Coming Soon:
- Multiple AI models (GPT-4, Gemini)
- Industry-specific analysis
- Job description matching
- Resume comparison
- Export to PDF
- Email reports
- User accounts

---

## 💡 Tips for Best Results

1. **Clear Text**: Ensure PDFs have selectable text (not images)
2. **Complete Resume**: Include all sections for comprehensive analysis
3. **Update Regularly**: Re-analyze after each update to track improvements
4. **Follow Suggestions**: Implement AI recommendations and re-test

---

## 📞 Support

Issues? Questions?

1. Check console logs for detailed error messages
2. Verify API key in `.env` file
3. Test with `curl http://localhost:3001/api/health`
4. Check Anthropic status: https://status.anthropic.com/

---

**Made with ❤️ using Claude AI by Anthropic**

*Real AI analysis for real career growth*
