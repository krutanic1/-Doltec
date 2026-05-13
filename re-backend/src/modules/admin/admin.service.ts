import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ListingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPendingListings() {
    return this.prisma.property.findMany({
      where: { status: ListingStatus.PENDING },
      include: { poster: { select: { name: true, email: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async moderateProperty(id: string, status: ListingStatus, note: string, adminId: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        status,
        moderation: {
          set: {
            reviewedBy: adminId,
            reviewedAt: new Date(),
            rejectionReason: status === ListingStatus.REJECTED ? note : null,
            publishedAt: status === ListingStatus.APPROVED ? new Date() : null,
          }
        }
      }
    });

    // Log admin action
    await this.prisma.adminAction.create({
      data: {
        adminId,
        action: `MODERATE_PROPERTY_${status}`,
        targetId: id,
      }
    });

    return updated;
  }

  async getStats() {
    const [totalUsers, totalProperties, pendingProperties, totalLeads] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: ListingStatus.PENDING } }),
      this.prisma.lead.count(),
    ]);

    return { totalUsers, totalProperties, pendingProperties, totalLeads };
  }
}
