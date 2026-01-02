import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email is required' 
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Store the reset token in the database
    // Note: You'll need to add these fields to your User model in schema.prisma
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailResult = await sendPasswordResetEmail(email, resetUrl, user.username);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      // Log but don't reveal to user for security
    }

    // Log for debugging (remove in production)
    console.log('='.repeat(80));
    console.log('PASSWORD RESET REQUEST');
    console.log('='.repeat(80));
    console.log(`User: ${user.username} (${email})`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires: ${resetTokenExpiry.toLocaleString()}`);
    console.log(`Email sent: ${emailResult.success ? 'Yes' : 'Failed'}`);
    console.log('='.repeat(80));

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
      // Only include this in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while processing your request' 
      },
      { status: 500 }
    );
  }
}
