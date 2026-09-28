import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WrapDataInterceptor } from './common/interceptors/wrap-data/wrap-data.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { CustomExceptionFilter } from './common/filters/custom-exception/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
