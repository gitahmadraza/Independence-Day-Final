// Navigation and Section Management
class WebsiteManager {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupScrollEffects();
    }

    // Navigation Setup
    setupNavigation() {
        // Desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
                this.updateActiveNavLink(link);
            });
        });

        // Footer links
        const footerLinks = document.querySelectorAll('footer a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
            });
        });
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        mobileToggle.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
            mobileToggle.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
                mobileMenu.style.display = 'none';
                mobileToggle.classList.remove('active');
            });
        });
    }

    // Navigation Function
    navigateToSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update URL hash
            history.pushState(null, null, `#${sectionId}`);
        }

        // Update navigation active states
        this.updateAllNavLinks(sectionId);
    }

    // Update Active Navigation Links
    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateAllNavLinks(sectionId) {
        const allLinks = document.querySelectorAll('.nav-link, .mobile-link');
        allLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Form Validation Setup
    setupFormValidation() {
        const form = document.getElementById('greetingForm');
        const successMessage = document.getElementById('successMessage');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.submitForm(form, successMessage);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    // Form Validation Methods
    validateForm(form) {
        let isValid = true;
        const formData = new FormData(form);
        
        // Required fields validation
        const requiredFields = ['senderName', 'senderEmail', 'recipientEmail', 'greetingMessage'];
        
        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const value = formData.get(fieldName);
            
            if (!value || value.trim() === '') {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (fieldName.includes('Email') && !this.isValidEmail(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (fieldName === 'senderName' && value.trim().length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters');
                isValid = false;
            } else if (fieldName === 'greetingMessage' && value.trim().length < 10) {
                this.showFieldError(field, 'Message must be at least 10 characters');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        if (fieldName.includes('Email') && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        if (fieldName === 'senderName' && value.length < 2) {
            this.showFieldError(field, 'Name must be at least 2 characters');
            return false;
        }

        if (fieldName === 'greetingMessage' && value.length < 10) {
            this.showFieldError(field, 'Message must be at least 10 characters');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            field.style.borderColor = '#ff6b6b';
        }
    }

    clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            field.style.borderColor = '';
        }
    }

    // Form Submission
    submitForm(form, successMessage) {
        const submitButton = form.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Clear any error messages
                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(error => error.textContent = '');
            }, 5000);
            
        }, 1500);
    }

    // Animation Setup
    setupAnimations() {
        // Flag animation
        const flag = document.querySelector('.pakistan-flag');
        if (flag) {
            flag.addEventListener('click', () => {
                flag.style.animation = 'none';
                setTimeout(() => {
                    flag.style.animation = 'flagPulse 3s ease-in-out infinite';
                }, 10);
            });
        }

        // Hero cards animation on scroll
        this.observeElements('.hero-card', 'slideInUp');
        this.observeElements('.place-card', 'slideInUp');
        this.observeElements('.symbol-card', 'slideInUp');
        this.observeElements('.timeline-item-full', 'slideInLeft');
    }

    // Intersection Observer for animations
    observeElements(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground && this.currentSection === 'home') {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }
}

// Utility Functions
window.navigateToSection = function(sectionId) {
    websiteManager.navigateToSection(sectionId);
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.websiteManager = new WebsiteManager();
    
    // Handle initial URL hash
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        websiteManager.navigateToSection(hash);
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'home';
        websiteManager.navigateToSection(hash);
    });
});

// Smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const scrollToTop = () => {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, Math.floor(currentScroll - (currentScroll / 8)));
        }
    };
    
    // Override window.scrollTo for smooth behavior
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(x, y) {
        if (typeof x === 'object' && x.behavior === 'smooth') {
            scrollToTop();
        } else {
            originalScrollTo.call(this, x, y);
        }
    };
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
        mobileMenu.style.display = 'none';
        mobileToggle.classList.remove('active');
    }
}, 250));

// Image loading error handling
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // This will trigger the onerror attribute in HTML if present
            console.log('Image failed to load:', this.src);
        });
    });
});

// Console message for developers
console.log(`
🇵🇰 Pakistan Independence Day Website - Version 2
Built with HTML, CSS, and Vanilla JavaScript
Features: Single Page Application, Responsive Design, Form Validation
`);