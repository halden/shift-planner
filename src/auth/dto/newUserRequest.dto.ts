import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CredentialsDto } from './credentials.dto';

export class NewUserRequestDto extends CredentialsDto {
  @ApiProperty({ title: 'User name', example: 'Alice', maxLength: 40 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  name: string;
}
