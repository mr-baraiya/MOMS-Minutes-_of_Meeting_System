import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token and password are required' 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 8 characters long' 
        },
        { status: 400 }
      );
    }

    // Hash the provided token to match with database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired reset token' 
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log('='.repeat(80));
    console.log('PASSWORD RESET SUCCESSFUL');
    console.log('='.repeat(80));
    console.log(`User: ${user.username} (${user.email})`);
    console.log(`Reset completed at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(80));

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while resetting your password' 
      },
      { status: 500 }
    );
  }
}
