/**
 * Gallery & Lightbox Script
 * Handles filtering and lightbox functionality
 */

(function() {
    'use strict';
    
    // Get elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.next') : null;
    
    let currentIndex = 0;
    let visibleItems = [];
    
    // Filter functionality
    function filterGallery(category) {
        visibleItems = [];
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
                visibleItems.push(item);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Open lightbox
    function openLightbox(item) {
        if (!lightbox) return;
        
        currentIndex = visibleItems.indexOf(item);
        updateLightbox(item);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update lightbox content
    function updateLightbox(item) {
        const afterImg = item.getAttribute('data-after');
        const title = item.getAttribute('data-title');
        const category = item.getAttribute('data-category');
        const description = item.getAttribute('data-description');
        
        if (lightboxImg) lightboxImg.src = afterImg || '';
        if (lightboxTitle) lightboxTitle.textContent = title || '';
        if (lightboxCategory) lightboxCategory.textContent = category ? category.replace('-', ' ') : '';
        if (lightboxDescription) lightboxDescription.textContent = description || '';
    }
    
    // Navigate to previous item
    function prevItem() {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox(visibleItems[currentIndex]);
    }
    
    // Navigate to next item
    function nextItem() {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox(visibleItems[currentIndex]);
    }
    
    // Initialize
    function init() {
        // Set initial visible items
        visibleItems = Array.from(galleryItems);
        
        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery
                const category = this.getAttribute('data-filter');
                filterGallery(category);
            });
        });
        
        // Gallery items click
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                openLightbox(this);
            });
            
            // Keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(this);
                }
            });
        });
        
        // Lightbox controls
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevItem);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextItem);
        }
        
        // Close on overlay click
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox || !lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    // In RTL, left arrow should go next
                    document.dir === 'rtl' ? nextItem() : prevItem();
                    break;
                case 'ArrowRight':
                    // In RTL, right arrow should go previous
                    document.dir === 'rtl' ? prevItem() : nextItem();
                    break;
            }
        });
        
        // Touch swipe support for mobile
        if (lightbox) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            lightbox.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            lightbox.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left
                        document.dir === 'rtl' ? prevItem() : nextItem();
                    } else {
                        // Swipe right
                        document.dir === 'rtl' ? nextItem() : prevItem();
                    }
                }
            }
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();