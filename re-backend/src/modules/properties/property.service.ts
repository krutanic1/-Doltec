import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePropertyDto, FilterPropertyDto } from './property.dto';
import { ListingStatus } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: CreatePropertyDto, posterId: string) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    await this.cacheManager.del('home_featured_properties');
    
    return this.prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        slug,
        intent: data.intent,
        segment: data.segment,
        status: ListingStatus.DRAFT,
        posterId,
        location: {
          set: data.location
        },
        pricing: {
          set: data.pricing
        },
        features: {
          set: data.features
        },
        amenities: data.amenities || [],
        media: [],
      },
    });
  }

  async findAll(filters: FilterPropertyDto, page = 1, limit = 12) {
    const cacheKey = `search_${JSON.stringify(filters)}_${page}_${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const where: any = { status: ListingStatus.APPROVED };

    if (filters.intent) where.intent = filters.intent;
    
    if (filters.city) {
      where.location = {
        is: {
          city: { contains: filters.city, mode: 'insensitive' }
        }
      };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.pricing = { is: { amount: {} } };
      if (filters.minPrice) where.pricing.is.amount.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.pricing.is.amount.lte = Number(filters.maxPrice);
    }

    if (filters.bhk) {
      where.features = { is: { bhk: Number(filters.bhk) } };
    }

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { poster: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.property.count({ where }),
    ]);

    const result = {
      data: items,
      meta: { total, page: Number(page), lastPage: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async findOne(slug: string) {
    const cacheKey = `property_${slug}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: { poster: { select: { id: true, name: true, email: true, phone: true } } },
    });
    
    if (!property) throw new NotFoundException('Property not found');
    
    await this.cacheManager.set(cacheKey, property, 600);
    return property;
  }

  async update(id: string, data: any, posterId: string, role: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    
    if (role !== 'ADMIN' && property.posterId !== posterId) {
      throw new ForbiddenException('Not allowed to edit this property');
    }

    return this.prisma.property.update({
      where: { id },
      data: {
        ...data,
        status: ListingStatus.DRAFT,
      },
    });
  }

  async delete(id: string, posterId: string, role: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');

    if (role !== 'ADMIN' && property.posterId !== posterId) {
      throw new ForbiddenException('Not allowed to delete this property');
    }

    return this.prisma.property.delete({ where: { id } });
  }
}
