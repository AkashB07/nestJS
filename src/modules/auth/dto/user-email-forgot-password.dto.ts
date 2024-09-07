import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserEmailForgotPasswordDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
