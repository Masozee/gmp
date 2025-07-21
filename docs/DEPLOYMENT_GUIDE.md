# 🚀 Deployment Guide for cPanel Hosting

This guide covers deploying your Next.js application with LibSQL (SQLite) to cPanel shared hosting.

## 📋 Prerequisites

- cPanel hosting account with Node.js support
- Access to cPanel File Manager or FTP
- Domain/subdomain configured

## 🔧 Option 1: Local SQLite File (Simplest)

### Step 1: Environment Configuration

Create `.env.local` on your server with:

```bash
# Database - Local SQLite file
DATABASE_URL="file:./database.sqlite"

# Authentication (CHANGE THIS!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Your domain
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 2: Build and Upload

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload these files/folders to your cPanel:**
   - `.next/` folder
   - `public/` folder
   - `package.json`
   - `.env.local`
   - `drizzle/` folder (migrations)

3. **Install dependencies on server:**
   ```bash
   npm install --production
   ```

4. **Initialize database:**
   ```bash
   npm run db:init
   ```

## 🌐 Option 2: Turso Cloud (Recommended for Production)

Turso provides a cloud-hosted SQLite database that's perfect for shared hosting.

### Step 1: Set up Turso

1. **Sign up at [turso.tech](https://turso.tech)**

2. **Install Turso CLI:**
   ```bash
   npm install -g @libsql/cli
   ```

3. **Login and create database:**
   ```bash
   turso auth login
   turso db create your-app-name
   ```

4. **Get connection details:**
   ```bash
   turso db show your-app-name
   turso db tokens create your-app-name
   ```

### Step 2: Environment Configuration

Update `.env.local` on your server:

```bash
# Database - Turso Cloud
DATABASE_URL="libsql://your-app-name-your-username.turso.io"
DATABASE_AUTH_TOKEN="your-turso-auth-token"

# Authentication (CHANGE THIS!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Your domain
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 3: Deploy

1. **Run migrations locally to Turso:**
   ```bash
   npm run db:migrate
   npm run db:init
   ```

2. **Build and upload:**
   ```bash
   npm run build
   ```

3. **Upload to cPanel and install dependencies**

## 📁 cPanel File Structure

Your cPanel public_html should look like:

```
public_html/
├── .next/                 # Built Next.js application
├── public/               # Static assets
├── package.json          # Dependencies
├── .env.local           # Environment variables
├── drizzle/             # Database migrations
└── node_modules/        # Installed packages
```

## 🔧 cPanel Configuration

### Node.js App Setup

1. **Go to cPanel → Node.js**
2. **Create new app:**
   - Node.js version: 18.x or higher
   - Application root: `public_html`
   - Application URL: your domain
   - Application startup file: `server.js`

3. **Create `server.js` in your root:**

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

## ✅ Benefits of LibSQL over better-sqlite3

### ✅ **Compatibility:**
- ✅ No native compilation required
- ✅ Works on all hosting platforms
- ✅ Pure JavaScript implementation
- ✅ Same SQLite syntax and features

### ✅ **Deployment Options:**
- ✅ Local file-based SQLite
- ✅ Cloud-hosted with Turso
- ✅ Edge deployment ready
- ✅ Serverless compatible

### ✅ **Performance:**
- ✅ Fast local operations
- ✅ Global edge network (Turso)
- ✅ Automatic backups (Turso)
- ✅ Built-in replication

## 🛠️ Troubleshooting

### Common Issues:

1. **"Module not found" errors:**
   ```bash
   npm install --production
   ```

2. **Database connection issues:**
   - Check DATABASE_URL format
   - Verify file permissions for local SQLite
   - Test Turso token for cloud setup

3. **Build failures:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

4. **Migration errors:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## 📊 Performance Tips

### For Local SQLite:
- Keep database file in writable directory
- Regular backups via cPanel
- Monitor file size

### For Turso Cloud:
- Use edge regions close to users
- Leverage built-in caching
- Monitor usage quotas

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Set secure cookie settings
- [ ] Regular database backups
- [ ] Monitor access logs
- [ ] Keep dependencies updated

## 📈 Scaling Options

1. **Start with local SQLite** for simple sites
2. **Upgrade to Turso** when you need:
   - Multiple regions
   - Automatic backups
   - Better performance
   - Team collaboration

Your application is now ready for cPanel deployment with no native compilation issues! 🎉

## File Upload Configuration

For file uploads to work correctly in production, you need to:

1. Create a persistent upload directory outside the Next.js application directory:
   ```bash
   mkdir -p /home/username/public_html/uploads/images
   mkdir -p /home/username/public_html/uploads/documents
   chmod -R 755 /home/username/public_html/uploads
   ```

2. Set the following environment variables in your cPanel or `.env` file:
   ```
   UPLOAD_DIR=/home/username/public_html/uploads
   UPLOAD_URL_BASE=https://partisipasimuda.org/uploads
   ```

3. Create a symbolic link to make uploads accessible:
   ```bash
   ln -s /home/username/public_html/uploads /home/username/public_html/partisipasimuda/public/uploads
   ```

4. Ensure proper permissions:
   ```bash
   chown -R username:username /home/username/public_html/uploads
   find /home/username/public_html/uploads -type d -exec chmod 755 {} \;
   find /home/username/public_html/uploads -type f -exec chmod 644 {} \;
   ```

## Important Notes

1. Replace `username` with your actual cPanel username
2. The upload directory must be outside the Next.js application directory to persist through deployments
3. The symbolic link ensures files are accessible through your domain
4. File permissions are critical for security:
   - Directories: 755 (drwxr-xr-x)
   - Files: 644 (-rw-r--r--)

## Troubleshooting

If uploads return 404 errors:

1. Verify the upload directory exists and has correct permissions
2. Check that the symbolic link is correctly set up
3. Ensure the environment variables are properly configured
4. Verify the web server can access the upload directory
5. Check the server error logs for any permission issues 