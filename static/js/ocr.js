document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const processButton = document.getElementById('processButton');
    const clearButton = document.getElementById('clearButton');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('resultText');
    const copyButton = document.getElementById('copyButton');
    const summarizeButton = document.getElementById('summarizeButton');
    const translateButton = document.getElementById('translateButton');
    const languageSelect = document.getElementById('languageSelect');

    // Handle drag and drop events
    const dragEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
    const touchEvents = ['touchstart', 'touchend', 'touchmove', 'touchcancel'];
    
    // Prevent default behaviors
    [...dragEvents, ...touchEvents].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drag and touch interactions
    ['dragenter', 'touchstart'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop', 'touchend', 'touchcancel'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    // Handle file drops
    dropZone.addEventListener('drop', handleDrop);
    
    // Handle file selection click
    dropZone.addEventListener('click', (e) => {
        if (!e.target.closest('#fileInput')) {
            e.preventDefault();
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target && e.target.result) {
                        imagePreview.src = e.target.result;
                        previewContainer.style.display = 'flex';
                        previewContainer.classList.add('active');
                        dropZone.classList.add('has-preview');
                        processButton.disabled = false;
                    }
                }
                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                    alert('Error reading the image file');
                }
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file');
            }
        }
    }

    // Enable/disable action buttons based on text content
    function enableActionButtons(hasText) {
        summarizeButton.disabled = !hasText;
        translateButton.disabled = !hasText;
        copyButton.style.display = hasText ? 'flex' : 'none';
    }    // Loading handler
    function showLoading(operationType) {
        loading.style.display = 'flex';
        loading.style.visibility = 'visible';
        loading.style.opacity = '0';
        loading.style.zIndex = '9999'; // Ensure it's on top
        
        // Operation-specific text
        const texts = {
            'ocr': 'Scanning Text...',
            'summarize': 'Creating Summary...',
            'translate': 'Translating Text...'
        };
        
        const processingText = loading.querySelector('.processing-text');
        
        if (processingText) {
            processingText.textContent = texts[operationType] || 'Processing...';
        }
        
        // Force a reflow to ensure transition works
        loading.offsetHeight;
        
        setTimeout(() => {
            loading.style.opacity = '1';
        }, 50);
    }

    function hideLoading() {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.visibility = 'hidden';
            loading.style.display = 'none';
        }, 300); // Match the transition time
    }

    // Process image
    processButton.addEventListener('click', async () => {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        showLoading('ocr');
        processButton.disabled = true;
        resultText.textContent = '';
        resultContainer.style.display = 'none';
        
        try {
            const response = await fetch('/ocr', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            resultContainer.style.display = 'block';
            resultContainer.style.opacity = '0';
            resultContainer.style.transform = 'translateY(10px)';
            
            resultText.textContent = data.text;
            
            setTimeout(() => {
                resultContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                resultContainer.style.opacity = '1';
                resultContainer.style.transform = 'translateY(0)';
                resultContainer.classList.add('result-highlight');
                enableActionButtons(data.text.trim().length > 0);
                updateTextStats(data.text);
                
                setTimeout(() => {
                    resultContainer.classList.remove('result-highlight');
                }, 1500);
            }, 50);
        } catch (error) {
            alert('Error processing image: ' + error.message);
            enableActionButtons(false);
        } finally {
            hideLoading();
            processButton.disabled = false;
        }
    });

    clearButton.addEventListener('click', () => {
        fileInput.value = '';
        imagePreview.src = '';
        previewContainer.classList.remove('active');
        setTimeout(() => {
            previewContainer.style.display = 'none';
        }, 300);
        dropZone.classList.remove('has-preview');
        processButton.disabled = true;
        resultContainer.style.display = 'none';
        resultText.textContent = '';
        enableActionButtons(false);
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(resultText.textContent);
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            alert('Failed to copy text to clipboard');
        }
    });

    summarizeButton.addEventListener('click', async () => {
        const text = resultText.textContent;
        if (!text.trim()) return;

        showLoading('summarize');
        summarizeButton.disabled = true;
        translateButton.disabled = true;

        try {
            const response = await fetch('https://myra-chatbot.vercel.app/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            resultText.textContent = data.summary;
            enableActionButtons(data.summary.trim().length > 0);
        } catch (error) {
            alert('Error summarizing text: ' + error.message);
        } finally {
            hideLoading();
            summarizeButton.disabled = false;
            translateButton.disabled = false;
        }
    });

    translateButton.addEventListener('click', async () => {
        const text = resultText.textContent;
        if (!text.trim()) return;

        showLoading('translate');
        translateButton.disabled = true;
        summarizeButton.disabled = true;

        try {
            const response = await fetch('https://myra-translator.vercel.app/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    dest_lang: languageSelect.value,
                    source_lang: null,
                    auto_detect: true
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            resultText.textContent = data.translated_text;
            enableActionButtons(data.translated_text.trim().length > 0);
        } catch (error) {
            alert('Error translating text: ' + error.message);
        } finally {
            hideLoading();
            translateButton.disabled = false;
            summarizeButton.disabled = false;
        }
    });

    // Add ripple effect to back button
    document.querySelector('.back-button').addEventListener('click', handleRippleEffect);
    document.querySelector('.back-button').addEventListener('touchstart', handleRippleEffect);

    function handleRippleEffect(e) {
        const button = this;
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        ripple.style.width = ripple.style.height = `${size/4}px`;
        ripple.style.left = `${clientX - rect.left - size/8}px`;
        ripple.style.top = `${clientY - rect.top - size/8}px`;
        ripple.classList.add('ripple');
        
        button.querySelectorAll('.ripple').forEach(r => r.remove());
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
            window.location.href = '/projects';
        });
        
        e.preventDefault();
    }
});

// Update text statistics
function updateTextStats(text) {
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    
    if (text && text.trim()) {
        charCount.textContent = text.length;
        wordCount.textContent = text.trim().split(/\s+/).length;
    } else {
        charCount.textContent = '0';
        wordCount.textContent = '0';
    }
}
