import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class NotifyManagersDto {
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @IsNotEmpty()
  @IsString()
  readonly content!: string;
}
