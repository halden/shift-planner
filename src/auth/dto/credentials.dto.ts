import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({ description: 'Login email', example: 'alice@symbolics.com' })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({ title: 'Login password', example: 'qwerty', maxLength: 20, minLength: 6 })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
