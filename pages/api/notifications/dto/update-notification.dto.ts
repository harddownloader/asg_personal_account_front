import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class UpdateNotificationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly userId?: string;

  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly content?: string;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isViewed: boolean = false;
}

