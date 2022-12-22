import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { adminUserMock } from './auth.service.spec';
import { NewUserRequestDto } from './dto/newUserRequest.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            login: jest.fn().mockImplementation((user: User) => Promise.resolve({ token: '' })),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            register: jest.fn().mockImplementation((user: NewUserRequestDto) => Promise.resolve({ token: '' })),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('when user signs in', () => {
    it('should return access token object', () => {
      const user = { id: 1 } as User;

      expect(authService.login(user)).resolves.toEqual({ token: '' });
      expect(authService.login).toHaveBeenCalled();
    });
  });

  describe('when user registers', () => {
    it('should return token object', () => {
      const user = { email: adminUserMock.email, password: adminUserMock.password } as NewUserRequestDto;

      expect(authService.register(user)).resolves.toEqual({ token: '' });
      expect(authService.register).toHaveBeenCalled();
    });
  });

  describe('when retrieving user profile', () => {
    it('should return current user data', () => {
      const user = { id: 1 } as User;
      const res = authController.getProfile({ user });

      expect(res).toMatchObject({ email: undefined, id: 1, name: undefined, role: undefined });
    });
  });
});
