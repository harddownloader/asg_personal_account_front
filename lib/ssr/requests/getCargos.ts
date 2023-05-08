import { ICargoFull } from "@/stores/cargosStore"
import { fixMeInTheFuture } from "@/lib/types"

export type getAllCargos = {
  cargosRef: fixMeInTheFuture
}

export const getAllCargos = async ({
                               cargosRef
                             }: getAllCargos): Promise<Array<ICargoFull>> => {
  return await cargosRef.get()
    .then((cargos: fixMeInTheFuture) => {
      const cargosList: Array<ICargoFull> = []
      cargos.forEach((cargo: fixMeInTheFuture) => {
        const cargoDecode = {...cargo.data()}
        const cargoData = {
          cargoId: cargoDecode.cargoId,
          clientCode: cargoDecode.clientCode,
          status: cargoDecode.status,
          costOfDelivery: cargoDecode.costOfDelivery,
          cargoName: cargoDecode.cargoName,
          insurance: cargoDecode.insurance,
          cost: cargoDecode.cost,
          tariff: cargoDecode.tariff,
          volume: cargoDecode.volume,
          weight: cargoDecode.weight,
          spaces: cargoDecode.spaces,
          updatedAt: String(new Date(cargoDecode.updatedAt._seconds * 1000)),
          createdAt: String(new Date(cargoDecode.createdAt._seconds * 1000))
        }

        cargosList.push({
          id: cargo.id,
          ...cargoData
        })
      })

      return cargosList
    })
    .catch((err: fixMeInTheFuture) => {
      console.log('Error getting documents', err)
    })
}

export type getCargosByClient = {
  cargosRef: fixMeInTheFuture,
  userCodeId: string,
}

export const getCargosByClient = async ({
                                          cargosRef,
                                          userCodeId
                                        }: getCargosByClient) => {
  return await cargosRef
    .where("clientCode", "==", userCodeId)
    .get()
    .then((cargos: fixMeInTheFuture) => {
      return cargos.docs.map((cargo: fixMeInTheFuture) => {
        const cargoDecode = {...cargo.data()}

        return {
          id: cargo.id,
          cargoId: cargoDecode.cargoId,
          clientCode: cargoDecode.clientCode,
          status: cargoDecode.status,
          costOfDelivery: cargoDecode.costOfDelivery,
          cargoName: cargoDecode.cargoName,
          insurance: cargoDecode.insurance,
          cost: cargoDecode.cost,
          tariff: cargoDecode.tariff,
          volume: cargoDecode.volume,
          weight: cargoDecode.weight,
          spaces: cargoDecode.spaces,
        }
      })
    })
}
