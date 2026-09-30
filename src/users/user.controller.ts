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
} from '@nestjs/common';
// import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private users: UserEntity[] = [];

  // @SetMetadata('IS_Public', true)
  @Public()
  @Get()
  async find(): Promise<UserEntity[]> {
    // delay 5 sec
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.userService.findUsers();
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
