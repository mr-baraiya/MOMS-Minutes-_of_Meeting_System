# API Base URL Guide

## Understanding API URLs in MOMS System

### **Server-Side vs Client-Side**

Your MOMS system uses Next.js, which has **two different contexts** for API calls:

---

## 🔵 **Server-Side (Backend Services)**

**Location:** `services/` folder (auth.service.ts, user.service.ts, etc.)

**How it works:**
- These services run on the **server only**
- They directly use **Prisma** to access the database
- **NO HTTP calls needed** - they talk directly to the database

**Example:**
```typescript
// services/user.service.ts
import prisma from "@/lib/prisma";

export class UserService {
  static async getAll() {
    return prisma.user.findMany(); // Direct database access
  }
}
```

**Key Points:**
- ✅ Direct database access via Prisma
- ✅ No API base URL needed
- ✅ Used in API routes (`app/api/` folder)
- ❌ Cannot be used in client components

---

## 🟢 **Client-Side (Frontend/Browser)**

**Location:** Client Components, Browser JavaScript

**How it works:**
- These run in the **user's browser**
- They make **HTTP requests** to your API routes
- **Must use HTTP calls** (fetch, axios, etc.)

### **API Base URLs for Client-Side:**

#### **Development (Local):**
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

#### **Production:**
```typescript
// Automatically uses your deployed domain
const API_BASE_URL = '/api';  // Relative URL
// or
const API_BASE_URL = 'https://yourdomain.com/api';
```

### **Best Practice - Use Environment Variables:**

Create a configuration file:

```typescript
// lib/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
};
```

Add to `.env.local`:
```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Production (set in your hosting platform)
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## 📊 **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser/Client                        │
│                                                              │
│  React Components                                            │
│         │                                                    │
│         │ HTTP Request (fetch/axios)                         │
│         │ URL: http://localhost:3000/api/users               │
│         ▼                                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                          │
│                                                              │
│  API Routes (app/api/users/route.ts)                        │
│         │                                                    │
│         │ Calls                                              │
│         ▼                                                    │
│  Services (services/user.service.ts)                        │
│         │                                                    │
│         │ Prisma                                             │
│         ▼                                                    │
│  Database (PostgreSQL)                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔨 **Implementation Examples**

### **1. Creating an API Client (Recommended)**

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Users
  static async getUsers(page = 1, limit = 10) {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  static async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getUserById(id: number) {
    return this.request(`/users/${id}`);
  }

  // Departments
  static async getDepartments() {
    return this.request('/departments');
  }

  // Meetings
  static async getMeetings(filters = {}) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/meetings?${params}`);
  }

  static async createMeeting(data: any) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

### **2. Using API Client in Components**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await ApiClient.getUsers(1, 10);
        setUsers(response.data.items);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
```

### **3. Direct Fetch Example (Without API Client)**

```typescript
'use client';

import { useState } from 'react';

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('User created successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🎯 **Quick Reference**

| Context | Location | URL Pattern | Example |
|---------|----------|-------------|---------|
| **Server Services** | `services/*.service.ts` | ❌ No URL (Direct DB) | `prisma.user.findMany()` |
| **API Routes** | `app/api/*/route.ts` | Internal (uses services) | `UserService.getAll()` |
| **Client Components** | React Components | ✅ `/api/*` | `fetch('/api/users')` |
| **External (Testing)** | Postman, cURL | ✅ Full URL | `http://localhost:3000/api/users` |

---

## 📝 **Summary**

### **For Services (Current Context):**
- **Purpose:** Server-side business logic
- **Database Access:** Direct via Prisma
- **No API URLs needed:** Services don't make HTTP calls
- **Usage:** Called by API routes in `app/api/` folder

### **For Client-Side Fetching:**
- **Base URL (Dev):** `http://localhost:3000/api`
- **Base URL (Prod):** `/api` (relative) or your domain
- **Use:** `fetch()`, `axios`, or custom API client

### **Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## ✅ **Best Practices**

1. ✅ **Use services for server-side logic** (direct Prisma access)
2. ✅ **Use API routes as endpoints** (call services)
3. ✅ **Use fetch/axios in client components** (call API routes)
4. ✅ **Use environment variables for base URLs**
5. ✅ **Create an API client wrapper for consistency**
6. ✅ **Handle errors properly in all layers**

---

**Last Updated:** January 2, 2026
