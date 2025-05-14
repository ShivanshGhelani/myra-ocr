FROM python:alpine

WORKDIR /app

# Install system dependencies for OpenCV and PaddleOCR
RUN apk add --no-cache \    build-base \
    python3-dev \
    openblas-dev \
    libstdc++ \
    libpng-dev \
    jpeg-dev \
    openjpeg-dev \
    tiff-dev \
    libffi-dev \
    freetype-dev \
    libxml2-dev \
    libxslt-dev \
    linux-headers \
    wget \
    ffmpeg

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directory for uploaded files
RUN mkdir -p uploads && chmod 777 uploads

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}
