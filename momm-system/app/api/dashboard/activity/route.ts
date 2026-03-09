import { NextRequest } from 'next/server';
import { DashboardService } from '@/services';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/dashboard/activity?limit=200
 * Returns system activity feed (meetings created + documents uploaded).
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '500'),
      1000
    );

    const activities = await DashboardService.getSystemActivity(limit);
    return successResponse({ activities });
  } catch (error) {
    return handleApiError(error);
  }
}
