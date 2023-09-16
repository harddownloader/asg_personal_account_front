import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password!: string
}
