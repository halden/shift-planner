import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Shift } from '../../shifts/entities/shift.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'Incorrect email' })
  @Column()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @Column()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Exclude()
  @Column()
  password_hash: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.Staff })
  role: Role;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Shift, (shift) => shift.user)
  shifts: Shift['id'];

  /**
   * Virtual column workaround while `addSelectAndMap` feature is on the way
   * Read more here:
   *  - https://github.com/typeorm/typeorm/pull/7010
   *  - https://github.com/typeorm/typeorm/issues/296
   *  - https://github.com/typeorm/typeorm/issues/1822
   */
  @IsNotEmpty()
  @IsNumber()
  @Column('smallint', {
    nullable: true,
    select: false,
  })
  @Transform(({ value }) => parseInt(value))
  total: number;
}
