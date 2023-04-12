import {
  spaceItemType,
  spaceOfDB,
  spacePhotosOfDB,
  UPLOAD_IMAGE_STATUS
} from "@/stores/cargosStore"

export const prepareSpaces = (spaces: Array<spaceItemType>): Array<spaceOfDB> => {
  const spacesForDB: Array<spaceOfDB> = spaces.map((space) => {
    const photos: Array<spacePhotosOfDB> = []
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
      piecesInPlace: Number(space.piecesInPlace),
      photos: photos,
    }
  })

  return spacesForDB
}
