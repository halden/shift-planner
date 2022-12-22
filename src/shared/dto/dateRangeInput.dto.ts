import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

@Exclude()
export class DateRangeInputDto {
  @ApiProperty({
    description: 'Working date in Unix time',
    example: 1671400800,
  })
  @Expose()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  startDate: number;

  @ApiProperty({
    description: 'Working date in Unix time',
    example: 1671400800,
  })
  @Expose()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  endDate: number;
}
