import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { APP_NAME, USER_HAPITS } from './user.constants';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(APP_NAME) private appName: string,
    @Inject(USER_HAPITS) private userHapits: string[],
  ) {}

  private users: UserEntity[] = [];

  findUsers(): UserEntity[] {
    return this.users;
  }

  findUser(id: string): UserResponseDto {
    const user = this.users.find((user) => user.id === id);
    return new UserResponseDto(user);
  }

  createUser(createUserDto: CreateUserDto): UserResponseDto {
    const newUser: UserEntity = {
      ...createUserDto,
      id: uuid(),
    };
    this.users.push(newUser);
    return new UserResponseDto(newUser);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): UserEntity {
    // 1) find the element index that we want to update
    const index = this.users.findIndex((user) => user.id === id);
    // 2) update the element
    this.users[index] = { ...this.users[index], ...updateUserDto };

    return this.users[index];
  }

  deleteUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
