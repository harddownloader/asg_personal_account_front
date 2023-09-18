import { UPLOAD_IMAGE_STATUS } from "@/entities/Cargo"
import type {
  TSpaceItem,
  TSpaceOfDB,
  TSpacePhotosOfDB,
} from '@/entities/Cargo'

export const prepareSpaces = (spaces: Array<TSpaceItem>): Array<TSpaceOfDB> => {
  const spacesForDB: Array<TSpaceOfDB> = spaces.map((space) => {
    const photos: Array<TSpacePhotosOfDB> = []
    space.photos.forEach((photo) => {
      if (
        photo.url !== null &&
        (() => Number.isInteger(photo?.uploadStatus) ? photo.uploadStatus === UPLOAD_IMAGE_STATUS.SUCCESS : true)()
      ) photos.push({
        id: photo.id,
        photoIndex: Number(photo.photoIndex),
        url: photo.url
      })
    })

    return {
      id: space.id,
      weight: Number(space.weight),
      volume: Number(space.volume),
      piecesInPlace: Number(space.piecesInPlace),
      cargoName: space.cargoName,
      photos: photos,
    }
  })

  return spacesForDB
}
