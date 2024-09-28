import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidator } from './common/validator/config.validator';
import { LoggerModule } from 'nestjs-pino';
// import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListManagementModule } from './modules/list-management/list-management.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DataModule } from './modules/data/data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidator,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: { level: config.get<string>('LOG_LEVEL') },
        };
      },
    }),
    // DatabaseModule,
    AuthModule,
    UsersModule,
    ListManagementModule,
    PrismaModule,
    AnalyticsModule,
    DataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
