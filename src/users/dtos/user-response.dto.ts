import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  username: string;
  country: string;
  email: string;

  @Exclude()
  password: string;
}
