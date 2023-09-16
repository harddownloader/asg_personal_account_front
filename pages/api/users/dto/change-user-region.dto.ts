import { IsNotEmpty, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class ChangeUserRegionDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  readonly newCountry!: string;
}
