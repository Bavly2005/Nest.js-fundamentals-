import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  Delete,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
  Req,
} from '@nestjs/common';
// import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface EnvironmentVariables {
  PORT: number;
  EMAIL: string;
}

@Controller('users')
export class UserController {
  logger: Logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}
  private users: UserEntity[] = [];

  // @SetMetadata('IS_Public', true)
  @Public()
  @Get()
  async find(@Req() req: Request): Promise<UserEntity[]> {
    this.logger.log('Getting all users');

    const users = await this.userService.findUsers();

    this.logger.debug(`Found ${users.length} users`);

    return users;
  }

  @Get(':id')
  findone(@Param('id', ParseUUIDPipe) id: string): UserResponseDto {
    return this.userService.findUser(id);
  }

  @Post()
  create(
    @Body(new ValidationPipe({ groups: ['create'] }))
    createUserDto: UserResponseDto,
  ) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ groups: ['update'] }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
