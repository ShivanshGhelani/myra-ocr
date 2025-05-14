from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from routes.ocr import router as ocr_router


router = APIRouter()
templates = Jinja2Templates(directory="templates")


router.include_router(ocr_router, tags=["ocr"])
