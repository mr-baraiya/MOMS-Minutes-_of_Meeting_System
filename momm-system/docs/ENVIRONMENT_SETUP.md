# Environment Variables Setup Guide

## 📁 Files Overview

This project uses different environment files for different environments:

| File | Purpose | Git Tracked | Usage |
|------|---------|-------------|-------|
| `.env` | Current/default environment | ❌ No | Active configuration |
| `.env.local` | Local development | ❌ No | Development overrides |
| `.env.production` | Production environment | ❌ No | Production deployment |
| `.env.example` | Template/documentation | ✅ Yes | Reference for developers |

---

## 🚀 Quick Setup

### For Local Development:

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update with your values:**
   - Add your database credentials
   - Generate secure secrets (see below)
   - Configure optional services

3. **Start development:**
   ```bash
   npm run dev
   ```

### For Production:

1. **Copy the production template:**
   ```bash
   cp .env.production .env
   ```

2. **Update all production values:**
   - Production database URLs
   - Strong random secrets
   - Production domain URLs
   - Email service credentials

---

## 🔐 Generating Secure Secrets

### Using OpenSSL (Recommended):
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

### Using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 📝 Required Variables

### Database (Required)
```env
DATABASE_URL="postgresql://user:pass@host:port/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:port/db"
```

### API Configuration (Required)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Authentication (Required)
```env
JWT_SECRET=your-secure-random-secret
SESSION_SECRET=your-secure-random-secret
BCRYPT_SALT_ROUNDS=10
```

---

## ⚙️ Optional Variables

### Email (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourapp.com
```

### File Uploads (Optional)
```env
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

### External Services (Optional)
```env
REDIS_URL=redis://localhost:6379
STORAGE_BUCKET=your-bucket-name
```

---

## 🌍 Environment Priority

Next.js loads environment files in this order (later overrides earlier):

1. `.env` - All environments
2. `.env.production` or `.env.development` - Environment-specific
3. `.env.local` - Local overrides (highest priority)

**Note:** `.env.local` always overrides other files except `.env.*.local`

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use `.env.example` for documentation
- ✅ Add sensitive `.env*` files to `.gitignore`
- ✅ Generate strong random secrets for production
- ✅ Use different secrets for each environment
- ✅ Rotate secrets regularly
- ✅ Use environment variables in CI/CD

### ❌ DON'T:
- ❌ Commit `.env` files with real credentials
- ❌ Share `.env` files via email/chat
- ❌ Use same secrets across environments
- ❌ Hardcode secrets in source code
- ❌ Use weak or default secrets

---

## 🔑 Variable Naming Conventions

### Public Variables (Client-Side Accessible)
```env
# Must start with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Private Variables (Server-Side Only)
```env
# No prefix needed
DATABASE_URL="postgresql://..."
JWT_SECRET=secret-key
SMTP_PASSWORD=password
```

**⚠️ Important:** Only variables starting with `NEXT_PUBLIC_` are accessible in the browser!

---

## 🐳 Docker Configuration

If using Docker, pass environment variables:

```yaml
# docker-compose.yml
services:
  app:
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
```

Or use Docker secrets for sensitive data.

---

## ☁️ Deployment Platforms

### Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### Railway/Render:
Add variables through their web dashboard.

### AWS/Azure:
Use their secrets management services (AWS Secrets Manager, Azure Key Vault).

---

## ✅ Verification

Test your environment variables:

```bash
# Check if variables are loaded
npm run dev

# Or create a test script
node -e "console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL loaded' : '❌ DATABASE_URL missing')"
```

---

## 🆘 Troubleshooting

### Variables not loading?
1. Check file naming (must be `.env.local`, not `env.local`)
2. Restart dev server after changing `.env` files
3. Verify variables don't have quotes issues
4. Check for typos in variable names

### Client-side variables undefined?
- Ensure they start with `NEXT_PUBLIC_`
- Rebuild the app: `npm run build`

### Database connection fails?
- Verify DATABASE_URL format
- Check network connectivity
- Confirm credentials are correct

---

## 📚 Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

---

**Last Updated:** January 2, 2026
