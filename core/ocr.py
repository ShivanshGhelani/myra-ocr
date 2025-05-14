from paddleocr import PaddleOCR
import cv2
import numpy as np
import logging

# Configure PaddleOCR with optimized settings and memory efficiency
ocr = PaddleOCR(
    det_model_dir="models/det/en/en_PP-OCRv3_det_infer",
    rec_model_dir="models/rec/en/en_PP-OCRv4_rec_infer",
    cls_model_dir="models/cls",
    use_angle_cls=True,      # Enable angle classification for rotated text
    lang="en",               # Set to English language
    show_log=False,          # Disable logging output
    use_gpu=False,           # CPU mode
    det_db_box_thresh=0.3,   # Lower detection threshold for better text region detection
    det_db_thresh=0.2,       # Lower detection threshold for binarization
    det_db_unclip_ratio=1.6, # Adjust unclip ratio for text boxes
    use_dilation=True,       # Enable dilation to connect broken text
    rec_batch_num=1,         # Lower batch size to reduce memory usage
    enable_mkldnn=True,      # Enable MKLDNN acceleration
    cpu_threads=4,           # Limit CPU threads
    # Memory optimization settings
    ir_optim=True,          # Enable IR graph optimization
    use_lite=False,         # Disable lite mode as it can be unstable
    enable_tensorrt=False,   # Disable TensorRT as we're using CPU
)

def preprocess_image(image):
    """
    Preprocess image for better OCR results:
    1. Convert to grayscale
    2. Apply adaptive histogram equalization for better contrast
    3. Apply careful noise reduction
    4. Optional binarization if needed
    """
    # Convert to grayscale if image is in color
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)
    
    # Denoise the image - use a conservative approach
    denoised = cv2.fastNlMeansDenoising(gray, None, h=10, templateWindowSize=7, searchWindowSize=21)
    
    # Use Otsu's thresholding if the image needs binarization
    # Calculate histogram to decide if binarization is needed
    hist = cv2.calcHist([denoised], [0], None, [256], [0,256])
    if np.std(hist) > 50:  # Only binarize if there's good contrast
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return binary
    
    return denoised

def extract_text_paddleocr(image):
    """
    Extract text from image using PaddleOCR with confidence filtering
    and result cleanup.
    """
    result = ocr.ocr(image)
    
    if not result or not result[0]:
        return ""
    
    # Filter results by confidence and clean text
    extracted_text = []
    for line in result[0]:
        if line[1][1] > 0.65:  # Filter by confidence score
            text = line[1][0].strip()
            if text:  # Only add non-empty strings
                extracted_text.append(text)
    
    return " ".join(extracted_text)
