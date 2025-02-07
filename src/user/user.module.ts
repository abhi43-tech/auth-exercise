
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from 'src/password/password.service';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { AuthService } from 'src/auth/autuh.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtRefreshGuard } from 'src/auth/guard/refresh.guard';
import { JwtRefreshStrategy } from 'src/auth/strategy/refresh.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UserService, PasswordService, LocalStrategy, AuthService, JwtService, JwtStrategy, JwtRefreshStrategy],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
