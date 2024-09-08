// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { TypeORMExceptionFilter } from './common/filters/typeorm-exception.filter'; 
import { HttpExceptionsFilter } from './common/filters/http-exception.filter';
import { NodeEnvEnum } from './common/enum/config.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });
  // Get Global Config
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  // Intialize Middlewares
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useLogger(app.get(PinoLogger));
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new HttpExceptionsFilter(),
    // new TypeORMExceptionFilter(),
  );

  // Setup Swagger Docs
  if (
    configService.get('NODE_ENV') !== NodeEnvEnum.PRODUCTION ||
    configService.get('NODE_ENV') !== NodeEnvEnum.STAGING
  ) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Service')
      .setDescription('Service API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('service')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    const logger = new Logger();

    await app.listen(PORT);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  }
}
bootstrap();
