import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { isWithinYear } from 'src/shared/util/isInValidRange.util';
import { NewShiftDto } from './dto/newShift.dto';
import { UpdatedShiftDto } from './dto/updatedShift.dto';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
  ) {}

  create(newShiftDto: NewShiftDto): Promise<Shift> {
    return this.shiftsRepository.save(newShiftDto);
  }

  update(id: number, updatedShiftDto: UpdatedShiftDto): Promise<UpdateResult> {
    return this.shiftsRepository.update(id, updatedShiftDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.shiftsRepository.delete(id);
  }

  async getFiltered(userId: number, startDate: number, endDate: number) {
    if (!isWithinYear(startDate, endDate)) {
      throw new BadRequestException('Date range exceeds 1 year limit');
    }

    const shiftsFiltered = await this.shiftsRepository.find({
      where: {
        user: Equal(userId),
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });

    return shiftsFiltered;
  }
}
