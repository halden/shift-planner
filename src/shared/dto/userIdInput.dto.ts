import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class UserIdInputDto {
  @ApiProperty({ description: 'Unique user ID', example: 1 })
  @IsNumber()
  @Expose()
  userId: number;
}
