import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/casl/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { ShiftsService } from './shifts.service';
import { NewShiftDto } from './dto/newShift.dto';
import { UpdatedShiftDto } from './dto/updatedShift.dto';
import { DateRangeInputDto } from '../shared/dto/dateRangeInput.dto';
import { UserIdInputDto } from '../shared/dto/userIdInput.dto';
import { Shift } from './entities/shift.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('ShiftsController')
@ApiBearerAuth()
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Roles(Role.Admin)
  @Post('create')
  create(@Body() newShiftDto: NewShiftDto): Promise<Shift> {
    return this.shiftsService.create(newShiftDto);
  }

  @Roles(Role.Admin)
  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updatedShiftDto: UpdatedShiftDto): Promise<UpdateResult> {
    return this.shiftsService.update(+id, updatedShiftDto);
  }

  @Roles(Role.Admin)
  @Delete(':id/delete')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.shiftsService.remove(+id);
  }

  @Get('search')
  getFiltered(@Query() { userId }: UserIdInputDto, @Query() { startDate, endDate }: DateRangeInputDto) {
    return this.shiftsService.getFiltered(userId, startDate, endDate);
  }
}
