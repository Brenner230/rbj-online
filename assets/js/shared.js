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
            initFormSimulations(); // New Form Engine
            initWizard(); // New Wizard Engine
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

/* --- THE UX FORM ENGINE --- */
function initFormSimulations() {
    const forms = document.querySelectorAll('.simulated-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const container = form.closest('.form-container');

            // 1. Loading State
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch spinner"></i> Processing...';

            // 2. Success State (Simulate 1.5s network request)
            setTimeout(() => {
                container.innerHTML = `
                    <div class="success-message">
                        <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent-success); margin-bottom: 16px;"></i>
                        <h3 style="color: var(--text-heading); margin-bottom: 8px;">Action Completed</h3>
                        <p style="color: var(--text-muted);">This form is connected to our simulated UI layer. In production, this data securely routes to your CRM or database.</p>
                        <button class="btn btn-outline mt-4" onclick="location.reload()" style="background: transparent; border: 1px solid rgba(255,255,255,0.2);">Reset Demo</button>
                    </div>
                `;
            }, 1500);
        });
    });
}

function initWizard() {
    const wizard = document.getElementById('multi-step-wizard');
    if (!wizard) return;

    let currentStep = 0;
    const panes = wizard.querySelectorAll('.wizard-pane');
    const indicators = wizard.querySelectorAll('.step-indicator');
    const nextBtn = document.getElementById('wizard-next');
    const prevBtn = document.getElementById('wizard-prev');

    function updateWizard() {
        // Handle Panes
        panes.forEach((pane, index) => {
            pane.classList.toggle('active', index === currentStep);
        });

        // Handle Indicators
        indicators.forEach((ind, index) => {
            ind.classList.remove('active', 'completed');
            if (index === currentStep) ind.classList.add('active');
            if (index < currentStep) ind.classList.add('completed');
        });

        // Handle Buttons
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        if (currentStep === panes.length - 1) {
            nextBtn.innerHTML = 'Submit Application <i class="fa-solid fa-check"></i>';
            nextBtn.classList.add('btn-success');
        } else {
            nextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
            nextBtn.classList.remove('btn-success');
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < panes.length - 1) {
            currentStep++;
            updateWizard();
        } else {
            // Trigger the simulated submit on the wrapper form
            wizard.closest('form').dispatchEvent(new Event('submit'));
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateWizard();
        }
    });

    updateWizard(); // Init first load
}