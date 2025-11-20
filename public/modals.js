// Modal System for Legal Pages

function showPrivacyModal() {
    const content = `
        <div class="modal-header">
            <h2 class="modal-title">
                <i class="fas fa-shield-alt" style="color: var(--primary);"></i>
                Privacy Policy
            </h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Last Updated:</strong> January 2025</p>
            
            <h3>1. Information We Collect</h3>
            <p>When you use ResumeAI Pro, we collect:</p>
            <ul>
                <li>Resume files you upload for analysis</li>
                <li>Analysis results and ratings you provide</li>
                <li>Technical information (browser type, device info, IP address)</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul>
                <li>Analyze your resume using AI technology</li>
                <li>Provide personalized feedback and recommendations</li>
                <li>Improve our AI models and services</li>
                <li>Maintain and improve platform security</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
                <li>Encrypted transmission of all files</li>
                <li>Secure server storage with access controls</li>
                <li>Regular security audits and updates</li>
            </ul>

            <h3>4. Data Retention</h3>
            <p>Your uploaded resumes and analysis results are automatically deleted after <strong>30 days</strong>. You can also manually delete your reports at any time from the Reports dashboard.</p>

            <h3>5. Third-Party Sharing</h3>
            <p><strong>We never sell or share your personal information with third parties.</strong> Your resume data is only used for providing analysis services through our AI partner (Groq).</p>

            <h3>6. Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
                <li>Access your data at any time</li>
                <li>Delete your reports and data</li>
                <li>Request information about how we process your data</li>
            </ul>

            <h3>7. Cookies</h3>
            <p>We use minimal cookies for session management and improving user experience. No tracking cookies are used.</p>

            <h3>8. Contact</h3>
            <p>For privacy concerns or questions, please contact us through the Contact form.</p>
        </div>
    `;
    
    showModal(content);
}

function showTermsModal() {
    const content = `
        <div class="modal-header">
            <h2 class="modal-title">
                <i class="fas fa-file-contract" style="color: var(--primary);"></i>
                Terms of Service
            </h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Last Updated:</strong> January 2025</p>
            
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using ResumeAI Pro, you accept and agree to be bound by these Terms of Service.</p>

            <h3>2. Service Description</h3>
            <p>ResumeAI Pro is an AI-powered resume analysis tool that provides automated scoring, feedback, and recommendations.</p>

            <h3>3. User Responsibilities</h3>
            <p>You agree to use the service for lawful purposes only and remove sensitive personal information before uploading.</p>

            <h3>4. Limitations of Service</h3>
            <p>Our AI analysis should be used as a guide. Recommendations may contain errors and should not replace professional career advice.</p>

            <h3>5. Disclaimer of Warranties</h3>
            <p>ResumeAI Pro is provided "as is" without warranties. We do not guarantee specific outcomes from using our recommendations.</p>

            <h3>6. Contact</h3>
            <p>For questions about these terms, please use the Contact form.</p>
        </div>
    `;
    
    showModal(content);
}

function showContactModal() {
    const content = `
        <div class="modal-header">
            <h2 class="modal-title">
                <i class="fas fa-envelope" style="color: var(--primary);"></i>
                Contact Us
            </h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <h3>Get in Touch</h3>
            <p>We'd love to hear from you!</p>

            <div style="background: var(--light); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h3 style="margin-top: 0;"><i class="fas fa-question-circle" style="color: var(--primary);"></i> Support</h3>
                <p><strong>Email:</strong> support@resumeaipro.com</p>
            </div>

            <div style="background: var(--light); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h3 style="margin-top: 0;"><i class="fas fa-comment-dots" style="color: var(--success);"></i> Feedback</h3>
                <p><strong>Email:</strong> feedback@resumeaipro.com</p>
            </div>

            <h3>Response Time</h3>
            <p>We typically respond within <strong>24-48 hours</strong> during business days.</p>
        </div>
    `;
    
    showModal(content);
}

function showModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const container = document.getElementById('modalContainer');
    
    container.innerHTML = content;
    overlay.classList.add('show');
    container.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    const container = document.getElementById('modalContainer');
    
    overlay.classList.remove('show');
    container.classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
