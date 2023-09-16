import * as Sentry from "@sentry/nextjs"
import { ICargoFull } from "@/entities/Cargo"

type TCreateAtProp = 'createdAt'
type TUpdateAtProp = 'updatedAt'
const CREATE_AT: TCreateAtProp = 'createdAt' as const
const UPDATE_AT: TUpdateAtProp = 'updatedAt' as const

/*
* convert cargo data from backend to frontend entity format
* */
export const mapCargoDataFromApi = (cargoDB: Object) => {
  const cargo: ICargoFull = {
    id: '',
    cargoId: '',
    clientCode: '',
    clientId: '',
    status: 0,
    costOfDelivery: 0,
    insurance: 0,
    cost: 0,
    tariff: 0,
    volume: 0,
    weight: 0,
    spaces: [],
    [CREATE_AT]: '',
    [UPDATE_AT]: ''
  }

  for (let prop of Object.keys(cargo)) {
    // check - is needed prop exists?
    if (Object.keys(cargoDB).includes(prop)) {
      /*
      * here we can implement some additional checks of props
      * */

      // @ts-ignore // check - match by type
      if (typeof cargo[`${prop}`] === typeof cargoDB[`${prop}`] || cargo[`${prop}`] === null) cargo[`${prop}`] = cargoDB[`${prop}`]
      else Sentry.captureMessage(`spreadCargoEntity Custom Error: '${prop}' in cargoDB(${cargoDB}) has a strange type, typeof prop=${typeof prop}`);

    } else {
      Sentry.captureMessage(`spreadCargoEntity Custom Error: not found '${prop}' in cargoDB(${cargoDB}), typeof cargoDB=${typeof cargoDB}`);
    }
  }

  return cargo
}
