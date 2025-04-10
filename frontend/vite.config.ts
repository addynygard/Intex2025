// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com;",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com;",
        "img-src 'self' https://ashleestreamimages.blob.core.windows.net data:;",
        "connect-src 'self' https://localhost:5000 http://localhost:8000 https://accounts.google.com https://oauth2.googleapis.com;",
        "font-src 'self' fonts.gstatic.com data:;",
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com;",
        "frame-ancestors 'none';",
        "object-src 'none';",
        "form-action 'self';",
        "base-uri 'self';"
      ].join(' ')
    }
  }
});






