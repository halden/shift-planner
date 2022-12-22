import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Roles } from 'src/casl/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdatedUserDto } from './dto/updatedUser.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { DateRangeInputDto } from 'src/shared/dto/dateRangeInput.dto';
import { OrderByInputDto, OrderDirection } from 'src/shared/dto/orderByInput.dto';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { SortedUserDto } from './dto/sortedUser.dto';
import { UserIdInputDto } from 'src/shared/dto/userIdInput.dto';

@ApiTags('UsersController')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all the users',
    type: ProfileDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find all users sorted by their hours total within a date range' })
  @ApiQuery({ name: 'order', enum: OrderDirection })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  @ApiResponse({
    status: 200,
    description: 'Get all the users sorted',
    type: ProfileDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('hours')
  async findAllSorted(
    @Query() { order }: OrderByInputDto,
    @Query() { startDate, endDate }: DateRangeInputDto,
  ): Promise<SortedUserDto[]> {
    return await this.usersService.getUsersSortedByHours(order, startDate, endDate);
  }

  @ApiOperation({ summary: 'Find a user' })
  @ApiResponse({ status: 200, description: 'Get the user', type: ProfileDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: UserIdInputDto['userId']): Promise<User> {
    return await this.usersService.getUser({ id });
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.Admin)
  @Patch(':id/update')
  async update(
    @Param('id') id: UserIdInputDto['userId'],
    @Body() updatedUserDto: UpdatedUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.update(+id, updatedUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Deleted successfully', type: DeleteResult })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.Admin)
  @Delete(':id/delete')
  async remove(@Param('id') id: UserIdInputDto['userId']): Promise<DeleteResult> {
    return await this.usersService.remove(+id);
  }
}
