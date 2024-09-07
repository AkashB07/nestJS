import { Module } from '@nestjs/common';
import { EmailManagerService } from './email-manager.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: parseInt(configService.get('SMTP_PORT')),
          ignoreTLS: JSON.parse(configService.get('SMTP_IGNORE_TLS')),
          secure: JSON.parse(configService.get('SMTP_SECURE')),
          auth: {
            user: configService.get('SMTP_USERNAME'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get('EMAIL_FROM'),
        },
        preview: true,
      }),      
    }),
  ],
  providers: [EmailManagerService],
  exports: [EmailManagerService],
})
export class EmailManagerModule {}
