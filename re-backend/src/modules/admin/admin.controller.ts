import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListingStatus } from '@prisma/client';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('pending')
  async getPending() {
    return this.adminService.getPendingListings();
  }

  @Post('moderate/:id')
  async moderate(
    @Param('id') id: string,
    @Body() body: { status: ListingStatus, note: string },
    @Request() req: any
  ) {
    return this.adminService.moderateProperty(id, body.status, body.note, req.user.sub);
  }
}
