import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ProfileDto } from './dto/profile.dto';
import { NewUserRequestDto } from './dto/newUserRequest.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('AuthController')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login to system' })
  @ApiBody({ type: CredentialsDto })
  @ApiResponse({ status: 200, description: 'Authenticated successfully', type: TokenDto })
  @ApiResponse({ status: 400, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 201, description: 'Account created successfully', type: TokenDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({ status: 500, description: 'Could not create user' })
  @Public()
  @Post('register')
  register(@Body() newUserRequestDto: NewUserRequestDto) {
    return this.authService.register(newUserRequestDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  getProfile(@Request() req: any) {
    const { id, email, name, role } = req.user;
    return { id, email, name, role };
  }
}
