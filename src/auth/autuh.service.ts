import { Injectable, Proppatch, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);

  if (!user) throw new UnauthorizedException('User not found with given data.');

  const isPasswordValid = await bcrypt.compare(password, user.password); 

  if (!isPasswordValid) throw new UnauthorizedException('Password is wrong.'); 

  const { password: _, ...rest } = user;
  return rest;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };  
    const access_token = this.jwtService.sign(payload, {secret: process.env.ACCESS_SECRET, expiresIn: '1m'});
    const refresh_token = this.jwtService.sign(payload, {secret: process.env.REFRESH_SECRET, expiresIn: '1d'});

    await this.userService.updateUser(user.id, refresh_token);

    return { access_token, refresh_token }
  }

  async generateTokens(user: any) {
    const data = await this.userService.findOne(user.sub)
    const payload = {id: data.id, username: data.username, email: data.email, role: data.role}

    return {
      access_token: this.jwtService.sign(payload, {secret: process.env.ACCESS_SECRET, expiresIn: '5m'}),  
      // refresh_token: this.jwtService.sign(payload, { secret: 'REFRESH SECRET', expiresIn: '1d' })
    }
  }
}