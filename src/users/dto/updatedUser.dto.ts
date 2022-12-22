import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';
import { NewUserDto } from './newUser.dto';

export class UpdatedUserDto extends PartialType(NewUserDto) {
  @ApiPropertyOptional({ description: 'User access role', example: Role.Staff, default: Role.Staff })
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;
}
