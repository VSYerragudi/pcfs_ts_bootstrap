import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuditLogService } from '@/audit-log/audit-log.service';
import { AuditAction } from '@/audit-log/schemas/audit-log.schema';
import { LoginDto } from './dto/login.dto';
import type { TokenPayload } from '@pcfs-demo/shared';
import type { StringValue } from 'ms';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly auditLogService: AuditLogService,
  ) {
    this.accessTokenExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m';
    this.refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') ?? '7d';
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default-refresh-secret-change-in-production';
  }

  async login(loginDto: LoginDto, context?: RequestContext): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      // Log failed login attempt
      await this.auditLogService.log(
        'unknown',
        loginDto.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'User not found' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      // Log failed login attempt for deactivated account
      await this.auditLogService.log(
        user.id,
        user.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'Account deactivated' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      // Log failed login attempt
      await this.auditLogService.log(
        user.id,
        user.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'Invalid password' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.roles);

    // Log successful login
    await this.auditLogService.log(
      user.id,
      user.email,
      AuditAction.LOGIN,
      'auth',
      {
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async refreshTokens(userId: string, email: string, roles: string[], oldRefreshToken: string): Promise<TokenPair> {
    // Blacklist the old refresh token
    const decoded = this.jwtService.decode(oldRefreshToken) as { exp?: number } | null;
    if (decoded?.exp) {
      this.tokenBlacklistService.add(oldRefreshToken, decoded.exp);
    }

    // Generate new token pair
    return this.generateTokens(userId, email, roles);
  }

  async logout(
    userId: string,
    email: string,
    accessToken?: string,
    refreshToken?: string,
    context?: RequestContext,
  ): Promise<void> {
    // Blacklist access token if provided
    if (accessToken) {
      const decoded = this.jwtService.decode(accessToken) as { exp?: number } | null;
      if (decoded?.exp) {
        this.tokenBlacklistService.add(accessToken, decoded.exp);
      }
    }

    // Blacklist refresh token if provided
    if (refreshToken) {
      const decoded = this.jwtService.decode(refreshToken) as { exp?: number } | null;
      if (decoded?.exp) {
        this.tokenBlacklistService.add(refreshToken, decoded.exp);
      }
    }

    // Log logout action
    await this.auditLogService.log(
      userId,
      email,
      AuditAction.LOGOUT,
      'auth',
      {
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
    );
  }

  private async generateTokens(userId: string, email: string, roles: string[]): Promise<TokenPair> {
    const accessPayload: TokenPayload = {
      sub: userId,
      email,
      roles,
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      sub: userId,
      email,
      roles,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.accessTokenExpiry as StringValue,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTokenExpiry as StringValue,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user.toSafeObject();
  }
}
