import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class NewUserDto {
  @ApiProperty({ title: 'User name', example: 'Alice', maxLength: 40 })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty({ description: 'Login email', example: 'alice@symbolics.com' })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({
    description: 'Login password hash',
    example: '$2b$10$SRxOgzsPQo0FtgkcVyTr8.Ow/oOZxz4/MR3QPhPRux/2Hy9lRxN0G',
  })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  password_hash: string;

  @ApiProperty({ description: 'User access role', example: Role.Staff, default: Role.Staff })
  @IsNotEmpty({ message: 'The role is required' })
  @IsEnum(Role)
  role: Role;
}
