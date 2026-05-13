import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, FilterPropertyDto } from './property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  async findAll(@Query() filters: FilterPropertyDto, @Query('page') page: number) {
    return this.propertyService.findAll(filters, page);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.propertyService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePropertyDto, @Request() req: any) {
    return this.propertyService.create(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.propertyService.update(id, data, req.user.sub, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.propertyService.delete(id, req.user.sub, req.user.role);
  }
}
