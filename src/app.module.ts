import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { UserModule } from './users/user.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
// import { AuthGuard } from './common/guards/auth/auth.guard';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UserController } from './users/user.controller';

@Module({
  imports: [UserModule, CommonModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    { provide: APP_PIPE, useClass: ValidationPipe },
    // { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'users/:id', method: RequestMethod.PATCH },
        { path: 'users/:id', method: RequestMethod.DELETE },
      )
      .forRoutes(UserController);
  }
}
