/* ============================================
   NEW PIONEER PUBLIC SCHOOL - JAVASCRIPT
   Interactive Features & Functionality
   ============================================ */

// ============================================
// 1. DOM ELEMENTS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDropdowns();
    initializeAnimations();
    initializeForm();
    initializeStats();
    initializeLanguageSwitcher();
});

// ============================================
// 2. NAVIGATION FUNCTIONALITY
// ============================================

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });

    // Keyboard accessibility for navigation
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ============================================
// 3. DROPDOWN MENU KEYBOARD NAVIGATION
// ============================================

function initializeDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
        const trigger = item.querySelector('.nav-link-dropdown');
        const menu = item.querySelector('.dropdown-menu');

        if (trigger && menu) {
            // Keyboard navigation
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const firstLink = menu.querySelector('.dropdown-link');
                    if (firstLink) firstLink.focus();
                }
            });

            // Tab navigation within dropdown
            const links = menu.querySelectorAll('.dropdown-link');
            links.forEach((link, index) => {
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown' && index < links.length - 1) {
                        e.preventDefault();
                        links[index + 1].focus();
                    } else if (e.key === 'ArrowUp' && index > 0) {
                        e.preventDefault();
                        links[index - 1].focus();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        trigger.focus();
                    }
                });
            });
        }
    });
}

// ============================================
// 4. SCROLL ANIMATIONS
// ============================================

function initializeAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('[class*="animate"]').forEach(el => {
        observer.observe(el);
    });

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
}

// ============================================
// 5. STATISTICS COUNTER ANIMATION
// ============================================

function initializeStats() {
    const stats = document.querySelectorAll('[data-count]');

    const countUp = (element) => {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Count up when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                stats.forEach(stat => countUp(stat));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// ============================================
// 6. FORM VALIDATION & SUBMISSION
// ============================================

function initializeForm() {
    const form = document.getElementById('enquiry-form');

    if (form) {
        form.addEventListener('submit', handleFormSubmission);

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                // Clear error message on input
                const errorElement = document.getElementById(`error-${this.id}`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }
}

function validateField(event) {
    const field = event.target;
    const errorElement = document.getElementById(`error-${field.id}`);

    if (!errorElement) return;

    let error = '';

    switch (field.id) {
        case 'full-name':
            if (!field.value.trim()) {
                error = 'Full name is required';
            } else if (field.value.trim().length < 3) {
                error = 'Name must be at least 3 characters';
            } else if (!/^[a-zA-Z\s'-]+$/.test(field.value)) {
                error = 'Name can only contain letters, spaces, hyphens, and apostrophes';
            }
            break;

        case 'mobile':
            if (!field.value.trim()) {
                error = 'Mobile number is required';
            } else if (!/^\d{10}$/.test(field.value)) {
                error = 'Mobile number must be 10 digits';
            }
            break;

        case 'email':
            if (!field.value.trim()) {
                error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                error = 'Please enter a valid email address';
            }
            break;

        case 'message':
            if (!field.value.trim()) {
                error = 'Message is required';
            } else if (field.value.trim().length < 10) {
                error = 'Message must be at least 10 characters';
            }
            break;

        case 'terms':
            if (!field.checked) {
                error = 'You must agree to be contacted';
            }
            break;
    }

    errorElement.textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    return error === '';
}

function handleFormSubmission(event) {
    event.preventDefault();

    // Validate all fields
    const form = event.target;
    const fields = form.querySelectorAll('input, textarea');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });

    if (!isValid) {
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';

    // Simulate form submission (without actual backend)
    // In production, replace this with actual API call
    simulateFormSubmission(form, submitBtn, btnText, btnLoader);
}

function simulateFormSubmission(form, submitBtn, btnText, btnLoader) {
    // Simulate network delay
    setTimeout(() => {
        // Collect form data
        const formData = {
            fullName: document.getElementById('full-name').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            studentClass: document.getElementById('student-class').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        console.log('Form Data Submitted:', formData);

        // SECURITY NOTE: In production, this data should be sent to a secure backend API:
        // - Use HTTPS only
        // - Implement CSRF tokens
        // - Validate and sanitize on server
        // - Never store sensitive data in localStorage
        // - Implement rate limiting on server
        // - Add spam protection (CAPTCHA)

        // Show success message
        showFormSuccess(form, submitBtn, btnText, btnLoader);

    }, 2000); // 2 second simulated delay
}

function showFormSuccess(form, submitBtn, btnText, btnLoader) {
    const formContainer = form.parentElement;
    const successMessage = document.getElementById('success-message');

    // Hide form
    form.style.display = 'none';

    // Show success message
    successMessage.style.display = 'block';

    // Reset button state
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    const form = document.getElementById('enquiry-form');
    const successMessage = document.getElementById('success-message');

    form.style.display = 'flex';
    successMessage.style.display = 'none';
    form.reset();

    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// ============================================
// 7. LANGUAGE SWITCHER
// ============================================

function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;

            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Store preference
            localStorage.setItem('preferredLanguage', selectedLang);

            // In production, this would load translated content
            console.log('Language switched to:', selectedLang);

            // Show notification (optional)
            if (selectedLang === 'hi') {
                console.log('Hindi language support coming soon!');
            }
        });
    });

    // Restore language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    document.querySelector(`[data-lang="${savedLang}"]`)?.classList.add('active');
}

// ============================================
// 8. SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// 9. FORM INPUT SANITIZATION
// ============================================

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number (10 digits for India)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Is valid phone
 */
function isValidPhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

// ============================================
// 10. SECURITY HEADERS RECOMMENDATION
// ============================================

/*
PRODUCTION SECURITY HEADERS SHOULD INCLUDE:

1. Content-Security-Policy
   - Prevents XSS attacks
   - Restricts resource loading

2. Strict-Transport-Security
   - Forces HTTPS
   - Prevents man-in-the-middle attacks

3. X-Content-Type-Options
   - Prevents MIME sniffing
   - Set to "nosniff"

4. X-Frame-Options
   - Prevents clickjacking
   - Set to "DENY" or "SAMEORIGIN"

5. Referrer-Policy
   - Controls referrer information
   - Set to "strict-origin-when-cross-origin"

6. Permissions-Policy
   - Controls browser features
   - Restrict microphone, camera, etc.

Example headers for production:
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: microphone=(), camera=(), geolocation=()
*/

// ============================================
// 11. API INTEGRATION ARCHITECTURE
// ============================================

/**
 * API Configuration (for future backend integration)
 */
const API_CONFIG = {
    baseURL: 'https://api.newpioneerps.edu.in/v1',
    endpoints: {
        enquiry: '/enquiries',
        admission: '/admissions',
        results: '/results',
        notices: '/notices',
        downloads: '/downloads'
    },
    timeout: 5000
};

/**
 * Secure API Call Handler
 * This template shows how to integrate with a real backend
 */
async function makeSecureAPICall(endpoint, method = 'GET', data = null) {
    // SECURITY CHECKLIST:
    // 1. Always use HTTPS in production
    // 2. Never send credentials in URL
    // 3. Always validate and sanitize data before sending
    // 4. Never expose API keys in frontend code
    // 5. Implement proper CORS headers on server
    // 6. Use CSRF tokens for state-changing requests
    // 7. Implement rate limiting on server
    // 8. Log all submissions for security audit

    try {
        const url = `${API_CONFIG.baseURL}${endpoint}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                // CSRF token should be added here from HTML meta tag
                // 'X-CSRF-Token': getCsrfToken()
            },
            timeout: API_CONFIG.timeout
        };

        if (data && method !== 'GET') {
            // Sanitize data before sending
            options.body = JSON.stringify(sanitizeFormData(data));
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('API Call Failed:', error);
        throw error;
    }
}

/**
 * Sanitize form data before API submission
 */
function sanitizeFormData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

// ============================================
// 12. ACCESSIBILITY UTILITIES
// ============================================

/**
 * Announce messages to screen readers
 */
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ============================================
// 13. PERFORMANCE MONITORING
// ============================================

/**
 * Log Core Web Vitals (for monitoring site performance)
 */
if ('PerformanceObserver' in window) {
    try {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingDuration);
            }
        }).observe({ entryTypes: ['first-input'] });

    } catch (error) {
        console.log('Performance monitoring not available');
    }
}

// ============================================
// 14. ERROR HANDLING & LOGGING
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global Error:', event.error);
    // In production, send error logs to monitoring service
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    // In production, send error logs to monitoring service
});

// ============================================
// 15. UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to prevent excessive function calls
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function to limit function call frequency
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// 16. PRINT FUNCTIONALITY
// ============================================

/**
 * Generate printable admit card
 */
function printAdmitCard() {
    const admitCardContent = document.querySelector('.admit-card-demo');
    if (admitCardContent) {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(admitCardContent.innerHTML);
        printWindow.document.close();
        printWindow.print();
    }
}

// Make print function available globally
window.printAdmitCard = printAdmitCard;

// ============================================
// 17. LOCAL STORAGE MANAGEMENT
// ============================================

/**
 * Safe localStorage management
 * Never store sensitive information like passwords or tokens in localStorage
 */
const StorageManager = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage quota exceeded or disabled:', error);
        }
    },

    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from storage:', error);
        }
    },

    clear: function() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};

// ============================================
// 18. CONSOLE SECURITY WARNING
// ============================================

console.warn('%c⚠️  SECURITY WARNING', 'color: red; font-size: 18px; font-weight: bold;');
console.warn('This browser console is for authorized personnel only.');
console.warn('Do not paste or execute code from untrusted sources here.');
console.warn('Your sensitive data should never be shared through this console.');

// ============================================
// END OF JAVASCRIPT
// ============================================
