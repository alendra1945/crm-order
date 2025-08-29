import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSigninRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
