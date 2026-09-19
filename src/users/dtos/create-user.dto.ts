import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20, { groups: ['create'] })
  @Length(3, 20, { groups: ['update'] })
  readonly username: string;

  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @IsString()
  readonly country: string;
}
