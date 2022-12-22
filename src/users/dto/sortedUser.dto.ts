import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';

export class SortedUserDto extends ProfileDto {
  @ApiPropertyOptional({
    description: 'User hours total within a date range',
    example: 8,
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;
}
