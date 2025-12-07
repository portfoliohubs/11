/**
 * Smooth Scroll Script
 * Handles smooth scrolling for anchor links
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        offset: 80, // Header height offset
        duration: 800,
        easing: 'easeInOutCubic'
    };
    
    // Easing functions
    const easings = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
    
    // Smooth scroll function
    function smoothScrollTo(targetY, duration = config.duration) {
        const startY = window.pageYOffset;
        const difference = targetY - startY;
        const startTime = performance.now();
        const easing = easings[config.easing] || easings.easeInOutCubic;
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easing(progress);
            
            window.scrollTo(0, startY + (difference * ease));
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // Handle anchor links
    function handleAnchorClick(e) {
        const href = this.getAttribute('href');
        
        // Check if it's a hash link
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate target position
                const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - config.offset;
                
                // Smooth scroll
                smoothScrollTo(targetY);
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    location.hash = href;
                }
                
                // Focus target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const menuOverlay = document.getElementById('menu-overlay');
                const menuToggle = document.getElementById('mobile-menu-toggle');
                
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }
    }
    
    // Initialize
    function init() {
        // Select all anchor links with data-smooth-scroll attribute or hash links
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"]), a[data-smooth-scroll]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });
        
        // Handle initial hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - config.offset;
                    smoothScrollTo(targetY);
                }
            }, 100);
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for external use
    window.smoothScroll = {
        to: smoothScrollTo,
        toElement: (element, offset = config.offset) => {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                const targetY = element.getBoundingClientRect().top + window.pageYOffset - offset;
                smoothScrollTo(targetY);
            }
        }
    };
})();