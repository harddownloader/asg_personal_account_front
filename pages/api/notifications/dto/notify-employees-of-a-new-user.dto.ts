/* notifying employees of a new user */
import { IsNotEmpty, IsString } from "class-validator"

export class NotifyEmployeesOfANewUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userName!: string;

  @IsNotEmpty()
  @IsString()
  readonly userEmail!: string;

  @IsNotEmpty()
  @IsString()
  readonly userPhone!: string;

  @IsNotEmpty()
  @IsString()
  readonly userPassword!: string;
}
