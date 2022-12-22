import { ConflictException, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from '../users/users.service';
import { HASH_SALT_OR_ROUNDS } from './constants';
import { NewUserRequestDto } from './dto/newUserRequest.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.usersService.getUser({ email });

    if (user) {
      const isMatched = await compare(password, user.password_hash);

      if (isMatched) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: User) {
    const tokenPayload = { email: user.email, sub: user.id, role: user.role };

    return {
      token: this.jwtService.sign(tokenPayload),
    };
  }

  async register(newUserRequestDto: NewUserRequestDto) {
    const user = await this.usersService.getUser({ email: newUserRequestDto.email });

    if (user) {
      throw new ConflictException('Email already in use');
    }

    try {
      const passwordHash = await hash(newUserRequestDto.password, HASH_SALT_OR_ROUNDS);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...tokenPayload } = await this.usersService.createUser({
        ...newUserRequestDto,
        password_hash: passwordHash,
        role: Role.Staff,
      });

      return {
        token: this.jwtService.sign(tokenPayload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }
}
