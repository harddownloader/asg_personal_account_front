import { spaceItemType } from "@/stores/cargosStore"
import { UserIdType } from "@/stores/userStore"

export const getSpacesOfUnsavedCargo = (spaces: Array<spaceItemType>, clientId: UserIdType) => {
  return spaces.filter((space: spaceItemType): boolean => {
    return (
      space.clientId === clientId &&
      space?.cargoId === undefined
    )
  })
}
