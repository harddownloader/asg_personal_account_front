import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  readonly userId!: string;

  @IsNotEmpty()
  @IsString()
  readonly content!: string;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isViewed: boolean = false;
}
