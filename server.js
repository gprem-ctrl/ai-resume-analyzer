require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Initialize Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create necessary directories
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const REPORTS_DIR = path.join(__dirname, 'reports');
const RATINGS_FILE = path.join(__dirname, 'ratings.json');

(async () => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  
  // Initialize ratings file if it doesn't exist
  try {
    await fs.access(RATINGS_FILE);
  } catch {
    await fs.writeFile(RATINGS_FILE, JSON.stringify({ ratings: [], stats: { totalRatings: 0, averageRating: 0 } }, null, 2));
  }
})();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Extract text from PDF or TXT
async function extractText(filePath, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      return await fs.readFile(filePath, 'utf8');
    }
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

// REAL AI Analysis using Groq (FREE & FAST!)
async function analyzeResumeWithRealAI(resumeText) {
  console.log('🤖 Starting REAL AI analysis with Groq (llama-3.3-70b)...');
  
  const prompt = `You are an expert resume reviewer and career coach with 15+ years of experience. Analyze this resume and provide comprehensive, actionable feedback.

RESUME TEXT:
${resumeText}

Analyze this resume and provide your response in valid JSON format. Be specific and provide actionable feedback based on actual content.

Respond with this EXACT JSON structure (no extra text):

{
  "overallScore": <number 0-100>,
  "sections": {
    "structure": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about THIS resume's structure>"
    },
    "content": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about THIS resume's content>"
    },
    "atsCompatibility": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about THIS resume's ATS compatibility>"
    },
    "skills": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about THIS resume's skills>"
    }
  },
  "strengths": [
    "<specific strength 1 from THIS resume>",
    "<specific strength 2 from THIS resume>",
    "<specific strength 3 from THIS resume>",
    "<specific strength 4 from THIS resume>",
    "<specific strength 5 from THIS resume>"
  ],
  "improvements": [
    "<specific improvement 1 for THIS resume>",
    "<specific improvement 2 for THIS resume>",
    "<specific improvement 3 for THIS resume>",
    "<specific improvement 4 for THIS resume>",
    "<specific improvement 5 for THIS resume>"
  ],
  "keywords": {
    "present": ["<keyword1 ACTUALLY in resume>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
    "missing": ["<relevant missing keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
  },
  "recommendations": {
    "immediate": [
      "<immediate action 1 for THIS resume>",
      "<immediate action 2 for THIS resume>",
      "<immediate action 3 for THIS resume>"
    ],
    "longTerm": [
      "<long-term goal 1 based on THIS background>",
      "<long-term goal 2>",
      "<long-term goal 3>",
      "<long-term goal 4>"
    ]
  }
}

CRITICAL: Respond with ONLY the JSON object, no markdown, no extra text.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyst. You ONLY respond with valid JSON. No markdown, no explanations, ONLY JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      stream: false
    });

    console.log('✅ AI analysis completed successfully');
    
    // Extract the JSON from Groq's response
    let responseText = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw response:', responseText);
      throw new Error('Failed to parse AI response. The AI returned invalid JSON.');
    }

    return analysis;

  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    
    // If API key is missing or invalid
    if (error.message && error.message.includes('API key')) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in the .env file.');
    }
    
    // If rate limited
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few moments.');
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

// API Routes
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  console.log('\n📝 New resume analysis request received');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📄 File: ${req.file.originalname}`);
    console.log(`📊 Size: ${(req.file.size / 1024).toFixed(2)} KB`);

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      console.error('❌ GROQ_API_KEY not configured');
      return res.status(500).json({ 
        error: 'AI service not configured. Please add your GROQ_API_KEY to the .env file.',
        details: 'Get your FREE API key from https://console.groq.com/keys'
      });
    }

    // Extract text from resume
    console.log('📖 Extracting text from resume...');
    const resumeText = await extractText(filePath, mimetype);

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ 
        error: 'Resume text is too short or could not be extracted. Please check your file.' 
      });
    }

    console.log(`✅ Extracted ${resumeText.length} characters`);

    // Analyze with REAL AI
    console.log('🚀 Sending to Groq AI for SUPER FAST analysis...');
    const startTime = Date.now();
    const analysis = await analyzeResumeWithRealAI(resumeText);
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⚡ Analysis complete in ${processingTime}s! (FAST!))`);

    // Save analysis to report
    const reportData = {
      filename: req.file.originalname,
      uploadDate: new Date().toISOString(),
      analysis,
      resumeText: resumeText.substring(0, 3000),
      aiModel: 'llama-3.3-70b-versatile',
      aiProvider: 'Groq',
      processingTime: `${processingTime}s`
    };

    const reportId = `report-${Date.now()}.json`;
    const reportPath = path.join(REPORTS_DIR, reportId);
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

    console.log(`💾 Report saved: ${reportId}`);
    console.log(`⭐ Overall Score: ${analysis.overallScore}/100\n`);

    res.json({
      success: true,
      filename: req.file.originalname,
      analysis,
      reportId,
      message: 'Resume analyzed successfully with Groq AI (FREE & FAST!)',
      processingTime: `${processingTime}s`
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume', 
      details: error.message 
    });
  }
});

// Get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const files = await fs.readdir(REPORTS_DIR);
    const reports = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(REPORTS_DIR, file), 'utf8');
        const data = JSON.parse(content);
        reports.push({
          id: file,
          filename: data.filename,
          date: data.uploadDate,
          score: data.analysis.overallScore,
          aiModel: data.aiModel || 'llama-3.3-70b',
          aiProvider: data.aiProvider || 'Groq',
          processingTime: data.processingTime
        });
      }
    }

    res.json({ 
      reports: reports.sort((a, b) => new Date(b.date) - new Date(a.date)),
      total: reports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get specific report
app.get('/api/reports/:reportId', async (req, res) => {
  try {
    const reportPath = path.join(REPORTS_DIR, req.params.reportId);
    const content = await fs.readFile(reportPath, 'utf8');
    const data = JSON.parse(content);
    res.json(data);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(404).json({ error: 'Report not found' });
  }
});

// Delete a report
app.delete('/api/reports/:reportId', async (req, res) => {
  try {
    const reportPath = path.join(REPORTS_DIR, req.params.reportId);
    await fs.unlink(reportPath);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(404).json({ error: 'Report not found' });
  }
});

// Delete multiple reports
app.post('/api/reports/bulk-delete', async (req, res) => {
  try {
    const { reportIds } = req.body;
    
    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ error: 'No report IDs provided' });
    }

    const results = {
      deleted: [],
      failed: []
    };

    for (const reportId of reportIds) {
      try {
        const reportPath = path.join(REPORTS_DIR, reportId);
        await fs.unlink(reportPath);
        results.deleted.push(reportId);
      } catch (error) {
        results.failed.push({ reportId, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Deleted ${results.deleted.length} report(s)`,
      results
    });
  } catch (error) {
    console.error('Error bulk deleting reports:', error);
    res.status(500).json({ error: 'Failed to delete reports' });
  }
});

// Rating System APIs

// Submit a rating
app.post('/api/ratings', async (req, res) => {
  try {
    const { reportId, rating, timestamp } = req.body;

    if (!reportId || !rating) {
      return res.status(400).json({ error: 'Report ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Read existing ratings
    const ratingsData = JSON.parse(await fs.readFile(RATINGS_FILE, 'utf8'));

    // Add new rating
    ratingsData.ratings.push({
      reportId,
      rating,
      timestamp: timestamp || new Date().toISOString()
    });

    // Calculate new statistics
    const totalRatings = ratingsData.ratings.length;
    const sumRatings = ratingsData.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalRatings;

    ratingsData.stats = {
      totalRatings,
      averageRating
    };

    // Save updated ratings
    await fs.writeFile(RATINGS_FILE, JSON.stringify(ratingsData, null, 2));

    console.log(`⭐ New rating: ${rating} stars (Average: ${averageRating.toFixed(2)})`);

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      stats: ratingsData.stats
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get rating statistics
app.get('/api/ratings/stats', async (req, res) => {
  try {
    const ratingsData = JSON.parse(await fs.readFile(RATINGS_FILE, 'utf8'));
    res.json(ratingsData.stats);
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({ error: 'Failed to fetch rating statistics' });
  }
});

// Get all ratings (for analytics)
app.get('/api/ratings', async (req, res) => {
  try {
    const ratingsData = JSON.parse(await fs.readFile(RATINGS_FILE, 'utf8'));
    
    // Calculate distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingsData.ratings.forEach(r => {
      distribution[r.rating]++;
    });

    res.json({
      stats: ratingsData.stats,
      distribution,
      recentRatings: ratingsData.ratings.slice(-10).reverse() // Last 10 ratings
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const isConfigured = process.env.GROQ_API_KEY && 
                       process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  
  res.json({ 
    status: 'running',
    aiConfigured: isConfigured,
    timestamp: new Date().toISOString(),
    model: 'llama-3.3-70b-versatile',
    provider: 'Groq',
    cost: 'FREE!'
  });
});

// API configuration check
app.get('/api/config-check', (req, res) => {
  const isConfigured = process.env.GROQ_API_KEY && 
                       process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  
  res.json({
    configured: isConfigured,
    provider: 'Groq',
    model: 'llama-3.3-70b-versatile',
    cost: 'FREE',
    speed: 'SUPER FAST (up to 10x faster)',
    message: isConfigured 
      ? 'AI service is properly configured with Groq (FREE!)' 
      : 'Please add your GROQ_API_KEY to the .env file',
    instructions: isConfigured 
      ? null 
      : 'Get your FREE API key from https://console.groq.com/keys'
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AI Resume Analyzer Pro - GROQ EDITION (FREE & FAST!)');
  console.log('='.repeat(60));
  console.log(`\n📡 Server running on: http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${UPLOAD_DIR}`);
  console.log(`📊 Reports directory: ${REPORTS_DIR}`);
  
  const isConfigured = process.env.GROQ_API_KEY && 
                       process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  
  if (isConfigured) {
    console.log('✅ AI Service: CONFIGURED');
    console.log('🤖 AI Provider: Groq (FREE!)');
    console.log('🧠 AI Model: llama-3.3-70b-versatile');
    console.log('⚡ Speed: SUPER FAST (up to 10x faster)');
    console.log('💰 Cost: $0 (100% FREE!)');
  } else {
    console.log('❌ AI Service: NOT CONFIGURED');
    console.log('⚠️  Please add your GROQ_API_KEY to the .env file');
    console.log('🔗 Get FREE key: https://console.groq.com/keys');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
});
