import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  config.update({
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Project Swagger')
    .setDescription('The NestJS Project API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  await app.listen(`${process.env.PORT}`);
}
bootstrap();
