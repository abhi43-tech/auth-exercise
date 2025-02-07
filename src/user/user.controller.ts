import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { AuthService } from 'src/auth/autuh.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { JwtRefreshGuard } from 'src/auth/guard/refresh.guard';


@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 60000,
    });
    res.cookie('Refresh', refresh_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 3600,
    });
    res.json({access_token})
  }

  @UseGuards(JwtGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Response() res) {
    const { access_token } = await this.authService.generateTokens(req.user);

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 100000,
    });
    
    return res.json({ access_token });
  }
}
