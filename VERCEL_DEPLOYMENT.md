# Vercel Deployment Configuration for VaraNex AI Frontend

## Prerequisites
- Vercel Account (https://vercel.com)
- GitHub account with the repository

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/varanex-ai.git
git push -u origin main
```

### 2. Connect to Vercel
- Visit https://vercel.com/import
- Select "GitHub"
- Authorize Vercel to access your repositories
- Select the "varanex-ai" repository
- Click "Import"

### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add the following variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com` *(no trailing slash)*
   - Select: Production, Preview, Development

> Make sure this matches the URL shown in Render. A wrong or missing value will cause network errors.

### 4. Deploy
- Click "Deploy"
- Your frontend will be live at `https://your-project.vercel.app`

## Environment Variables

### Production (.env.production)
```
VITE_API_URL=https://your-render-backend.onrender.com
```

### Development (.env.development)
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Build fails
- Check that Node.js version is compatible (18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and run `npm install`

### API connection issues
- Verify Render backend is running
- Check that API URL is correct in environment variables
- Ensure CORS is enabled on backend

### 404 Errors
- The `vercel.json` configuration handles SPA routing
- All routes should serve `index.html`

## Performance Optimization

- Vercel automatically optimizes images
- CSS and JS are minified
- Code splitting is enabled by default

## Monitoring

View logs and analytics in Vercel Dashboard:
1. Select your project
2. Go to "Analytics" or "Logs"
3. Check for any errors or performance issues
