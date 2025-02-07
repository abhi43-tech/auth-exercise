import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Request } from 'express'
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entity/user.entity";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.Refresh
      ]),
      secretOrKey: process.env.REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(req: Request) {
    const user = await this.userService.findToken(req.cookies?.Refresh);
    if(!user) throw new BadRequestException('Refresh Token is not valid');
    this.jwtService.verify(req.cookies?.Refresh, { secret: process.env.REFRESH_SECRET })
    return user
  }
}