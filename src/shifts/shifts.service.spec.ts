import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { deleteResult, mockTimestamp, testUsers, updateResult } from 'src/users/users.service.spec';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';

export const mockShifts = [
  { date: mockTimestamp, hours: 8, userId: 1 },
  { date: mockTimestamp, hours: 4, userId: 2 },
];
export const savedShifts = [
  { id: 1, date: mockTimestamp, hours: 8, user: testUsers[0] },
  { id: 2, date: mockTimestamp, hours: 4, user: testUsers[1] },
];

describe('ShiftsService', () => {
  let shiftsService: ShiftsService;
  let shiftsRepository: Repository<Shift>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: getRepositoryToken(Shift),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    shiftsService = module.get<ShiftsService>(ShiftsService);
    shiftsRepository = module.get<Repository<Shift>>(getRepositoryToken(Shift));
  });

  it('should be defined', () => {
    expect(shiftsService).toBeDefined();
    expect(shiftsRepository).toBeDefined();
  });

  describe('when creating a shift', () => {
    it('should return the saved shift', async () => {
      const saveSpy = jest.spyOn(shiftsRepository, 'save').mockImplementation(async () => savedShifts[0]);
      const result = await shiftsService.create(mockShifts[0]);

      expect(saveSpy).toBeCalledWith(mockShifts[0]);
      expect(result).toEqual(savedShifts[0]);
    });
  });

  describe('when updating a shift', () => {
    it('should call update with the passed data', async () => {
      const updateObject = { hours: 12 };
      const removeSpy = jest.spyOn(shiftsRepository, 'update').mockImplementation(async () => updateResult);
      const result = await shiftsService.update(1, updateObject);

      expect(removeSpy).toBeCalledWith(1, updateObject);
      expect(result).toEqual(updateResult);
    });
  });

  describe('when removing a shift', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(shiftsRepository, 'delete').mockImplementation(async () => deleteResult);
      const result = await shiftsService.remove(1);

      expect(removeSpy).toBeCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('when requesting shift list for a selected user within selected time range', () => {
    it('should successfully return a list of all shifts', async () => {
      jest.spyOn(shiftsRepository, 'find' as any).mockImplementation(async () => Promise.resolve(savedShifts));

      const result = await shiftsService.getFiltered(1, mockTimestamp, mockTimestamp);

      expect(result).toEqual(savedShifts);
    });
  });
});
