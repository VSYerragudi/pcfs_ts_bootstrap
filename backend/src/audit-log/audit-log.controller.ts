import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService, AuditLogQuery } from './audit-log.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@pcfs-demo/shared';
import { AuditAction } from './schemas/audit-log.schema';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('resource') resource?: string,
    @Query('resourceId') resourceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const query: AuditLogQuery = {
      userId,
      action,
      resource,
      resourceId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    };

    return this.auditLogService.findAll(query);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByUser(userId, limit ? parseInt(limit, 10) : 50);
  }

  @Get('resource/:resource')
  async findByResource(
    @Param('resource') resource: string,
    @Query('resourceId') resourceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByResource(
      resource,
      resourceId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('stats/:action')
  async getActionStats(
    @Param('action') action: AuditAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const count = await this.auditLogService.countByAction(
      action,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { action, count };
  }
}
