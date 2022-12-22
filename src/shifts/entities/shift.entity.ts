import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('shifts')
export class Shift {
  @ApiProperty({
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Working date in Unix time',
    example: 1671400800,
  })
  @Column()
  date: number; // check https://stackoverflow.com/questions/56015112/how-to-set-format-dd-mm-yy-in-nestjs-without-time

  @ApiProperty({
    type: Number,
  })
  @Column('tinyint')
  hours: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
