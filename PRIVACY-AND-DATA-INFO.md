# Privacy & Data Management Information

## ⚠️ IMPORTANT: No User Accounts

This application **does NOT have a signup/login system**. This means:

### How It Works:
- ✅ Anyone can upload and analyze resumes
- ✅ All analysis reports are stored locally on the server
- ✅ Reports are accessible to anyone who visits the site
- ✅ No user authentication or access control
- ✅ Completely anonymous - no email, no passwords required

### Current Data Model:
```
User uploads resume → Analysis generated → Stored in /reports folder → Visible to all
```

---

## 🔒 Privacy Considerations for Production

Since there's no authentication, you need to **clearly communicate** this to users:

### Recommended Disclaimer Text:

**Add to your homepage:**
```
⚠️ Privacy Notice: This is a free, public tool. All uploaded resumes and analysis 
reports are stored on our server and may be visible to other users. Do not upload 
resumes containing sensitive personal information (SSN, passwords, etc.). For 
personal use only.
```

**Or simpler version:**
```
🔓 This is a free, open tool. Reports are not private. Don't upload sensitive info.
```

---

## 🎯 Deployment Options

### Option 1: Keep It Simple (Current Setup)
**Best for:** MVP, personal projects, small teams
- No changes needed
- Add privacy disclaimer
- Perfect for testing and demo purposes
- Fast to deploy

### Option 2: Add Basic Privacy (Medium Effort)
**Features to add:**
- Session-based storage (reports tied to browser session)
- Reports auto-delete after 24 hours
- Optional: Password protect the entire site
- ~4-8 hours development time

### Option 3: Full User System (Major Effort)
**Features to add:**
- User signup/login
- Each user sees only their reports
- Email verification
- Password reset
- User dashboard
- ~40-80 hours development time

---

## 📋 What to Display to Users

### Recommendation: Add a Banner/Notice

Add this to the top of your upload page:

```html
<div class="privacy-notice">
  <i class="fas fa-info-circle"></i>
  <strong>Note:</strong> This is a free, public tool. Uploaded resumes are analyzed 
  and stored temporarily. Please remove personal identifiers (full address, phone 
  numbers, SSN) before uploading.
</div>
```

### CSS for Notice:
```css
.privacy-notice {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
  border-left: 4px solid #f59e0b;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.privacy-notice i {
  color: #f59e0b;
  font-size: 1.25rem;
}
```

---

## 🗑️ Data Retention

### Current Setup:
- Reports stored indefinitely in `/reports` folder
- No automatic cleanup
- Manual deletion via UI or server access

### Recommended for Production:
- Auto-delete reports after 7-30 days
- Add cleanup cron job
- Or implement the "session-based" approach

---

## 🚀 Quick Fix for Production

If you want a quick improvement without building full auth:

### 1. Add Privacy Notice (5 minutes)
Add the notice banner to your upload page

### 2. Add Auto-Cleanup (15 minutes)
Add this to your server.js:

```javascript
// Auto-delete reports older than 7 days
setInterval(async () => {
  const files = await fs.readdir(REPORTS_DIR);
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  for (const file of files) {
    const filePath = path.join(REPORTS_DIR, file);
    const stats = await fs.stat(filePath);
    if (now - stats.mtime.getTime() > maxAge) {
      await fs.unlink(filePath);
      console.log(`Deleted old report: ${file}`);
    }
  }
}, 24 * 60 * 60 * 1000); // Run daily
```

### 3. Add Terms of Service Link (5 minutes)
Add to footer: "By using this tool, you agree to our Terms & Privacy Policy"

---

## 📊 Current Architecture

```
User → Upload Resume → Server (no auth)
                          ↓
                    Groq AI Analysis
                          ↓
                    Save to /reports
                          ↓
         Anyone can view in "Reports" tab
```

---

## ✅ Production Checklist

- [ ] Add privacy notice/disclaimer to UI
- [ ] Update README with privacy info
- [ ] Add auto-cleanup of old reports (optional)
- [ ] Create simple Terms & Privacy page
- [ ] Test with dummy data only
- [ ] Inform users reports are public
- [ ] Consider adding session-based storage

---

## 🎓 User Education

Make sure users understand:
1. ✅ It's FREE and FAST
2. ⚠️ It's PUBLIC (no private accounts)
3. 🗑️ Reports may be visible to others
4. 🔒 Don't upload sensitive information
5. 📝 Best for mock resumes and testing

---

## Summary

**Your app is PRODUCTION READY** as a free, public tool. Just add a clear privacy notice so users know what to expect. For most MVP use cases, this is perfectly fine!

If you need private reports in the future, we can add:
- Session-based storage (easiest)
- Or full authentication system (more complex)

**Recommendation:** Launch as-is with clear disclaimer, gather feedback, then decide if auth is needed.
