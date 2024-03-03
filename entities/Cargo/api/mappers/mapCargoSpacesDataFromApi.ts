import { TSpaceItem, TUploadImage } from '@/entities/Cargo'
import { CargosStore } from "@/entities/Cargo"

type TMapCargoSpacesDataFromApiArgs = {
  spaces: TSpaceItem[],
  clientId: string,
  cargoId: string
}

export const mapCargoSpacesDataFromApi = ({
                                            spaces,
                                            clientId,
                                            cargoId,
                                          }: TMapCargoSpacesDataFromApiArgs): Array<TSpaceItem> => {
  const newTmpSpaceItems: Array<TSpaceItem> = spaces.map((space: TSpaceItem) => {
    const generateItemArgs: {
      clientId: string
      cargoId?: string
      id: string
      photos: Array<TUploadImage>
      weight: number
      volume: number
      cargoName: string
      piecesInPlace: number
    } = {
      id: space.id,
      clientId: clientId,
      cargoId: cargoId,
      photos: space.photos,
      weight: space.weight,
      volume: space.volume,
      cargoName: space.cargoName,
      piecesInPlace: space.piecesInPlace,
    }
    const spaceItem = CargosStore.generateSpaceItem(generateItemArgs)

    return {...spaceItem}
  })

  return newTmpSpaceItems
}
