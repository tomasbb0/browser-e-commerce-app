// User State
let currentUser = {
    email: null,
    name: null,
    subscription: 'free', // 'free' or 'premium'
    savedResults: [],
    quizzesTaken: 0
};

// Stripe Configuration (Replace with your actual Stripe publishable key)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_KEY_HERE';
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Google Sign-In Handler
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    currentUser.email = responsePayload.email;
    currentUser.name = responsePayload.name;
    
    // Load user data from database
    loadUserData();
    
    // Show user interface
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
    
    showSection('dashboard');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Load user data from database
async function loadUserData() {
    try {
        const response = await fetch('/.netlify/functions/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = { ...currentUser, ...data };
        }
    } catch (error) {
        console.log('Loading demo data...');
        // Demo data for testing
        currentUser.savedResults = [];
        currentUser.quizzesTaken = 0;
    }
    
    updateUI();
}

// Save user data to database
async function saveUserData() {
    try {
        await fetch('/.netlify/functions/save-user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser)
        });
    } catch (error) {
        console.log('Demo mode - data not saved');
    }
}

// Update UI based on subscription status
function updateUI() {
    const badge = document.getElementById('subscriptionBadge');
    if (currentUser.subscription === 'premium') {
        badge.textContent = '⭐ Premium';
        badge.className = 'subscription-badge badge-premium';
    } else {
        badge.textContent = 'Free';
        badge.className = 'subscription-badge badge-free';
    }

    // Update dashboard stats
    document.getElementById('quizzesTaken').textContent = currentUser.quizzesTaken || 0;
    document.getElementById('resultsSaved').textContent = currentUser.savedResults.length;
    
    // Display saved results
    displaySavedResults();
}

// Display saved results in dashboard
function displaySavedResults() {
    const container = document.getElementById('savedResultsList');
    
    if (currentUser.savedResults.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">No saved results yet. Take a quiz and upgrade to Premium to save your results!</p>';
        return;
    }

    container.innerHTML = currentUser.savedResults.map((result, index) => `
        <div class="saved-result-card">
            <div class="result-info">
                <div class="result-date">${new Date(result.date).toLocaleDateString()}</div>
                <div class="result-summary">${result.summary}</div>
            </div>
            <div class="result-actions">
                <button class="btn" onclick="viewSavedResult(${index})">View</button>
            </div>
        </div>
    `).join('');
}

// View a saved result
function viewSavedResult(index) {
    const result = currentUser.savedResults[index];
    answers = result.answers;
    showResults();
}

// Section Navigation
function showSection(section) {
    // Hide all sections
    document.getElementById('dashboardSection').classList.remove('active');
    document.getElementById('pricingSection').classList.remove('active');
    document.getElementById('quizSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');

    // Show selected section
    if (section === 'dashboard') {
        document.getElementById('dashboardSection').classList.add('active');
        updateUI();
    } else if (section === 'pricing') {
        document.getElementById('pricingSection').classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
}

// Upgrade to Premium
async function upgradeToPremium() {
    try {
        const response = await fetch('/.netlify/functions/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: currentUser.email,
                priceId: 'price_YOUR_STRIPE_PRICE_ID'
            })
        });

        if (response.ok) {
            const { sessionId } = await response.json();
            await stripe.redirectToCheckout({ sessionId });
        } else {
            // Demo mode
            alert('Demo Mode: In production, this would redirect to Stripe checkout.\n\nFor now, upgrading your account to Premium...');
            currentUser.subscription = 'premium';
            updateUI();
            saveUserData();
        }
    } catch (error) {
        alert('Demo Mode: Stripe integration will work when deployed with proper API keys.');
        currentUser.subscription = 'premium';
        updateUI();
    }
}

// Logout
function logout() {
    currentUser = {
        email: null,
        name: null,
        subscription: 'free',
        savedResults: [],
        quizzesTaken: 0
    };
    
    document.getElementById('userSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    
    // Reset all sections
    document.querySelectorAll('.dashboard, .pricing-section, .question-container, .results').forEach(el => {
        el.classList.remove('active');
    });
}

// Quiz Logic
const questions = [
    {
        id: 'teamSize',
        question: 'How large is your team?',
        options: [
            { value: 'solo', label: 'Just me (solo founder)' },
            { value: 'small', label: '2-10 people' },
            { value: 'medium', label: '11-50 people' },
            { value: 'large', label: '50+ people' }
        ]
    },
    {
        id: 'priority',
        question: 'What\'s your top priority?',
        options: [
            { value: 'productivity', label: 'Personal productivity & focus' },
            { value: 'collaboration', label: 'Team collaboration' },
            { value: 'privacy', label: 'Privacy & security' },
            { value: 'development', label: 'Development tools' }
        ]
    },
    {
        id: 'budget',
        question: 'What\'s your budget per team member?',
        options: [
            { value: 'free', label: 'Free only' },
            { value: 'low', label: 'Under $10/month' },
            { value: 'medium', label: '$10-30/month' },
            { value: 'flexible', label: 'Flexible - willing to pay for value' }
        ]
    },
    {
        id: 'needs',
        question: 'Which features are most important?',
        options: [
            { value: 'tabs', label: 'Tab management & organization' },
            { value: 'passwords', label: 'Password management' },
            { value: 'notes', label: 'Web clipping & note-taking' },
            { value: 'meetings', label: 'Meeting & video tools' }
        ]
    },
    {
        id: 'workflow',
        question: 'How does your team work?',
        options: [
            { value: 'async', label: 'Mostly asynchronous' },
            { value: 'sync', label: 'Real-time collaboration' },
            { value: 'hybrid', label: 'Mix of both' },
            { value: 'independent', label: 'Independently (minimal collaboration)' }
        ]
    }
];

const tools = [
    {
        name: 'Arc Browser',
        description: 'Modern browser designed for organization and productivity with built-in split view, spaces, and seamless tab management.',
        pricing: 'Free',
        bestFor: ['productivity', 'tabs', 'small', 'medium'],
        pros: ['Beautiful interface', 'Excellent tab organization', 'Built-in split view', 'Great for multitasking'],
        cons: ['Mac-only (Windows in beta)', 'Learning curve', 'Resource intensive'],
        match: 0
    },
    {
        name: '1Password',
        description: 'Industry-leading password manager with team sharing, security audits, and seamless autofill across all devices.',
        pricing: '$7.99/user/month',
        bestFor: ['passwords', 'privacy', 'all-sizes', 'medium', 'flexible'],
        pros: ['Excellent security', 'Team sharing features', 'Travel mode', 'Great support'],
        cons: ['Not free', 'Requires subscription', 'Some features overwhelming'],
        match: 0
    },
    {
        name: 'Notion Web Clipper',
        description: 'Save web pages, articles, and content directly to your Notion workspace for organized knowledge management.',
        pricing: 'Free (with Notion)',
        bestFor: ['notes', 'collaboration', 'async', 'hybrid'],
        pros: ['Seamless Notion integration', 'Organize clipped content', 'Share with team', 'Free tier available'],
        cons: ['Requires Notion', 'Limited formatting options', 'Sync delays sometimes'],
        match: 0
    },
    {
        name: 'Loom',
        description: 'Quick async video messaging tool perfect for explaining ideas, sharing updates, and reducing meetings.',
        pricing: 'Free (limited), $12.50/user/month',
        bestFor: ['meetings', 'collaboration', 'async', 'hybrid', 'small', 'medium'],
        pros: ['Fast recording', 'Easy sharing', 'Reduces meetings', 'Great for tutorials'],
        cons: ['Limited free tier', 'Large file sizes', 'Requires upload time'],
        match: 0
    },
    {
        name: 'Brave Browser',
        description: 'Privacy-focused browser with built-in ad blocking, tracking prevention, and crypto wallet integration.',
        pricing: 'Free',
        bestFor: ['privacy', 'free', 'solo', 'independent'],
        pros: ['Strong privacy features', 'Built-in ad blocker', 'Fast performance', 'Completely free'],
        cons: ['Some sites may break', 'Fewer extensions', 'Crypto focus may not appeal to all'],
        match: 0
    },
    {
        name: 'Vimium',
        description: 'Browser extension providing keyboard shortcuts for navigation, inspired by Vim, boosting browsing speed dramatically.',
        pricing: 'Free',
        bestFor: ['productivity', 'development', 'free', 'independent'],
        pros: ['Keyboard-driven browsing', 'Extremely fast', 'Free and open source', 'Minimal resource use'],
        cons: ['Steep learning curve', 'Not intuitive for beginners', 'Limited visual appeal'],
        match: 0
    },
    {
        name: 'Grammarly',
        description: 'AI-powered writing assistant that checks grammar, tone, and clarity across all your web writing.',
        pricing: 'Free (basic), $12/month (premium)',
        bestFor: ['productivity', 'collaboration', 'all-workflow', 'low', 'medium'],
        pros: ['Improves writing quality', 'Works everywhere', 'Tone suggestions', 'Easy to use'],
        cons: ['Premium needed for best features', 'Can be distracting', 'Privacy concerns for some'],
        match: 0
    },
    {
        name: 'Toby',
        description: 'Visual tab manager that organizes your tabs into collections, perfect for managing multiple projects.',
        pricing: 'Free (basic), $5/month (pro)',
        bestFor: ['tabs', 'productivity', 'free', 'low', 'all-sizes'],
        pros: ['Visual organization', 'Easy project switching', 'Affordable', 'Simple to use'],
        cons: ['Basic free version', 'Limited search', 'Occasional sync issues'],
        match: 0
    }
];

let currentQuestion = 0;
let answers = {};
let currentResults = null;

function startQuiz() {
    currentQuestion = 0;
    answers = {};
    
    document.getElementById('dashboardSection').classList.remove('active');
    document.getElementById('quizSection').classList.add('active');
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const questionsDiv = document.getElementById('questions');
    
    questionsDiv.innerHTML = `
        <div class="question">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map(opt => `
                    <div class="option ${answers[question.id] === opt.value ? 'selected' : ''}" 
                         onclick="selectOption('${question.id}', '${opt.value}')">
                        ${opt.label}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    updateProgress();
    updateButtons();
}

function selectOption(questionId, value) {
    answers[questionId] = value;
    renderQuestion();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function updateButtons() {
    document.getElementById('prevBtn').style.display = currentQuestion === 0 ? 'none' : 'block';
    document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? 'See Results' : 'Next';
    document.getElementById('nextBtn').disabled = !answers[questions[currentQuestion].id];
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function showResults() {
    document.getElementById('quizSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    calculateMatches();
    
    const recommendations = tools
        .sort((a, b) => b.match - a.match)
        .slice(0, 5);

    currentResults = recommendations;
    
    // Update quiz count
    currentUser.quizzesTaken++;
    
    // Show save prompt for free users
    if (currentUser.subscription === 'free') {
        document.getElementById('savePrompt').classList.remove('hidden');
    } else {
        document.getElementById('savePrompt').classList.add('hidden');
        // Auto-save for premium users
        saveQuizResults(recommendations);
    }

    const resultsDiv = document.getElementById('recommendations');
    resultsDiv.innerHTML = recommendations.map(tool => `
        <div class="tool-card">
            <div class="tool-header">
                <div class="tool-name">${tool.name}</div>
                <div class="match-score">${tool.match}% Match</div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-details">
                <div class="detail-item">
                    <span class="detail-label">Pricing:</span> ${tool.pricing}
                </div>
            </div>
            <div class="pros-cons">
                <div class="pros">
                    <h4>Pros</h4>
                    <ul>
                        ${tool.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons">
                    <h4>Cons</h4>
                    <ul>
                        ${tool.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate total tools recommended
    let totalTools = currentUser.savedResults.reduce((sum, r) => sum + r.toolCount, 0);
    totalTools += recommendations.length;
    document.getElementById('toolsRecommended').textContent = totalTools;
}

function saveQuizResults(recommendations) {
    const result = {
        date: new Date().toISOString(),
        answers: answers,
        recommendations: recommendations,
        summary: `${recommendations[0].name} & ${recommendations.length - 1} more`,
        toolCount: recommendations.length
    };

    currentUser.savedResults.unshift(result);
    saveUserData();
    updateUI();
}

function calculateMatches() {
    tools.forEach(tool => {
        let score = 0;
        let maxScore = 0;

        Object.entries(answers).forEach(([key, value]) => {
            maxScore += 20;
            
            if (tool.bestFor.includes(value)) {
                score += 20;
            }
            
            if (key === 'teamSize' && tool.bestFor.includes('all-sizes')) {
                score += 15;
            }
            
            if (key === 'workflow' && tool.bestFor.includes('all-workflow')) {
                score += 15;
            }
        });

        tool.match = Math.round((score / maxScore) * 100);
    });
}

function restartQuiz() {
    currentQuestion = 0;
    answers = {};
    document.getElementById('resultsSection').classList.remove('active');
    showSection('dashboard');
}

function selectPlan(plan) {
    if (plan === 'free') {
        alert('You are already on the Free plan!');
    }
}
