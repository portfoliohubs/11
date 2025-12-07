/**
 * Dark Mode Toggle Script
 * Handles theme switching with localStorage persistence
 */

(function() {
    'use strict';
    
    // Constants
    const STORAGE_KEY = 'theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    const TRANSITION_CLASS = 'transitioning';
    
    // Get elements
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Get current theme from localStorage or system preference
    function getCurrentTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        
        return THEME_LIGHT;
    }
    
    // Apply theme
    function applyTheme(theme, withTransition = true) {
        // Disable transitions temporarily to prevent flash
        if (!withTransition) {
            html.classList.add(TRANSITION_CLASS);
        }
        
        // Set theme attribute
        html.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, theme);
        
        // Update toggle button state
        if (toggle) {
            toggle.setAttribute('aria-label', 
                theme === THEME_DARK ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'
            );
        }
        
        // Re-enable transitions after a short delay
        if (!withTransition) {
            setTimeout(() => {
                html.classList.remove(TRANSITION_CLASS);
            }, 50);
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        applyTheme(newTheme, true);
    }
    
    // Initialize
    function init() {
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme, false);
        
        // Add click event listener
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches ? THEME_DARK : THEME_LIGHT, true);
                }
            });
        }
        
        // Keyboard shortcut: Ctrl/Cmd + Shift + D
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for external use
    window.themeManager = {
        toggle: toggleTheme,
        set: (theme) => applyTheme(theme, true),
        get: () => html.getAttribute('data-theme')
    };
})();