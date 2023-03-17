import {CargoInterfaceFull} from "@/stores/cargosStore"
import {fixMeInTheFuture} from "@/lib/types"

export type getAllCargos = {
  cargosRef: fixMeInTheFuture
}

export const getAllCargos = async ({
                               cargosRef
                             }: getAllCargos): Promise<Array<CargoInterfaceFull>> => {
  return await cargosRef.get()
    .then((cargos: fixMeInTheFuture) => {
      const cargosList: Array<CargoInterfaceFull> = []
      cargos.forEach((cargo: fixMeInTheFuture) => {
        const cargoDecode = {...cargo.data()}
        cargosList.push({
          id: cargo.id,
          cargoId: cargoDecode.cargoId,
          clientCode: cargoDecode.clientCode,
          status: cargoDecode.status,
          costOfDelivery: cargoDecode.costOfDelivery,
          cargoName: cargoDecode.cargoName,
          insurance: cargoDecode.insurance,
          cost: cargoDecode.cost,
          shippingDate: cargoDecode.shippingDate,
          volume: cargoDecode.volume,
          weight: cargoDecode.weight,
          spaces: cargoDecode.spaces,
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
          shippingDate: cargoDecode.shippingDate,
          volume: cargoDecode.volume,
          weight: cargoDecode.weight
        }
      })
    })
}
