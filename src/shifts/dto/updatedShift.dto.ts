import { PartialType } from '@nestjs/swagger';
import { NewShiftDto } from './newShift.dto';

export class UpdatedShiftDto extends PartialType(NewShiftDto) {}
