import { HttpStatus, Logger, VersioningType } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as process from 'process';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet для безопасности
  app.use(helmet());

  // CORS
  app.enableCors();

  // Версионирование API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Глобальный префикс
  app.setGlobalPrefix('api');

  // Глобальный обработчик ошибок Prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST, // Неверные данные
      P2002: HttpStatus.CONFLICT, // Конфликт уникального ключа
      P2025: HttpStatus.NOT_FOUND, // Запись не найдена
      P2003: HttpStatus.BAD_REQUEST, // Ограничение внешнего ключа
      P2023: HttpStatus.BAD_REQUEST, // Ошибочный формат данных
      P2010: HttpStatus.BAD_REQUEST, // Неверные значения полей
    }),
  );

  // Подключение PrismaService и настройка хуков завершения работы
  // const prismaService: PrismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);

  // Swagger конфигурация
  const config = new DocumentBuilder()
    .setTitle('Income Tracker API')
    .setDescription('API documentation for Income Tracker application')
    .setVersion('1.0')
    .addBearerAuth() // Добавляем авторизацию через Bearer токены
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Логгер для отображения состояния сервера
  const logger = new Logger('Income Tracker API');
  const PORT = process.env.PORT || 4200;

  await app.listen(PORT, () => {
    logger.verbose(`Application is running on http://localhost:${PORT}/api`);
    logger.verbose(`Swagger documentation is available on http://localhost:${PORT}/api/docs`);
  });
}

bootstrap();
