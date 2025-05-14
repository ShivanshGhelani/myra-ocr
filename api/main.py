from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request
from core.config import configure_gpu
from .routes import router
import logging
import os

# Configure logging - set more restrictive logging
logging.basicConfig(level=logging.ERROR)  # Change from WARNING to ERROR
# Suppress specific loggers
logging.getLogger("ppocr").setLevel(logging.ERROR)
logging.getLogger("paddle").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)


# Suppress PaddleOCR's verbose output
os.environ['PADDLEOCR_SHOW_LOG'] = '0'

# Configure GPU at startup
configure_gpu()

app = FastAPI()

# Add CORS middlewaresti
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Mount static directories
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/templates", StaticFiles(directory="templates"), name="templates")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/SVG/bot.svg")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("templates/ocr.html", "r") as f:
        return HTMLResponse(content=f.read(), status_code=200)


def create_app():
    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
