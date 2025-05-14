from fastapi import FastAPI, APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from PIL import Image
from core.ocr import extract_text_paddleocr, preprocess_image
import logging
import io
import numpy as np

# Suppress debug logs from PaddleOCR
logging.getLogger("ppocr").setLevel(logging.WARNING)

router = APIRouter()


@router.post("/ocr")
async def extract_text(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        image_data = np.array(Image.open(io.BytesIO(contents)))
        processed_image = preprocess_image(image_data)

        extracted_text = extract_text_paddleocr(processed_image)
        return {"text": extracted_text}
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Failed to process image: {str(e)}"}
        )
