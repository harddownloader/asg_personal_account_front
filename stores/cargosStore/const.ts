import { cargoFieldNamesType } from "@/stores/cargosStore/types"

export const CARGOS_DB_COLLECTION_NAME: string = 'cargos' as const

/*
* 0 - The shipment has arrived at the warehouse and is awaiting shipment.
* 1 - Cargo on the way
* 2 - The shipment has arrived at its destination
* 3 - Shipment received by customer
* */
export const CARGO_STATUS = {
  CARGO_WAITING_TO_BE_SEND: 0,
  CARGO_ON_THE_WAY: 1,
  CARGO_HAS_ARRIVED_AT_ITS_DESTINATION: 2,
  CARGO_RECEIVED_BY_CUSTOMER: 3
} as const

export const STATUS_OPTIONS = [
  {
    text: 'Прибыл на склад в Китае',
    value: CARGO_STATUS.CARGO_WAITING_TO_BE_SEND
  },
  {
    text: 'В пути',
    value: CARGO_STATUS.CARGO_ON_THE_WAY
  },
  {
    text: 'Прибыл на склад в Украину',
    value: CARGO_STATUS.CARGO_HAS_ARRIVED_AT_ITS_DESTINATION
  },
  {
    text: 'Получен клиентом',
    value: CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER
  },
] as const


export const CARGO_FIELD_NAMES: cargoFieldNamesType<string | number> = {
  CARGO_ID: {
    label: 'Номер отправки',
    value: 'cargoId',
  },
  CLIENT_CODE: {
    label: 'Код клиента',
    value: 'clientCode',
  },
  DISPATCH_NUMBER: {
    label: 'Номер отправки',
    value: 'dispatchNumber',
  },
  NUMBER_OF_SEATS: {
    label: 'Кол-во мест',
    value: 'numberOfSeats',
  },
  STATUS: {
    label: 'Статус',
    value: 'status',
  },
  CARGO_PHOTO: {
    label: 'Фото',
    value: 'cargoPhoto',
  },
  COST_OF_DELIVERY: {
    label: 'Стоимость доставки($)',
    value: 'costOfDelivery',
  },
  CARGO_NAME: {
    label: 'Название груза',
    value: 'cargoName',
  },
  INSURANCE: {
    label: 'Страховка',
    value: 'insurance',
  },
  PIECES_IN_PLACE: {
    label: 'Шт в месте(шт.)',
    value: 'piecesInPlace',
    defaultValue: 0,
  },
  COST: {
    label: 'Стоимость груза',
    value: 'cost',
  },
  SHIPPING_DATE: {
    label: 'Дата отгрузки',
    value: 'shippingDate',
  },
  VOLUME: {
    label: 'Объем',
    value: 'volume',
  },
  WEIGHT: {
    label: 'Вес(кг.)',
    value: 'weight',
    defaultValue: 0,
  },
} as const

export const CARGO_IMAGE_STATUS = {
  FILE_WAS_ALREADY_LOADED: 0, // cargo info was saved
  FILE_JUST_UPLOADED: 1, // new cargo info wasn't saved
} as const

export const UPLOAD_IMAGE_STATUS = {
  UPLOADING: 0,
  SUCCESS: 1,
  ERROR: -1,
} as const