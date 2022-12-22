import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { isWithinYear } from 'src/shared/util/isInValidRange.util';
import { OrderDirection } from 'src/shared/dto/orderByInput.dto';
import { NewUserDto } from './dto/newUser.dto';
import { UpdatedUserDto } from './dto/updatedUser.dto';
import { User } from './entities/user.entity';
import { SortedUserDto } from './dto/sortedUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(newUserDto: NewUserDto): Promise<User> {
    return this.usersRepository.save(newUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUser(options: FindOptionsWhere<User>): Promise<User> {
    return this.usersRepository.findOne({ where: options });
  }

  async update(id: number, updatedUserDto: UpdatedUserDto): Promise<UpdateResult> {
    return this.usersRepository.update(id, updatedUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  async getUsersSortedByHours(
    orderDirection: OrderDirection,
    startDate: number,
    endDate: number,
  ): Promise<SortedUserDto[]> {
    if (!isWithinYear(startDate, endDate)) {
      throw new BadRequestException('Date range exceeds 1 year limit');
    }

    const usersSorted = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.shifts', 'shifts')
      .addSelect(
        `SUM(
          CASE
            WHEN shifts.date BETWEEN :start_date AND :end_date
              THEN shifts.hours
            ELSE 0
          END
        ) user_total`,
      )
      .setParameter('start_date', startDate)
      .setParameter('end_date', endDate)
      .groupBy('user.id')
      .orderBy('user_total', orderDirection)
      .getMany();

    return usersSorted;
  }
}
