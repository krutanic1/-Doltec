import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * High-speed autocomplete using Atlas Search (fallback to regex)
   */
  async autocomplete(query: string) {
    if (!query || query.length < 2) return [];

    // In a real Atlas environment, use $search with 'autocomplete' operator
    // For local dev, we use regex on locality and city
    return this.prisma.property.findMany({
      where: {
        OR: [
          { location: { is: { city: { contains: query, mode: 'insensitive' } } } },
          { location: { is: { locality: { contains: query, mode: 'insensitive' } } } },
          { title: { contains: query, mode: 'insensitive' } },
        ],
        status: 'APPROVED',
      },
      select: {
        id: true,
        title: true,
        location: { select: { city: true, locality: true } },
      },
      take: 5,
    });
  }

  /**
   * Faceted search aggregation pipeline
   */
  async search(filters: any) {
    // This is where we would use the $search aggregation stage for Atlas
    // For local Prisma/Mongo, we use findMany with the logic we built in PropertyService
    // But I'll show how the Atlas Search pipeline would look:
    
    /*
    const pipeline = [
      {
        $search: {
          index: 'property_search_index',
          compound: {
            must: [
              { text: { query: filters.q, path: ['title', 'location.city', 'location.locality'] } },
              { equals: { value: filters.intent, path: 'intent' } }
            ]
          }
        }
      },
      {
        $facet: {
          results: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: 'total' }]
        }
      }
    ];
    */

    // Returning standard search for now
    return this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        // ... filters logic ...
      },
      take: 20
    });
  }
}
