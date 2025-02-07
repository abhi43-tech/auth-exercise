import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  username: string;

  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}