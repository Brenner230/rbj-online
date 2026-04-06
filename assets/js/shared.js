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
        
        // Initialize animations after DOM is built
        setTimeout(() => {
            initScrollAnimations();
            initCounters();
        }, 100);

    } catch (error) {
        console.error("Error loading includes.", error);
    }
}

function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function copyCodeToClipboard(textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Link copied to clipboard!"); // Simple alert for now
    });
}

// NUMBER TICKING LOGIC
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = finalValue / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += step;
                    if (current < finalValue) {
                        target.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = finalValue.toLocaleString();
                        // Add plus sign if it has one
                        if(target.hasAttribute('data-plus')) target.innerText += '+';
                        if(target.hasAttribute('data-percent')) target.innerText += '%';
                    }
                };
                
                updateCounter();
                observer.unobserve(target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// SCROLL ANIMATIONS
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