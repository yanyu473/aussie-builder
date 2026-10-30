// Global state
let currentLang = 'en';
let currentSlide = 0;
let autoplayInterval;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initCarousel();
    initChatbot();
    applyTranslations();
});

// Language Toggle
function initLanguageToggle() {
    const langBtn = document.getElementById('langToggle');
    langBtn.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        langBtn.textContent = currentLang === 'en' ? '中文' : 'English';
        applyTranslations();
        updateCarousel();
    });
}

// Apply translations to all elements with data-i18n
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[currentLang], key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update placeholder
    const chatInput = document.getElementById('chatInput');
    const placeholderKey = chatInput.getAttribute('data-i18n-placeholder');
    if (placeholderKey) {
        chatInput.placeholder = getNestedTranslation(translations[currentLang], placeholderKey);
    }
}

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Carousel functionality
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Create carousel cards
    updateCarousel();

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const cases = caseStudies[currentLang];

    // Clear existing content
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Create cards
    cases.forEach((caseData, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <div class="carousel-image">
                <span style="font-size: 4rem;">${caseData.emoji}</span>
            </div>
            <div class="carousel-content">
                <span class="case-industry">${caseData.industry}</span>
                <h3>${caseData.title}</h3>
                <p>${caseData.description}</p>
            </div>
        `;
        track.appendChild(card);

        // Create dot
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(index);
            startAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    // Reset to first slide
    currentSlide = 0;
    updateCarouselPosition();
}

function goToSlide(index) {
    const cases = caseStudies[currentLang];
    currentSlide = index;
    updateCarouselPosition();
}

function nextSlide() {
    const cases = caseStudies[currentLang];
    currentSlide = (currentSlide + 1) % cases.length;
    updateCarouselPosition();
}

function prevSlide() {
    const cases = caseStudies[currentLang];
    currentSlide = (currentSlide - 1 + cases.length) % cases.length;
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// Chatbot functionality
function initChatbot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatPanel = document.getElementById('chatPanel');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickButtons = document.querySelectorAll('.quick-btn');

    // Toggle chat panel
    chatToggle.addEventListener('click', () => {
        chatPanel.classList.add('open');
    });

    chatClose.addEventListener('click', () => {
        chatPanel.classList.remove('open');
    });

    // Send message
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick buttons
    quickButtons.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.textContent;
            sendMessage(message);
        });
    });
}

function sendMessage(predefinedMessage) {
    const chatInput = document.getElementById('chatInput');
    const message = predefinedMessage || chatInput.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';

    // Simulate bot response after a short delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage(response, 'bot');
    }, 800);
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // Simple keyword-based responses
    const responses = currentLang === 'en' ? {
        pricing: "We have 3 packages: Starter ($599), Professional ($1,299 - most popular), and Custom ($2,499+). Which one interests you?",
        time: "Our typical delivery time is 3-7 business days depending on the package. Starter: 5 days, Professional: 7 days, Custom: 10-14 days.",
        technical: "No technical skills needed! You just fill out a simple questionnaire about your business, and our AI handles the rest. We'll guide you through everything.",
        industries: "We specialize in restaurants, cafes, nail salons, beauty shops, hardware stores, sports equipment shops, and golf retailers. Is your business one of these?",
        contact: "You can reach us at contact@aussiebuilder.com.au or call +61 2 1234 5678. Would you like to submit a quote request?",
        default: "Thanks for your question! Our team typically responds within 1 business day. Would you like to leave your email so we can follow up with detailed information?"
    } : {
        pricing: "我们有 3 个套餐：基础版（$599）、专业版（$1,299 - 最受欢迎）和定制版（$2,499起）。您对哪个感兴趣？",
        time: "根据套餐不同，交付时间为 3-7 个工作日。基础版：5天，专业版：7天，定制版：10-14天。",
        technical: "完全不需要！您只需填写一份关于您生意的简单问卷，AI 会处理其余所有事情。我们会全程指导您。",
        industries: "我们专注于餐厅、咖啡馆、美甲美业、美容店、五金工具店、体育用品店和高尔夫零售商。您的生意是其中之一吗？",
        contact: "您可以通过 contact@aussiebuilder.com.au 联系我们，或拨打 +61 2 1234 5678。需要提交报价申请吗？",
        default: "感谢您的提问！我们团队通常在 1 个工作日内回复。您愿意留下邮箱以便我们跟进详细信息吗？"
    };

    // Match keywords
    if (msg.includes('price') || msg.includes('cost') || msg.includes('报价') || msg.includes('价格') || msg.includes('多少钱')) {
        return responses.pricing;
    }
    if (msg.includes('how long') || msg.includes('time') || msg.includes('多久') || msg.includes('时间')) {
        return responses.time;
    }
    if (msg.includes('technical') || msg.includes('skill') || msg.includes('code') || msg.includes('技术') || msg.includes('懂') || msg.includes('会')) {
        return responses.technical;
    }
    if (msg.includes('industry') || msg.includes('business') || msg.includes('行业') || msg.includes('生意')) {
        return responses.industries;
    }
    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('联系') || msg.includes('邮箱') || msg.includes('电话')) {
        return responses.contact;
    }

    return responses.default;
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
