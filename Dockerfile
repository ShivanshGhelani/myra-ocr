FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for OpenCV and PaddleOCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libopenjp2-7-dev \
    libwebp-dev \
    libffi-dev \
    libfreetype6-dev \
    libxml2-dev \
    libxslt-dev \
    wget \
    ffmpeg \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Upgrade pip and install setuptools first
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install Python dependencies in order
RUN pip install --no-cache-dir numpy Pillow
RUN pip install --no-cache-dir paddlepaddle==2.6.2
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directory for uploaded files
RUN mkdir -p uploads && chmod 777 uploads

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}
