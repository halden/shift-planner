import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NewShiftDto {
  @ApiProperty({
    description: 'Working date in Unix time',
    example: 1671400800,
  })
  @IsNotEmpty()
  @IsNumber()
  date: number;

  @ApiProperty({
    description: 'Shift hours',
    type: Number,
    example: 8,
  })
  @IsNotEmpty()
  @IsNumber()
  hours: number;

  @ApiProperty({
    description: 'User ID for the shift',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
