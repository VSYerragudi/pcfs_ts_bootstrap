import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction } from './schemas/audit-log.schema';

export interface CreateAuditLogDto {
  userId: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = new this.auditLogModel(createAuditLogDto);
    return auditLog.save();
  }

  async findAll(query: AuditLogQuery = {}): Promise<AuditLog[]> {
    const { userId, action, resource, resourceId, startDate, endDate, limit = 100, offset = 0 } = query;

    const filter: Record<string, unknown> = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (resourceId) filter.resourceId = resourceId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, Date>).$gte = startDate;
      if (endDate) (filter.createdAt as Record<string, Date>).$lte = endDate;
    }

    return this.auditLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByResource(resource: string, resourceId?: string, limit = 50): Promise<AuditLog[]> {
    const filter: Record<string, string> = { resource };
    if (resourceId) filter.resourceId = resourceId;

    return this.auditLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async countByAction(action: AuditAction, startDate?: Date, endDate?: Date): Promise<number> {
    const filter: Record<string, unknown> = { action };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, Date>).$gte = startDate;
      if (endDate) (filter.createdAt as Record<string, Date>).$lte = endDate;
    }

    return this.auditLogModel.countDocuments(filter).exec();
  }

  // Helper method to log actions easily
  async log(
    userId: string,
    userEmail: string,
    action: AuditAction,
    resource: string,
    options?: {
      resourceId?: string;
      details?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuditLog> {
    return this.create({
      userId,
      userEmail,
      action,
      resource,
      ...options,
    });
  }
}
