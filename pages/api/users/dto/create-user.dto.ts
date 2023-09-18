import {
  IsEmail,
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
} from "class-validator"
import {
  Transform,
  Type,
} from 'class-transformer'
import type {
  TCity, TCountry, TEmail, TPassword, TPhone, TRefreshToken, TRole, TUserCodeId, TUserName
} from "@/pages/api/users/types"
import { USER_ROLE } from "../const"

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: TUserName;

  @Transform(({ value }) => value === 'null' ? null : value)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly userCodeId: TUserCodeId | null = null;

  @IsNotEmpty()
  @IsEmail()
  readonly email!: TEmail;

  @IsString()
  readonly password!: TPassword;

  @IsOptional()
  @IsString()
  refreshToken: TRefreshToken = null;

  @IsString()
  readonly phone!: TPhone;

  @IsOptional()
  @Transform(({ value }) => Number.isNaN(+value) ? USER_ROLE.CLIENT : +value)
  @Type(() => Number)
  @Min(USER_ROLE.CLIENT)
  @Max(USER_ROLE.ADMIN)
  @IsNumber()
  readonly role!: TRole;

  @IsOptional()
  @IsString()
  readonly city!: TCity | null;

  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  @IsString()
  readonly country!: TCountry | null;
}
