import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

@Exclude()
export class DateRangeInputDto {
  @Expose()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  startDate: number;

  @Expose()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  endDate: number;
}
