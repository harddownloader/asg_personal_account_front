import { IsNotEmpty, IsString } from "class-validator"
import type {
  TToneCreatedAt,
  TToneLabel,
  TToneUpdatedAt
} from "@/entities/Tone"

export class CreateToneDto {
  @IsNotEmpty()
  @IsString()
  readonly label!: TToneLabel

  @IsNotEmpty()
  @IsString()
  readonly createdAt!: TToneCreatedAt

  @IsNotEmpty()
  @IsString()
  readonly updatedAt!: TToneUpdatedAt
}
