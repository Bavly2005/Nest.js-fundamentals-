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
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import ormConfig from './config/orm.config';
// import ormConfgProd from './config/orm.confg.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.staging.env',
      isGlobal: true,
      expandVariables: true,
      // load: [ormConfig, ormConfgProd],
    }),

    // TypeOrmModule.forRootAsync({
    //   useFactory:
    //     process.env.NODE_ENV === 'development ' ? ormConfig : ormConfgProd,
    // }),

    UserModule,
    CommonModule,
  ],

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
