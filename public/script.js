// Global state
let currentFile = null;
let currentReportId = null;
let currentAnalysis = null;
let selectedReports = new Set();
let isSelectionMode = false;
let hasRated = false;

// Get API URL from config
const API_URL = window.API_CONFIG ? window.API_CONFIG.getApiUrl() : 'http://localhost:3001';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeFileUpload();
    initializeRatingSystem();
    loadReports();
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            switchTab(tabName);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (tabName === 'analyze') {
        document.getElementById('analyzeTab').classList.add('active');
    } else if (tabName === 'reports') {
        document.getElementById('reportsTab').classList.add('active');
        loadReports();
    }
}

// File Upload
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const selectedFile = document.getElementById('selectedFile');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Click to upload
    uploadZone.addEventListener('click', (e) => {
        if (e.target !== uploadZone && !uploadZone.contains(e.target)) return;
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    });

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeResume);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
        showError('Please upload a PDF or TXT file');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }

    currentFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('selectedFile').classList.add('show');
    hideError();
    showNotification('File selected successfully!', 'success');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Analyze Resume
async function analyzeResume() {
    if (!currentFile) return;

    // Show loading
    document.querySelector('.upload-card').style.display = 'none';
    document.getElementById('loading').classList.add('show');
    document.getElementById('results').classList.remove('show');

    const formData = new FormData();
    formData.append('resume', currentFile);

    try {
        const response = await fetch(`${API_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
        }

        // Store current analysis
        currentAnalysis = data.analysis;
        currentReportId = data.reportId;

        // Hide loading, show results
        document.getElementById('loading').classList.remove('show');
        displayResults(data.analysis, data.reportId);
        document.getElementById('results').classList.add('show');
        
        showNotification('Resume analyzed successfully!', 'success');

    } catch (error) {
        document.getElementById('loading').classList.remove('show');
        document.querySelector('.upload-card').style.display = 'block';
        showError(error.message);
    }
}

// Display Results
function displayResults(analysis, reportId) {
    currentAnalysis = analysis;
    currentReportId = reportId;

    // Reset rating system for new analysis
    resetRatingSystem();

    // Overall Score
    document.getElementById('overallScore').textContent = analysis.overallScore;

    // Metrics
    displayMetrics(analysis.sections);

    // Strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = analysis.strengths.map(item => `
        <div class="list-item strength">
            <i class="fas fa-check-circle"></i>
            <span>${item}</span>
        </div>
    `).join('');

    // Improvements
    const improvementsList = document.getElementById('improvementsList');
    improvementsList.innerHTML = analysis.improvements.map(item => `
        <div class="list-item improvement">
            <i class="fas fa-exclamation-circle"></i>
            <span>${item}</span>
        </div>
    `).join('');

    // Keywords
    if (analysis.keywords) {
        displayKeywords(analysis.keywords);
    }

    // Recommendations
    if (analysis.recommendations) {
        displayRecommendations(analysis.recommendations);
    }
}

function displayMetrics(sections) {
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = Object.entries(sections).map(([key, section]) => `
        <div class="metric-card">
            <div class="metric-header">
                <span class="metric-title">${formatSectionName(key)}</span>
                <span class="metric-score">${section.score}</span>
            </div>
            <p class="metric-feedback">${section.feedback}</p>
        </div>
    `).join('');
}

function displayKeywords(keywords) {
    const keywordsSection = document.getElementById('keywordsSection');
    keywordsSection.innerHTML = `
        <div class="keyword-group">
            <h4><i class="fas fa-check" style="color: var(--success);"></i> Present Keywords</h4>
            <div class="keyword-tags">
                ${keywords.present.map(kw => `<span class="keyword-tag present">${kw}</span>`).join('')}
            </div>
        </div>
        <div class="keyword-group">
            <h4><i class="fas fa-times" style="color: var(--danger);"></i> Missing Keywords</h4>
            <div class="keyword-tags">
                ${keywords.missing.map(kw => `<span class="keyword-tag missing">${kw}</span>`).join('')}
            </div>
        </div>
    `;
}

function displayRecommendations(recommendations) {
    const recommendationsSection = document.getElementById('recommendationsSection');
    recommendationsSection.innerHTML = `
        <div class="recommendation-card">
            <h4><i class="fas fa-bolt"></i> Immediate Actions</h4>
            <ul class="recommendation-list">
                ${recommendations.immediate.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        <div class="recommendation-card">
            <h4><i class="fas fa-road"></i> Long-term Goals</h4>
            <ul class="recommendation-list">
                ${recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

function formatSectionName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Reports Dashboard
async function loadReports() {
    const reportsGrid = document.getElementById('reportsGrid');
    const statsGrid = document.getElementById('statsGrid');
    
    // Show loading
    reportsGrid.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="spinner" style="margin: 0 auto 1rem;"></div>
            <p style="color: var(--gray);">Loading reports...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/api/reports`);
        const data = await response.json();

        if (data.reports && data.reports.length > 0) {
            displayStats(data.reports);
            displayReports(data.reports);
        } else {
            displayEmptyState();
        }
    } catch (error) {
        console.error('Failed to load reports:', error);
        reportsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
                <h2>Failed to Load Reports</h2>
                <p>${error.message}</p>
                <button class="btn btn-primary" style="margin-top: 2rem;" onclick="loadReports()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

function displayStats(reports) {
    const statsGrid = document.getElementById('statsGrid');
    const avgScore = Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length);
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${reports.length}</div>
            <div class="stat-label">Total Analyses</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
            <div class="stat-value">${avgScore}</div>
            <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <div class="stat-value">${Math.max(...reports.map(r => r.score))}</div>
            <div class="stat-label">Highest Score</div>
        </div>
    `;
}

function displayReports(reports) {
    const reportsGrid = document.getElementById('reportsGrid');
    

    
    // Add bulk actions toolbar
    const bulkActionsHTML = `
        <div class="bulk-actions-toolbar" id="bulkActionsToolbar">
            <div class="bulk-actions-left">
                <button class="btn btn-secondary ${isSelectionMode ? 'active' : ''}" onclick="toggleSelectionMode()" id="selectModeBtn">
                    <i class="fas fa-${isSelectionMode ? 'times' : 'check-square'}"></i> ${isSelectionMode ? 'Cancel' : 'Select Multiple'}
                </button>
                <span class="selected-count" id="selectedCount" style="display: ${isSelectionMode ? 'inline' : 'none'};">0 selected</span>
            </div>
            <div class="bulk-actions-right" id="bulkActionsButtons" style="display: ${isSelectionMode ? 'flex' : 'none'};">
                <button class="btn btn-secondary" onclick="selectAll()">
                    <i class="fas fa-check-double"></i> Select All
                </button>
                <button class="btn btn-secondary" onclick="deselectAll()">
                    <i class="fas fa-times"></i> Deselect All
                </button>
                <button class="btn btn-danger" onclick="bulkDeleteReports()">
                    <i class="fas fa-trash"></i> Delete Selected
                </button>
            </div>
        </div>
    `;
    
    reportsGrid.innerHTML = bulkActionsHTML + reports.map(report => `
        <div class="report-card ${selectedReports.has(report.id) ? 'selected' : ''}" data-report-id="${report.id}" onclick="${isSelectionMode ? `event.stopPropagation(); toggleReportSelection('${report.id}')` : `viewReport('${report.id}')`}">
            ${isSelectionMode ? `
                <div class="report-checkbox" onclick="event.stopPropagation();">
                    <input type="checkbox" ${selectedReports.has(report.id) ? 'checked' : ''} onclick="event.stopPropagation(); toggleReportSelection('${report.id}')">
                </div>
            ` : ''}
            <div class="report-info">
                <div class="report-title">${report.filename}</div>
                <div class="report-meta">
                    <i class="fas fa-calendar"></i> ${formatDate(report.date)}
                    ${report.processingTime ? `<span style="margin-left: 1rem;"><i class="fas fa-clock"></i> ${report.processingTime}</span>` : ''}
                </div>
            </div>
            <div class="report-actions">
                <div class="report-score">${report.score}</div>
                ${!isSelectionMode ? `
                    <button class="btn-icon" onclick="event.stopPropagation(); deleteReport('${report.id}')" title="Delete Report">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function displayEmptyState() {
    document.getElementById('statsGrid').innerHTML = '';
    document.getElementById('reportsGrid').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-invoice"></i>
            <h2>No Reports Yet</h2>
            <p>Upload and analyze your first resume to see reports here</p>
            <button class="btn btn-primary" style="margin-top: 2rem;" onclick="switchToAnalyze()">
                <i class="fas fa-upload"></i> Analyze Resume
            </button>
        </div>
    `;
}

function switchToAnalyze() {
    document.querySelector('[data-tab="analyze"]').click();
}

async function viewReport(reportId) {
    try {
        showNotification('Loading report...', 'info');
        const response = await fetch(`${API_URL}/api/reports/${reportId}`);
        const data = await response.json();
        
        // Switch to analyze tab and display results
        switchTab('analyze');
        document.querySelector('.upload-card').style.display = 'none';
        displayResults(data.analysis, reportId);
        document.getElementById('results').classList.add('show');
        document.querySelector('[data-tab="analyze"]').click();
    } catch (error) {
        console.error('Failed to load report:', error);
        showError('Failed to load report');
    }
}

// Delete Report
async function deleteReport(reportId) {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/reports/${reportId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete report');
        }

        showNotification('Report deleted successfully!', 'success');
        loadReports(); // Reload reports list
    } catch (error) {
        console.error('Failed to delete report:', error);
        showError(error.message);
    }
}

// Rating System
function initializeRatingSystem() {
    const stars = document.querySelectorAll('.star');
    const starRating = document.getElementById('starRating');
    
    if (!stars.length || !starRating) return;

    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', function() {
            if (hasRated) return;
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        // Click to rate
        star.addEventListener('click', function() {
            if (hasRated) return;
            const rating = parseInt(this.getAttribute('data-rating'));
            submitRating(rating);
        });
    });

    // Reset on mouse leave
    starRating.addEventListener('mouseleave', function() {
        if (hasRated) return;
        highlightStars(0);
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

async function submitRating(rating) {
    if (!currentReportId) {
        showError('No report available to rate');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: currentReportId,
                rating: rating,
                timestamp: new Date().toISOString()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit rating');
        }

        // Mark as rated
        hasRated = true;

        // Highlight selected stars permanently
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.remove('active');
            if (index < rating) {
                star.classList.add('selected');
            }
            star.style.cursor = 'default';
        });

        // Show thank you message
        document.getElementById('ratingSubmitted').classList.add('show');

        // Show updated stats
        updateRatingStats(data.stats);

        showNotification(`Thank you for rating ${rating} stars!`, 'success');

    } catch (error) {
        console.error('Failed to submit rating:', error);
        showError(error.message);
    }
}

function updateRatingStats(stats) {
    if (!stats) return;
    
    const avgRating = document.getElementById('avgRating');
    const totalRatings = document.getElementById('totalRatings');
    const ratingStats = document.getElementById('ratingStats');

    if (avgRating && totalRatings && ratingStats) {
        avgRating.textContent = stats.averageRating.toFixed(1);
        totalRatings.textContent = stats.totalRatings;
        ratingStats.style.display = 'flex';
    }
}

function resetRatingSystem() {
    hasRated = false;
    
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('active', 'selected');
        star.style.cursor = 'pointer';
    });

    const ratingSubmitted = document.getElementById('ratingSubmitted');
    if (ratingSubmitted) {
        ratingSubmitted.classList.remove('show');
    }

    const ratingStats = document.getElementById('ratingStats');
    if (ratingStats) {
        ratingStats.style.display = 'none';
    }
}

// Export Functions
function printReport() {
    if (!currentAnalysis) {
        showError('No analysis available to print');
        return;
    }

    window.print();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Error handling
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!errorAlert || !errorMessage) return;
    
    errorMessage.textContent = message;
    errorAlert.classList.add('show');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (errorAlert.classList.contains('show')) {
            hideError();
        }
    }, 8000);
    
    showNotification(message, 'error');
}

function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.classList.remove('show');
    }
}

// Bulk Delete Functions
function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    selectedReports.clear();
    
    // Reload reports to rebuild UI with new mode
    loadReports();
}

function toggleReportSelection(reportId) {
    if (selectedReports.has(reportId)) {
        selectedReports.delete(reportId);
    } else {
        selectedReports.add(reportId);
    }
    
    updateSelectionUI();
}

function selectAll() {
    const reportCards = document.querySelectorAll('.report-card[data-report-id]');
    reportCards.forEach(card => {
        const reportId = card.getAttribute('data-report-id');
        selectedReports.add(reportId);
    });
    updateSelectionUI();
}

function deselectAll() {
    selectedReports.clear();
    updateSelectionUI();
}

function updateSelectionUI() {
    const selectedCount = document.getElementById('selectedCount');
    selectedCount.textContent = `${selectedReports.size} selected`;
    
    // Update checkboxes and card styles
    const reportCards = document.querySelectorAll('.report-card[data-report-id]');
    reportCards.forEach(card => {
        const reportId = card.getAttribute('data-report-id');
        const checkbox = card.querySelector('input[type="checkbox"]');
        
        if (selectedReports.has(reportId)) {
            card.classList.add('selected');
            if (checkbox) checkbox.checked = true;
        } else {
            card.classList.remove('selected');
            if (checkbox) checkbox.checked = false;
        }
    });
}

async function bulkDeleteReports() {
    if (selectedReports.size === 0) {
        showNotification('No reports selected', 'error');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete ${selectedReports.size} report(s)? This action cannot be undone.`;
    if (!confirm(confirmMessage)) {
        return;
    }
    
    try {
        showNotification(`Deleting ${selectedReports.size} report(s)...`, 'info');
        
        const response = await fetch(`${API_URL}/api/reports/bulk-delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportIds: Array.from(selectedReports)
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete reports');
        }
        
        showNotification(
            `Successfully deleted ${data.results.deleted.length} report(s)!`,
            'success'
        );
        
        if (data.results.failed.length > 0) {
            showNotification(
                `Failed to delete ${data.results.failed.length} report(s)`,
                'error'
            );
        }
        
        // Clear selection and reload
        selectedReports.clear();
        isSelectionMode = false;
        loadReports();
        
    } catch (error) {
        console.error('Failed to delete reports:', error);
        showError(error.message);
    }
}
