import { Injectable, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { APP_NAME, USER_HAPITS } from './user.constants';

abstract class ConfigService {}
class DevelopmentConfigService extends ConfigService {}
class ProductionConfigService extends ConfigService {}

@Injectable()
class UserHapitsFactory {
  getHapits() {
    return ['eat', 'sleep', 'code'];
  }
}

@Injectable()
class LoggerService {
  constructor(private readonly userService: UserService) {}
  // Logic
}

const LoggerServiceAliasProvider = {
  provide: 'LoggerServiceAlias',
  useExisting: 'LoggerService',
};

@Injectable()
class DatabaseConnection {
  async connectToDB(): Promise<string> {
    return await Promise.resolve('connectToDB successfully');
  }
}

@Module({
  controllers: [UserController],
  providers: [
    // Standard provider
    UserService,
    UserHapitsFactory,
    LoggerService,
    LoggerServiceAliasProvider,
    DatabaseConnection,
    // Custom provider
    // value based provider
    {
      provide: APP_NAME,
      useValue: 'Nest Demo API',
    },
    // class based provider
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    // factory based provider
    {
      provide: USER_HAPITS,
      useFactory: async (
        userHapits: UserHapitsFactory,
        dbConnection: DatabaseConnection,
      ) => {
        // Connect to DB
        await dbConnection.connectToDB();
        userHapits.getHapits();
      },
      inject: [UserHapitsFactory, DatabaseConnection],
    },
  ],
})
export class UserModule {}
