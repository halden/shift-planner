import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { deleteResult, mockTimestamp, updateResult } from 'src/users/users.service.spec';
import { Shift } from './entities/shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { mockShifts, savedShifts } from './shifts.service.spec';

describe('ShiftsController', () => {
  let shiftsController: ShiftsController;
  let shiftsService: ShiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [
        {
          provide: ShiftsService,
          useValue: {
            create: jest.fn().mockImplementation(async () => Promise.resolve(savedShifts[0])),
            update: jest.fn().mockImplementation(async () => Promise.resolve(updateResult)),
            remove: jest.fn().mockImplementation(async () => Promise.resolve(deleteResult)),
            getFiltered: jest.fn().mockImplementation(async () => Promise.resolve(savedShifts)),
          },
        },
        {
          provide: getRepositoryToken(Shift),
          useValue: {},
        },
      ],
    }).compile();

    shiftsController = module.get<ShiftsController>(ShiftsController);
    shiftsService = module.get<ShiftsService>(ShiftsService);
  });

  it('should be defined', () => {
    expect(shiftsController).toBeDefined();
    expect(shiftsService).toBeDefined();
  });

  describe('when adding a new shift', () => {
    it('should return a shift from database', async () => {
      expect(await shiftsController.create(mockShifts[0])).toBe(savedShifts[0]);
      expect(shiftsService.create).toBeCalled();
    });
  });

  describe('when updating a shift', () => {
    it('should call update with the passed data', async () => {
      expect(await shiftsController.update('1', { hours: 5 })).toEqual(updateResult);
      expect(shiftsService.update).toBeCalled();
    });
  });

  describe('when removing a shift', () => {
    it('should call remove with the passed data', async () => {
      expect(await shiftsController.remove('1')).toBe(deleteResult);
      expect(shiftsService.remove).toBeCalled();
    });
  });

  describe('when requesting a shift list within specified date range', () => {
    it('should successfully return all shifts', async () => {
      expect(
        await shiftsController.getFiltered(
          {
            userId: 1,
          },
          {
            startDate: mockTimestamp,
            endDate: mockTimestamp,
          },
        ),
      ).toBe(savedShifts);
      expect(shiftsService.getFiltered).toBeCalled();
    });
  });
});
