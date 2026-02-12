# Vercel Blob Token Setup (Quick Fix)

## Error: Upload Failed with 500 Error

If you're seeing this error in the console:
```
Error: Vercel Blob: No token found. Either configure the `BLOB_READ_WRITE_TOKEN` 
environment variable, or pass a `token` option to your calls.
```

## Quick Fix (5 minutes)

### Step 1: Get Your Vercel Blob Token

1. **Go to Vercel Dashboard**  
   https://vercel.com/dashboard/stores

2. **Create or Select a Blob Store**
   - If you don't have one, click **"Create Database"** → Select **"Blob"**
   - Give it a name (e.g., "moms-documents")
   - Click **"Create"**

3. **Copy the Token**
   - In your Blob store, click on the **.env.local** tab
   - Copy the `BLOB_READ_WRITE_TOKEN` value
   - It looks like: `vercel_blob_rw_xxxxxxxxxxxxxxxx`

### Step 2: Add Token to Your Environment

Your `.env.local` file has already been created with a placeholder. Now update it:

1. **Open `.env.local`** in your project root:
   ```bash
   momm-system/.env.local
   ```

2. **Replace the placeholder** with your actual token:
   ```env
   # Before
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
   
   # After (use YOUR actual token)
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_ABC123XYZ456...
   ```

3. **Save the file**

### Step 3: Restart Your Dev Server

In your terminal:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Test Upload

1. Go to Admin Dashboard → Documents
2. Try uploading a PDF/DOC file
3. Should now work!

## Security Notes

- **NEVER commit `.env.local` to git** (it's already in `.gitignore`)
- **Don't share your token publicly**
- Each developer should have their own `.env.local` with their own token
- For production, set the token in Vercel Dashboard under Project Settings → Environment Variables

## Still Not Working?

### Check these:
1. Token is copied correctly (no extra spaces)
2. File is named exactly `.env.local` (not `env.local` or `.env-local`)
3. File is in the `momm-system/` directory
4. Dev server was restarted after adding token

### Get more help:
- [Full Vercel Blob Integration Guide](./VERCEL_BLOB_INTEGRATION.md)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)

---

**Need to create a token?** → https://vercel.com/dashboard/stores  
**Last Updated**: February 12, 2026
