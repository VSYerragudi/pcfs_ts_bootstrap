import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenBlacklistService } from './token-blacklist.service';
import { UsersModule } from '@/users/users.module';
import { AuditLogModule } from '@/audit-log/audit-log.module';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UsersModule,
    AuditLogModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'default-secret-change-in-production',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m') as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenBlacklistService,
  ],
  exports: [AuthService, TokenBlacklistService],
})
export class AuthModule {}
