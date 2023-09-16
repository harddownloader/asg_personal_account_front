import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from 'class-transformer'
import { CARGO_STATUS } from './../const'
import type {
  TCargoCost,
  TCargoCostOfDelivery,
  TCargoId,
  TCargoInsurance,
  TCargoStatus,
  TCargoTariff,
  TCargoVolume,
  TCargoWeight,
  TClientId,
  TPhotoIndex,
  TPhotoUrl,
  TPiecesInPlace,
  TWeight,
} from "../types"

class SpacePhotosDto {
  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @IsNumber()
  readonly photoIndex!: TPhotoIndex;

  @IsNotEmpty()
  @IsString()
  readonly url!: TPhotoUrl;
}

export class SpacesDto {
  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @IsNumber()
  readonly weight!: TWeight;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @IsNumber()
  readonly piecesInPlace!: TPiecesInPlace;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpacePhotosDto)
  readonly photos!: SpacePhotosDto[];
}

export class CreateCargoDto {
  @IsNotEmpty()
  @IsString()
  readonly cargoId!: TCargoId;

  @IsNotEmpty()
  @IsString()
  readonly clientId!: TClientId;

  @IsOptional()
  @Min(CARGO_STATUS.CARGO_WAITING_TO_BE_SEND)
  @Max(CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER)
  @Transform(({ value }) => Number.isNaN(+value) ? CARGO_STATUS.CARGO_WAITING_TO_BE_SEND : +value) // this field will be parsed to integer when `plainToClass gets called`
  @Type(() => Number)
  @IsNumber()
  readonly status: TCargoStatus = 0;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly costOfDelivery!: TCargoCostOfDelivery;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly insurance: TCargoInsurance = 0;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly cost: TCargoCost = 0;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly tariff!: TCargoTariff;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly volume: TCargoVolume = 0;

  @Transform(({ value }) => Number.isNaN(+value) ? 0 : +value)
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  readonly weight: TCargoWeight = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpacesDto)
  readonly spaces: SpacesDto[] = [];
}
