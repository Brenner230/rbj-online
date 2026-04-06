/* ==========================================================================
   BRENNER JONES - GLOBAL JS ENGINE
   File: assets/js/shared.js
   Description: HTML injection, routing logic, and global UI utilities.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core Plumbing
    initIncludes();
});

/* --------------------------------------------------------------------------
   1. HTML INJECTION (The Plumbing)
   Fetches header.html and footer.html and injects them into placeholders
   -------------------------------------------------------------------------- */
async function initIncludes() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    try {
        // Fetch and inject Header
        if (headerPlaceholder) {
            const headerResponse = await fetch('includes/header.html');
            if (!headerResponse.ok) throw new Error('Header not found');
            const headerHTML = await headerResponse.text();
            headerPlaceholder.innerHTML = headerHTML;
            
            // Re-initialize nav logic AFTER header is injected
            initNavigation(); 
        }

        // Fetch and inject Footer
        if (footerPlaceholder) {
            const footerResponse = await fetch('includes/footer.html');
            if (!footerResponse.ok) throw new Error('Footer not found');
            const footerHTML = await footerResponse.text();
            footerPlaceholder.innerHTML = footerHTML;
        }

        // Initialize any scroll animations now that DOM is fully built
        initScrollAnimations();

    } catch (error) {
        console.error("Error loading includes. Make sure you are running a local server (Live Server).", error);
    }
}

/* --------------------------------------------------------------------------
   2. NAVIGATION LOGIC
   Handles active states and mobile menu toggling
   -------------------------------------------------------------------------- */
function initNavigation() {
    // A. Highlight Active Link Based on Current URL
    const currentPath = window.location.pathname.split('/').pop(); // Gets 'metrics.html', etc.
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // If the href matches the URL, or if we are on index/root and href is index.html
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active'); // You will style .active in components.css
        }
    });

    // B. Mobile Menu Toggle (Anticipating your mobile nav)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open'); // Toggles visibility
            const isExpanded = mobileNav.classList.contains('is-open');
            mobileBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
}

/* --------------------------------------------------------------------------
   3. UTILITY: COPY TO CLIPBOARD
   Anticipating that you want to share code snippets with potential clients.
   -------------------------------------------------------------------------- */
function copyCodeToClipboard(textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Code copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast("Failed to copy code.", "error");
    });
}

/* --------------------------------------------------------------------------
   4. UTILITY: TOAST NOTIFICATIONS
   A sleek pop-up that appears at the bottom of the screen (no backend needed)
   -------------------------------------------------------------------------- */
function showToast(message, type = "success") {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--bg-surface);
        color: var(--text-heading);
        padding: 12px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid ${type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'};
        z-index: 9999;
    `;
    toast.innerText = message;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --------------------------------------------------------------------------
   5. SCROLL ANIMATIONS (Intersection Observer)
   Detects when an element enters the screen and triggers animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    // Find all elements you want to animate on scroll
    const animatedElements = document.querySelectorAll('.observe-me');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the CSS animation class
                entry.target.classList.add('animate-slide-up');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    animatedElements.forEach(el => observer.observe(el));
}