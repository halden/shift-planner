import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

export const adminUserMock = {
  id: 1,
  name: 'Alice',
  email: 'alice@symbolics.com',
  password: 'qwerty',
  role: 'admin',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [AuthService, JwtService, UsersService, { provide: getRepositoryToken(User), useValue: {} }],
    }).compile();

    authService = await module.resolve<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('when validating an authenticating user', () => {
    it('should return null if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      const user = await authService.validateUser(adminUserMock.email, 'invalid password');

      expect(user).toBeNull();
    });
  });

  describe('when validating an authenticating user', () => {
    it('should return user object if user found', async () => {
      const user = await authService.validateUser(adminUserMock.email, adminUserMock.password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...fieldsToMatch } = adminUserMock;

      expect(user).toMatchObject(fieldsToMatch);
    });
  });

  describe('when logging an authenticated user in', () => {
    it('should generate an access token', async () => {
      const userToLogin = { id: 1 } as User;
      const { token } = await authService.login(userToLogin);

      expect(token).toContain('.');
    });
  });

  describe('when regitering a user', () => {
    it('should check if email in use', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, role, ...userToRegister } = adminUserMock;
      try {
        await authService.register(userToRegister);
      } catch (error) {
        expect(error.message).toBe('Email already in use');
      }
    });
  });

  describe('when regitering a user', () => {
    it('should successfully insert a user', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, role, ...userToSave } = adminUserMock;
      const user = { id: 1 } as User;

      jest.spyOn(usersService, 'getUser').mockImplementation(async () => null);
      jest.spyOn(usersService, 'createUser').mockImplementation(async () => user);

      const { token } = await authService.register(userToSave);

      expect(token).toContain('.');
    });
  });
});
