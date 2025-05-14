# Deployment Guide for Render.com

This guide explains how to deploy the Text Scanner OCR application to Render.com.

## Prerequisites

1. A [Render.com](https://render.com/) account
2. Your project pushed to a GitHub repository

## Deployment Steps

### 1. Push Your Code to GitHub

First, push your code to GitHub:

```bash
# Initialize a Git repository if not done already
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 2. Create a New Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click on the **New** button and select **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `text-scanner` (or your preferred name)
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### 3. Environment Variables

Add the following environment variables:
   - `PYTHON_VERSION`: `3.9.0`
   - `RENDER_ENVIRONMENT`: `production`

### 4. Advanced Settings (Optional)

Under **Advanced** settings, you can configure:
- **Auto-Deploy**: Enable to automatically deploy when you push to the repository
- **Health Check Path**: Set to `/` to ensure the application is running properly

### 5. Create Web Service

Click the **Create Web Service** button. Render will now build and deploy your application.

## Monitoring Your Deployment

- Monitor the build logs in the Render dashboard
- Once deployed, you can access your application at the provided URL
- Check the logs for any errors that might occur during runtime

## Troubleshooting

If you encounter issues during deployment:

1. Check if all dependencies are listed in `requirements.txt`
2. Ensure your application is configured to use the `$PORT` environment variable
3. Verify that your paths are correctly configured for production

## Scaling (Optional)

1. Navigate to your web service settings
2. Under **Scaling**, you can adjust:
   - **Instance Type**: Choose based on your application's needs
   - **Number of Instances**: Scale horizontally if needed

## Custom Domains (Optional)

1. Go to your web service settings
2. Click on **Custom Domain**
3. Follow the instructions to configure your domain with Render

---

For more information, refer to the [Render documentation](https://render.com/docs)
