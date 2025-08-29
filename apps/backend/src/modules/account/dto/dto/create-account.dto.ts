import { Gender } from '@prisma/client';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthSignupRequest } from 'src/modules/auth/dto';

export class CreateAccountRequest extends AuthSignupRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    enum: Gender,
  })
  @IsNotEmpty()
  gender: Gender;
}
