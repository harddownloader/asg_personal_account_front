import { CARGO_STATUS } from './const';

// SPACES PHOTOS data format in DB
export type TPhotoIndex = number;
export type TPhotoUrl = string;
export type TSpacePhotos = {
  // id: string;
  photoIndex: TPhotoIndex;
  url: TPhotoUrl;
}
export type TSpacePhotosDB = TSpacePhotos & {
  _id: string
}

// SPACES data format in DB
export type TWeight = number;
export type TPiecesInPlace = number;
export type TSpace = {
  // id: string;
  weight: TWeight;
  piecesInPlace: TPiecesInPlace;
  photos: Array<TSpacePhotos>;
}
export type TSpaceDB = TSpace & {
  _id: string;
  photos: Array<TSpacePhotosDB>;
}


export type TCargoToneId = string;
export type TClientCode = string;
export type TClientId = string; // Types.ObjectId
export type TCargoStatus = typeof CARGO_STATUS[keyof typeof CARGO_STATUS]; // Статус
export type TCargoCostOfDelivery = number; // Стоимость доставки
// export type TCargoName = string; // Название груза
export type TCargoInsurance = number; // Страховка
export type TCargoCost = number; // Стоимость
export type TCargoTariff = number; // Дата отгрузки
export type TCargoVolume = number; // Объем
export type TCargoWeight = number; // Вес

export type TSpaces = Array<TSpace>;

export interface ICargo {
  _id: string;
  toneId: TCargoToneId;
  clientCode: TClientCode;
  clientId: TClientId;
  status: TCargoStatus;
  costOfDelivery: TCargoCostOfDelivery;
  insurance: TCargoInsurance;
  cost: TCargoCost;
  tariff: TCargoTariff;
  volume: TCargoVolume;
  weight: TCargoWeight;
  spaces: TSpaceDB;
}
