import { ApiProperty } from '@nestjs/swagger';

export class NewShiftDto {
  @ApiProperty({
    description: 'Working date in Unix time',
    example: 1671400800,
  })
  date: number;

  @ApiProperty({
    type: Number,
  })
  hours: number;

  @ApiProperty({
    type: Number,
  })
  userId: number;
}
