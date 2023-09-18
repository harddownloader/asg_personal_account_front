import type { TUserId } from "@/entities/User"
import type { TCargoID, TSpaceItem } from "@/entities/Cargo"

export const getSpacesOfUnsavedCargo = ({
                                          spaces,
                                          clientId,
                                        }: {
  spaces: Array<TSpaceItem>,
  clientId: TUserId
}): TSpaceItem[] => {
  if (!clientId) {
    console.trace('getSpacesOfUnsavedCargo: Not found clientId')
    return []
  }

  return spaces.filter((space: TSpaceItem): boolean => {
    return (
      space.clientId === clientId &&
      space?.cargoId === undefined
    )
  })
}

export const getSpacesOfExistsCargo = ({
                                         spaces,
                                         clientId,
                                         cargoId,
                                       }: {
  spaces: Array<TSpaceItem>,
  clientId: TUserId,
  cargoId: TCargoID
}) => {
  if (!clientId) {
    console.trace(`getSpacesOfExistsCargo: Not found clientId:${typeof clientId}, (isNull:${Boolean(clientId === null)})`)
    return []
  }
  if (!cargoId) {
    console.trace(`getSpacesOfExistsCargo: Not found cargoId:${typeof cargoId}, (isNull:${Boolean(cargoId === null)})`)
    return []
  }

  const filterCallback = (space: TSpaceItem): boolean => {
    return (
      space.clientId === clientId &&
      space.cargoId === cargoId
    )
  }

  return spaces.filter(filterCallback)
}
