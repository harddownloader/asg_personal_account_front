import { CargoInterfaceFull } from "@/stores/cargosStore"
import { fixMeInTheFuture } from "@/lib/types"

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
          // updatedAt: String(new Date(cargoDecode.lastUpdateDocDate*1000)),
          // createdAt: cargoDecode.createdDocDate,
        }
        cargosList.push({
          id: cargo.id,
          ...cargoData
        })

      //   await console.log({
      //     cargoDecode: {
      //       id: cargo.id,
      //       ...cargoDecode,
      //     }
      //   })
      //
      //
      //   await setTimeout(async () => {
      //     function getRandomInt(max) {
      //       return Math.floor(Math.random() * max);
      //     }
      //     const minusTime = 1000 + getRandomInt(1000)
      //     const aMinuteAgo = new Date( Date.now() - minusTime * 60 );
      //
      //     // await cargosRef.doc(cargo.id).set({
      //     //   ...cargoData,
      //     //   // tariff: '0',
      //     //   createdAt: new Date(),
      //     //   updatedAt: aMinuteAgo,
      //     // })
      //   }, 1000)
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
