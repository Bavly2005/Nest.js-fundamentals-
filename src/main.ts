import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WrapDataInterceptor } from './common/interceptors/wrap-data/wrap-data.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { CustomExceptionFilter } from './common/filters/custom-exception/custom-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new LoggerMiddleware());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(
    new WrapDataInterceptor(),
    new TimeoutInterceptor(),
  );

  app.useGlobalFilters(new CustomExceptionFilter());

  // app.useGlobalGuards(new AuthGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
