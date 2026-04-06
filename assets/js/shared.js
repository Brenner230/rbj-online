/* ==========================================================================
   BRENNER LAB - GLOBAL JS ENGINE
   ========================================================================== */

/* --- SECTION 1: INIT & ROUTER --- */
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
        
        // Boot up component engines
        setTimeout(() => {
            initScrollAnimations();
            initCounters();
            initFormSimulations(); 
            initWizard(); 
        }, 100);

    } catch (error) { console.error("Error loading includes.", error); }
}

/* --- SECTION 2: UTILITIES --- */
function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });
}

function copyCodeToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => alert("Link copied to clipboard!"));
}

/* --- SECTION 3: ANIMATIONS --- */
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

/* --- SECTION 4: DATA COUNTERS --- */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseFloat(target.getAttribute('data-target'));
                const isDecimal = target.hasAttribute('data-decimal');
                const duration = 2000; 
                const step = finalValue / (duration / 16); 
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < finalValue) {
                        target.innerText = isDecimal ? current.toFixed(1) : Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = isDecimal ? finalValue.toFixed(1) : finalValue.toLocaleString();
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

/* --- SECTION 5: FORM ENGINE --- */
function initFormSimulations() {
    const forms = document.querySelectorAll('.simulated-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const btn = form.querySelector('button[type="submit"]');
            const container = form.closest('.form-container');
            
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

/* --- SECTION 6: WIZARD ENGINE --- */
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
        panes.forEach((pane, index) => pane.classList.toggle('active', index === currentStep));

        indicators.forEach((ind, index) => {
            ind.classList.remove('active', 'completed');
            if (index === currentStep) ind.classList.add('active'); 
            if (index < currentStep) ind.classList.add('completed'); 
        });

        const percentage = (currentStep / (panes.length - 1)) * 100;
        progressLine.style.width = `calc(${percentage}% - 20px)`; 

        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        
        if (currentStep === panes.length - 1) {
            nextBtn.innerHTML = 'Complete Setup <i class="fa-solid fa-check"></i>';
            nextBtn.classList.add('btn-success');
            nextBtn.disabled = termsCheck ? !termsCheck.checked : false;
        } else {
            nextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
            nextBtn.classList.remove('btn-success');
            nextBtn.disabled = false;
        }
    }

    if(termsCheck) termsCheck.addEventListener('change', updateWizard);

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