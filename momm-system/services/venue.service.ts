import { prisma } from "@/lib/prisma";
import { CreateVenueRequest, UpdateVenueRequest } from "@/types";

export class VenueService {
  /**
   * Get all venues
   */
  static async getAll(includeInactive = false) {
    return prisma.venue.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { meetings: true },
        },
      },
      orderBy: { venueName: "asc" },
    });
  }

  /**
   * Get venues by type
   */
  static async getByType(venueType: "PHYSICAL" | "VIRTUAL") {
    return prisma.venue.findMany({
      where: {
        isActive: true,
        venueType,
      },
      orderBy: { venueName: "asc" },
    });
  }

  /**
   * Get venue by ID
   */
  static async getById(id: number) {
    return prisma.venue.findUnique({
      where: { id },
      include: {
        meetings: {
          take: 10,
          orderBy: { meetingDate: "desc" },
        },
        _count: {
          select: { meetings: true },
        },
      },
    });
  }

  /**
   * Create venue
   */
  static async create(data: CreateVenueRequest) {
    return prisma.venue.create({
      data: {
        venueName: data.venueName,
        venueType: data.venueType || "PHYSICAL",
        location: data.location,
      },
    });
  }

  /**
   * Update venue
   */
  static async update(id: number, data: UpdateVenueRequest) {
    return prisma.venue.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete venue (soft delete)
   */
  static async delete(id: number) {
    return prisma.venue.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
