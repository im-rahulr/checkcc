# Netlify Deployment Guide

## Environment Variables Setup

This React/Vite application is configured to work with Netlify out of the box. Currently, no environment variables are required for basic functionality.

### Database Configuration

The application uses Supabase for data storage, with credentials configured in `src/integrations/supabase/client.ts`. The public/anon key is safe to include in the frontend bundle.

### Adding Custom Environment Variables (Optional)

If you need to add environment-specific variables:

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site Settings** > **Environment Variables**
4. Click **Add a variable** for each required variable
5. Set the **Key** and **Value** (remember to prefix with `VITE_` for frontend access)
6. Click **Save**

### Build Configuration

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: 20
- SPA routing redirects
- Security headers
- Cache optimization

### Deployment Steps

1. **Push your code** to the main branch of your GitHub repository
2. **Connect your repository** to Netlify
3. **Configure environment variables** as described above
4. **Deploy** - Netlify will automatically build and deploy your application

### Troubleshooting

- Ensure all environment variables are set correctly
- Check build logs for any missing dependencies
- Verify that the build command completes successfully
- Test the deployed application to ensure all features work

### Local Development

For local development, copy `.env.example` to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.
