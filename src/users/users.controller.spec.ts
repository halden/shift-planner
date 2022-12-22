import { Test, TestingModule } from '@nestjs/testing';
import { OrderDirection } from 'src/shared/dto/orderByInput.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { deleteResult, mockTimestamp, testUsers, updateResult } from './users.service.spec';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockImplementation(async () => Promise.resolve(testUsers)),
            getUser: jest.fn().mockImplementation(async () => Promise.resolve(testUsers[0])),
            update: jest.fn().mockImplementation(async () => Promise.resolve(updateResult)),
            remove: jest.fn().mockImplementation(async () => Promise.resolve(deleteResult)),
            getUsersSortedByHours: jest.fn().mockImplementation(async () => Promise.resolve(testUsers)),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('when requesting a users list', () => {
    it('should return an array of users from database', async () => {
      expect(await usersController.findAll()).toBe(testUsers);
      expect(usersService.findAll).toBeCalled();
    });
  });

  describe('when searching for a user', () => {
    it('should return the user found', async () => {
      expect(await usersController.findOne(1)).toBe(testUsers[0]);
      expect(usersService.getUser).toBeCalled();
    });
  });

  describe('when updating a user', () => {
    it('should call update with the passed data', async () => {
      expect(await usersController.update('1', { name: 'Alicia' })).toBe(updateResult);
      expect(usersService.update).toBeCalled();
    });
  });

  describe('when removing a user', () => {
    it('should call remove with the passed data', async () => {
      expect(await usersController.remove('1')).toBe(deleteResult);
      expect(usersService.remove).toBeCalled();
    });
  });

  describe('when requesting a user list ordered by total hours worked', () => {
    it('should successfully return all users with total hours', async () => {
      expect(
        await usersController.findAllSorted(
          {
            order: OrderDirection.DESC,
          },
          {
            startDate: mockTimestamp,
            endDate: mockTimestamp,
          },
        ),
      ).toBe(testUsers);
      expect(usersService.getUsersSortedByHours).toBeCalled();
    });
  });
});
