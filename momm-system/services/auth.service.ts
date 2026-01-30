import { prisma } from "@/lib/prisma";
import { LoginRequest, LoginResponse } from "@/types";
import bcrypt from "bcryptjs";

export class AuthService {
  /**
   * Authenticate user with username and password
   */
  static async login(data: LoginRequest): Promise<LoginResponse | null> {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
      include: {
        staff: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return null;
    }

    // TODO: Generate JWT token
    const token = "placeholder-jwt-token";

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        staffId: user.staff?.id,
        staffName: user.staff?.staffName,
      },
      token,
    };
  }

  /**
   * Get current user by ID
   */
  static async getCurrentUser(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        staff: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return false;
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
      },
    });

    return true;
  }
}
