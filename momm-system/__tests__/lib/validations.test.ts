import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  supportTicketSchema,
} from '@/lib/validations';

// ───────────────────────────────────────────────────────────
// loginSchema
// ───────────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ username: 'admin', password: 'Secret1' });
    expect(result.success).toBe(true);
  });

  it('rejects username shorter than 3 characters', () => {
    const result = loginSchema.safeParse({ username: 'ab', password: 'Secret1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/at least 3/);
  });

  it('rejects username longer than 100 characters', () => {
    const result = loginSchema.safeParse({ username: 'a'.repeat(101), password: 'Secret1' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ username: 'admin', password: '12345' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/at least 6/);
  });

  it('rejects empty username', () => {
    const result = loginSchema.safeParse({ username: '', password: 'Secret1' });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────
// registerSchema
// ───────────────────────────────────────────────────────────
describe('registerSchema', () => {
  const validPayload = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
    role: 'STAFF',
  };

  it('accepts a fully valid payload and uppercases role', () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    expect(result.data?.role).toBe('STAFF');
  });

  it('accepts lowercase role and transforms to uppercase', () => {
    const result = registerSchema.safeParse({ ...validPayload, role: 'admin' });
    expect(result.success).toBe(true);
    expect(result.data?.role).toBe('ADMIN');
  });

  it('rejects invalid username characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, username: 'john doe' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/letters, numbers/);
  });

  it('rejects username shorter than 3 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = registerSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/email/i);
  });

  it('rejects password without uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.message.includes('uppercase'))).toBe(true);
  });

  it('rejects password without lowercase letter', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'PASSWORD1',
      confirmPassword: 'PASSWORD1',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.message.includes('lowercase'))).toBe(true);
  });

  it('rejects password without a number', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'PasswordOnly',
      confirmPassword: 'PasswordOnly',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.message.includes('number'))).toBe(true);
  });

  it('rejects mismatched confirmPassword', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/don't match/);
  });

  it('rejects an invalid role', () => {
    const result = registerSchema.safeParse({ ...validPayload, role: 'MANAGER' });
    expect(result.success).toBe(false);
  });

  it('accepts optional staffName when provided', () => {
    const result = registerSchema.safeParse({ ...validPayload, staffName: 'John Doe' });
    expect(result.success).toBe(true);
  });

  it('rejects staffName shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, staffName: 'J' });
    expect(result.success).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────
// changePasswordSchema
// ───────────────────────────────────────────────────────────
describe('changePasswordSchema', () => {
  const valid = { currentPassword: 'OldPass1', newPassword: 'NewPass1', confirmPassword: 'NewPass1' };

  it('accepts valid change-password payload', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty currentPassword', () => {
    const result = changePasswordSchema.safeParse({ ...valid, currentPassword: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/required/);
  });

  it('rejects weak new password (no uppercase)', () => {
    const result = changePasswordSchema.safeParse({ ...valid, newPassword: 'newpass1', confirmPassword: 'newpass1' });
    expect(result.success).toBe(false);
  });

  it('rejects when new password and confirm do not match', () => {
    const result = changePasswordSchema.safeParse({ ...valid, confirmPassword: 'WrongPass1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/don't match/);
  });
});

// ───────────────────────────────────────────────────────────
// forgotPasswordSchema
// ───────────────────────────────────────────────────────────
describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'notvalid' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/email/i);
  });

  it('rejects missing email', () => {
    expect(forgotPasswordSchema.safeParse({}).success).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────
// resetPasswordSchema
// ───────────────────────────────────────────────────────────
describe('resetPasswordSchema', () => {
  const valid = { token: 'abc123token', newPassword: 'NewPass1', confirmPassword: 'NewPass1' };

  it('accepts a valid reset payload', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing token', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, token: '' });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched confirmPassword', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, confirmPassword: 'OtherPass1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/don't match/);
  });
});

// ───────────────────────────────────────────────────────────
// updateProfileSchema
// ───────────────────────────────────────────────────────────
describe('updateProfileSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a partial update', () => {
    expect(updateProfileSchema.safeParse({ staffName: 'Jane Doe' }).success).toBe(true);
  });

  it('rejects invalid email in update', () => {
    const result = updateProfileSchema.safeParse({ email: 'bad-email' });
    expect(result.success).toBe(false);
  });

  it('rejects username with special characters', () => {
    const result = updateProfileSchema.safeParse({ username: 'john doe!' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid profile picture URL', () => {
    const result = updateProfileSchema.safeParse({ profilePicture: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('accepts null profilePicture', () => {
    expect(updateProfileSchema.safeParse({ profilePicture: null }).success).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────
// supportTicketSchema
// ───────────────────────────────────────────────────────────
describe('supportTicketSchema', () => {
  const valid = {
    category: 'OTHER',
    subject: 'Test subject',
    message: 'This is a test message that is long enough.',
  };

  it('accepts a valid support ticket', () => {
    expect(supportTicketSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts all valid categories', () => {
    const categories = ['MEETING_ISSUE', 'ACCESS_LOGIN', 'DOCUMENTS_MOM', 'REPORTS', 'OTHER'];
    categories.forEach(category => {
      const result = supportTicketSchema.safeParse({ ...valid, category });
      expect(result.success).toBe(true);
    });
  });

  it('rejects an invalid category', () => {
    const result = supportTicketSchema.safeParse({ ...valid, category: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('rejects subject shorter than 3 characters', () => {
    const result = supportTicketSchema.safeParse({ ...valid, subject: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects subject longer than 200 characters', () => {
    const result = supportTicketSchema.safeParse({ ...valid, subject: 's'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects message shorter than 10 characters', () => {
    const result = supportTicketSchema.safeParse({ ...valid, message: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects message longer than 2000 characters', () => {
    const result = supportTicketSchema.safeParse({ ...valid, message: 'm'.repeat(2001) });
    expect(result.success).toBe(false);
  });
});
