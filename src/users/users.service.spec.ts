import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { adminUserMock } from 'src/auth/auth.service.spec';
import { OrderDirection } from 'src/shared/dto/orderByInput.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';

export const mockTimestamp = 1671487200;
export const mockDate = new Date();
export const updateResult = { affected: 1, generatedMaps: [], raw: [] };
export const deleteResult = { affected: 1, raw: [] };

export const testUsers = [
  {
    createdAt: mockDate,
    email: 'alice@symbolics.com',
    id: 1,
    name: 'Alice',
    password_hash: '.',
    role: Role.Admin,
    updatedAt: mockDate,
    total: 8,
  },
  {
    createdAt: mockDate,
    email: 'bob@symbolics.com',
    id: 2,
    name: 'Bob',
    password_hash: '.',
    role: Role.Staff,
    updatedAt: mockDate,
    total: null,
  },
] as User[];

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('when creating a user', () => {
    it('should successfully insert a user', async () => {
      const saveSpy = jest.spyOn(userRepository, 'save').mockImplementation(async () => testUsers[0]);
      const result = await userService.createUser(testUsers[0]);

      expect(saveSpy).toBeCalledWith(testUsers[0]);
      expect(result).toEqual(testUsers[0]);
    });
  });

  describe('when requesting a user list', () => {
    it('should successfully return all users', async () => {
      const findSpy = jest.spyOn(userRepository, 'find').mockImplementation(async () => testUsers);
      const result = await userService.findAll();

      expect(findSpy).toBeCalled();
      expect(result).toEqual(testUsers);
    });
  });

  describe('when searching for a user', () => {
    it('should return the user found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...fieldsToMatch } = adminUserMock;
      const findOneSpy = jest.spyOn(userRepository, 'findOne');

      expect(userService.getUser({ email: adminUserMock.email })).resolves.toMatchObject(fieldsToMatch);
      expect(findOneSpy).toBeCalledWith({ where: { email: adminUserMock.email } });

      expect(userService.getUser({ id: adminUserMock.id })).resolves.toMatchObject(fieldsToMatch);
      expect(findOneSpy).toBeCalledWith({ where: { id: adminUserMock.id } });
    });
  });

  describe('when updating a user', () => {
    it('should call update with the passed data', async () => {
      const updateObject = { role: Role.Staff };
      const removeSpy = jest.spyOn(userRepository, 'update').mockImplementation(async () => updateResult);
      const result = await userService.update(1, updateObject);

      expect(removeSpy).toBeCalledWith(1, updateObject);
      expect(result).toEqual(updateResult);
    });
  });

  describe('when removing a user', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(userRepository, 'delete').mockImplementation(async () => deleteResult);
      const result = await userService.remove(1);

      expect(removeSpy).toBeCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('when requesting a user list ordered by total hours worked within selected time range', () => {
    it('should successfully return all users with total hours', async () => {
      const createQueryBuilder = {
        leftJoin: () => createQueryBuilder,
        addSelect: () => createQueryBuilder,
        setParameter: () => createQueryBuilder,
        groupBy: () => createQueryBuilder,
        orderBy: () => createQueryBuilder,
        getMany: () => testUsers,
      };

      jest.spyOn(userRepository, 'createQueryBuilder' as any).mockImplementation(() => createQueryBuilder);

      const result = await userService.getUsersSortedByHours(OrderDirection.DESC, mockTimestamp, mockTimestamp);

      expect(result).toEqual(testUsers);
    });
  });
});
