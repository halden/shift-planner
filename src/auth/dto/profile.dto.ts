import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/users/enums/role.enum';

export class ProfileDto {
  @ApiProperty({ description: 'Unique user ID', example: 1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Login email', example: 'alice@symbolics.com' })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({ title: 'User name', example: 'Alice', maxLength: 40 })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty({ description: 'User access role', example: Role.Staff, default: Role.Staff })
  @IsNotEmpty({ message: 'The role is required' })
  @IsEnum(Role)
  role: Role;
}
