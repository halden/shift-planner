import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Exclude()
export class OrderByInputDto {
  @Expose()
  @ApiProperty({
    description: 'Order users by total hours (ASC|DESC|asc|desc)',
    example: OrderDirection.DESC,
  })
  @IsEnum(OrderDirection)
  @Transform(({ value }) => value?.toUpperCase() || OrderDirection.DESC)
  order: OrderDirection;
}
