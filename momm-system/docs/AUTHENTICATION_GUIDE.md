# Authentication & Authorization Guide

## Overview

The MOMM system now includes complete JWT-based authentication with bcryptjs password hashing and Zod validation.

## Features Implemented

### ✅ Backend
- JWT token generation and validation
- Bcryptjs password hashing
- Zod schema validation
- HTTP-only cookie support
- Role-based access control
- Secure password requirements

### ✅ Frontend
- React Context for auth state
- Login/Register pages with Lucide icons
- Protected routes
- Automatic token refresh
- Error handling

## API Endpoints

### Authentication Routes

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "role": "staff",
  "staffName": "John Doe",
  "departmentId": 1
}
```

**Validation Rules:**
- Username: 3-50 characters, alphanumeric with dots/hyphens/underscores
- Email: Valid email format
- Password: Min 6 characters, must contain uppercase, lowercase, and number
- Role: Must be 'admin', 'convener', or 'staff'

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john.doe",
      "email": "john@example.com",
      "role": "staff",
      "staff": {
        "id": 1,
        "name": "John Doe"
      }
    }
  }
}
```

#### POST `/api/auth/login`
Authenticate and get access token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "staff": null
    }
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "staff": null
  }
}
```

#### POST `/api/auth/logout`
Clear authentication token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Frontend Usage

### Using the Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, token, loading, login, logout, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Example

```typescript
const { login } = useAuth();

const handleLogin = async (username: string, password: string) => {
  try {
    await login(username, password);
    // Automatically redirects to role-specific dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Register Example

```typescript
const { register } = useAuth();

const handleRegister = async (data: RegisterData) => {
  try {
    await register(data);
    // Automatically redirects to role-specific dashboard
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Protected Routes

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected content</div>;
}
```

## Backend Utilities

### Hash Password

```typescript
import { hashPassword } from '@/lib/auth';

const hashedPassword = await hashPassword('password123');
```

### Verify Password

```typescript
import { comparePassword } from '@/lib/auth';

const isValid = await comparePassword('password123', hashedPassword);
```

### Generate Token

```typescript
import { generateToken } from '@/lib/auth';

const token = generateToken({
  userId: 1,
  username: 'admin',
  role: 'admin',
  staffId: undefined,
});
```

### Verify Token

```typescript
import { verifyToken } from '@/lib/auth';

const payload = verifyToken(token);
if (payload) {
  console.log('User ID:', payload.userId);
  console.log('Role:', payload.role);
}
```

### Get User from Request

```typescript
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Use user.userId, user.role, etc.
}
```

### Check Role Permission

```typescript
import { hasRole } from '@/lib/auth';

if (!hasRole(user, ['admin', 'convener'])) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

## Validation Schemas

All validation is done with Zod schemas in `lib/validations.ts`:

- `loginSchema` - Login validation
- `registerSchema` - Registration validation
- `changePasswordSchema` - Password change validation
- `forgotPasswordSchema` - Forgot password validation
- `resetPasswordSchema` - Reset password validation
- `updateProfileSchema` - Profile update validation

### Example Usage

```typescript
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';

try {
  const validatedData = registerSchema.parse(body);
  // Data is valid, proceed
} catch (error) {
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: error.errors[0].message },
      { status: 400 }
    );
  }
}
```

## Security Features

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Token Security
- Stored in both localStorage and HTTP-only cookies
- 7-day expiration
- Signed with JWT_SECRET
- Includes user role for authorization

### Best Practices Implemented
✅ Passwords are hashed with bcrypt (salt rounds: 10)
✅ JWT tokens are signed and verified
✅ HTTP-only cookies prevent XSS attacks
✅ Role-based access control
✅ Input validation with Zod
✅ Secure password requirements
✅ Error messages don't reveal user existence

## Environment Variables

Required in `.env`:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-characters
```

**Important:** Change the JWT_SECRET in production!

## Testing Authentication

### Test Credentials

From the seeded database:

```
Admin:
- Username: admin
- Password: password123
- Role: admin

Convener:
- Username: rajesh.kumar
- Password: password123
- Role: convener

Staff:
- Username: amit.patel
- Password: password123
- Role: staff
```

### Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Get User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## Troubleshooting

### "Unauthorized" Error
- Check if token is present in request
- Verify token hasn't expired
- Ensure JWT_SECRET matches between token generation and validation

### "Invalid credentials" Error
- Verify username and password are correct
- Check if user account is active
- Ensure passwords were hashed correctly during seeding

### Token Not Persisting
- Check localStorage in browser DevTools
- Verify cookies are being set
- Ensure CORS settings if using different domains

### Registration Fails
- Check validation errors in response
- Ensure username/email are unique
- Verify password meets requirements
- Check department ID exists if provided

## Next Steps

1. ✅ Implement middleware for automatic route protection
2. ✅ Add refresh token mechanism
3. ✅ Implement "Remember Me" functionality
4. ✅ Add two-factor authentication (2FA)
5. ✅ Implement OAuth providers (Google, Microsoft)
6. ✅ Add rate limiting for login attempts
7. ✅ Implement password reset via email

## Migration from Old System

If you had authentication before:

1. Update all API routes to use new auth utilities
2. Replace old password hashing with bcryptjs
3. Update frontend to use AuthContext
4. Migrate existing users' passwords (rehash with bcrypt)
5. Update environment variables

---

**Security Note:** Never commit `.env` file to version control! Keep JWT_SECRET secure and rotate it regularly in production.
