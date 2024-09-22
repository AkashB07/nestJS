import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  THROTTLER_LIMIT,
  THROTTLER_TTL,
} from 'src/common/constants/throttler.constant';
import { EmailManagerModule } from 'src/email-manager/email-manager.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './passport/jwt/jwt-refresh.strategy';
import { JwtAccessTokenStrategy } from './passport/jwt/jwt.strategy';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: THROTTLER_TTL,
      limit: THROTTLER_LIMIT,
    }),
    UsersModule,
    EmailManagerModule,
    CacheManagerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
})

export class AuthModule {}
