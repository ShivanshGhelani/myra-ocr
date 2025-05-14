// Mobile-specific improvements for OCR app
document.addEventListener('DOMContentLoaded', function() {
    // Fix iOS height issues
    function fixIOSHeight() {
        // First we get the viewport height and multiply it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.height = `${window.innerHeight}px`;
        }
    }
    
    // Enhance navigation bar appearance on scroll
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons && window.matchMedia('(max-width: 767px)').matches) {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.addEventListener('scroll', function() {
                if (appContainer.scrollTop > 10) {
                    navButtons.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                    navButtons.style.background = 'rgba(15, 23, 42, 0.95)';
                } else {
                    navButtons.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.3)';
                    navButtons.style.background = 'rgba(15, 23, 42, 0.9)';
                }
            });
        }
    }
    
    // Run on first load and on resize
    fixIOSHeight();
    window.addEventListener('resize', fixIOSHeight);
    window.addEventListener('orientationchange', fixIOSHeight);
    
    // Fix for mobile scrolling issues
    const contentArea = document.querySelector('.content-area');
    const mainContent = document.querySelector('.main-content');
    
    if (contentArea && mainContent && window.matchMedia('(max-width: 767px)').matches) {
        // Enable touch scrolling on content area
        contentArea.style.webkitOverflowScrolling = 'touch';
        mainContent.style.webkitOverflowScrolling = 'touch';
        
        // Prevent body scrolling when touching content area
        contentArea.addEventListener('touchstart', function(e) {
            if (this.scrollHeight > this.clientHeight) {
                e.stopPropagation();
            }
        }, false);
    }

    // Force the app to take full height on iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.height = '-webkit-fill-available';
    }
      // Fix for double-tap zoom on mobile
    const allButtons = document.querySelectorAll('button, .back-button, .github-button');
    allButtons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            // Trigger the click event manually
            setTimeout(() => {
                this.click();
            }, 100);
        });
    });

    // Fix issue with the loading animation not showing on mobile
    const loading = document.getElementById('loading');
    if (loading) {
        // Ensure the loading element is properly positioned within the viewport
        loading.style.position = 'fixed';
        loading.style.inset = '0';
    }
    
    // Enhance mobile drop zone functionality
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if (dropZone && fileInput && /Mobi|Android/i.test(navigator.userAgent)) {
        // Ensure taps register correctly on mobile
        dropZone.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Short delay to prevent double triggering
            setTimeout(() => {
                fileInput.click();
            }, 10);
        });
        
        // Make text appropriate for mobile
        const dropText = dropZone.querySelector('p');
        if (dropText) {
            dropText.textContent = 'Tap to take photo or upload image';
        }
    }
    
    // Fix mobile scroll issues
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.body.addEventListener('touchmove', function(e) {
            // Allow scrolling within scrollable elements
            if (e.target.closest('.content-area, .side-menu, .result-text')) {
                e.stopPropagation();
            }
        }, { passive: false });
        
        // Prevent rubber-band effect on iOS
        document.documentElement.style.overscrollBehavior = 'none';
    }
});
