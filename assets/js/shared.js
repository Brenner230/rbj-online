/* ==========================================================================
   BRENNER LAB - GLOBAL JS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initIncludes();
});

async function initIncludes() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    try {
        if (headerPlaceholder) {
            const headerResponse = await fetch('includes/header.html');
            if (headerResponse.ok) {
                headerPlaceholder.innerHTML = await headerResponse.text();
                initNavigation(); 
            }
        }
        if (footerPlaceholder) {
            const footerResponse = await fetch('includes/footer.html');
            if (footerResponse.ok) {
                footerPlaceholder.innerHTML = await footerResponse.text();
            }
        }
        
        setTimeout(() => {
            initScrollAnimations();
            initCounters();
            initFormSimulations(); 
            initWizard(); 
        }, 100);

    } catch (error) { console.error("Error loading includes.", error); }
}

function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });
}

function copyCodeToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => alert("Link copied to clipboard!"));
}

function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; 
                const step = finalValue / (duration / 16); 
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < finalValue) {
                        target.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = finalValue.toLocaleString();
                        if(target.hasAttribute('data-plus')) target.innerText += '+';
                        if(target.hasAttribute('data-percent')) target.innerText += '%';
                    }
                };
                updateCounter();
                observer.unobserve(target); 
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

/* --- THE UX FORM ENGINE (DYNAMIC MESSAGING) --- */
function initFormSimulations() {
    const forms = document.querySelectorAll('.simulated-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const btn = form.querySelector('button[type="submit"]');
            const container = form.closest('.form-container');
            
            // Pull custom text from HTML attributes or use defaults
            const title = form.getAttribute('data-success-title') || "Action Completed";
            const msg = form.getAttribute('data-success-msg') || "Data routed to CRM successfully.";
            const resetBtnText = form.getAttribute('data-reset-text') || "Reset Form";

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch spinner"></i> Processing...';

            setTimeout(() => {
                container.innerHTML = `
                    <div class="success-message">
                        <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--accent-success); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--text-heading); margin-bottom: 12px; font-size: 1.8rem;">${title}</h3>
                        <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 24px auto;">${msg}</p>
                        <button class="btn btn-outline" onclick="location.reload()">
                            <i class="fa-solid fa-rotate-right"></i> ${resetBtnText}
                        </button>
                    </div>
                `;
            }, 1500);
        });
    });
}

/* --- THE WIZARD ENGINE (PROGRESS FILL & VALIDATION) --- */
function initWizard() {
    const wizard = document.getElementById('multi-step-wizard');
    if (!wizard) return;

    let currentStep = 0;
    const panes = wizard.querySelectorAll('.wizard-pane');
    const indicators = document.querySelectorAll('.step-indicator');
    const progressLine = document.querySelector('.wizard-progress-line');
    const nextBtn = document.getElementById('wizard-next');
    const prevBtn = document.getElementById('wizard-prev');
    const termsCheck = document.getElementById('terms-check');

    function updateWizard() {
        // Panes
        panes.forEach((pane, index) => pane.classList.toggle('active', index === currentStep));

        // Indicators & Bubbles
        indicators.forEach((ind, index) => {
            ind.classList.remove('active', 'completed');
            if (index === currentStep) ind.classList.add('active'); // Ring
            if (index < currentStep) ind.classList.add('completed'); // Solid Blue
        });

        // The Connecting Line Math
        const percentage = (currentStep / (panes.length - 1)) * 100;
        progressLine.style.width = `calc(${percentage}% - 20px)`; // Account for padding

        // Buttons & Gates
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        
        if (currentStep === panes.length - 1) {
            // Final Step - Requires Checkbox
            nextBtn.innerHTML = 'Complete Setup <i class="fa-solid fa-check"></i>';
            nextBtn.classList.add('btn-success');
            nextBtn.disabled = !termsCheck.checked;
        } else {
            // Standard Next Step
            nextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
            nextBtn.classList.remove('btn-success');
            nextBtn.disabled = false;
        }
    }

    // Checkbox listener to enable/disable final submit
    if(termsCheck) {
        termsCheck.addEventListener('change', updateWizard);
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < panes.length - 1) {
            currentStep++;
            updateWizard();
        } else {
            wizard.closest('form').dispatchEvent(new Event('submit'));
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateWizard();
        }
    });

    updateWizard();
}