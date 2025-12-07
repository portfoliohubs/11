/**
 * PDF Generator Script
 * Uses html2pdf.js to generate professional CV
 */

(function() {
    'use strict';
    
    // Check if html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
        console.warn('html2pdf.js is not loaded. Download CV feature will not work.');
        return;
    }
    
    // Get elements
    const downloadBtn = document.getElementById('download-cv-btn');
    const cvTemplate = document.getElementById('cv-template');
    
    if (!downloadBtn || !cvTemplate) {
        return;
    }
    
    // PDF options
    const pdfOptions = {
        margin: [10, 10, 10, 10],
        filename: 'Dr-CV.pdf',
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: ['h2', 'h3']
        }
    };
    
    // Generate PDF function
    async function generatePDF() {
        try {
            // Show loading state
            downloadBtn.classList.add('loading');
            downloadBtn.disabled = true;
            
            // Clone the CV template
            const cvClone = cvTemplate.cloneNode(true);
            cvClone.style.display = 'block';
            cvClone.style.position = 'absolute';
            cvClone.style.left = '-9999px';
            cvClone.style.top = '0';
            document.body.appendChild(cvClone);
            
            // Get filename from data attribute or use default
            const fileName = downloadBtn.getAttribute('data-filename') || 'Dr-Ahmed-CV.pdf';
            pdfOptions.filename = fileName;
            
            // Generate PDF
            await html2pdf()
                .set(pdfOptions)
                .from(cvClone)
                .save();
            
            // Clean up
            document.body.removeChild(cvClone);
            
            // Show success message (optional)
            showNotification('تم تحميل السيرة الذاتية بنجاح!', 'success');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('حدث خطأ أثناء إنشاء ملف PDF', 'error');
        } finally {
            // Remove loading state
            downloadBtn.classList.remove('loading');
            downloadBtn.disabled = false;
        }
    }
    
    // Show notification (simple toast)
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: document.dir === 'rtl' ? 'auto' : '20px',
            left: document.dir === 'rtl' ? '20px' : 'auto',
            padding: '12px 24px',
            backgroundColor: type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#0077BE',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add click event listener
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        generatePDF();
    });
    
    // Keyboard shortcut: Ctrl/Cmd + P
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            generatePDF();
        }
    });
    
    // Export for external use
    window.cvGenerator = {
        generate: generatePDF,
        updateOptions: (newOptions) => {
            Object.assign(pdfOptions, newOptions);
        }
    };
})();