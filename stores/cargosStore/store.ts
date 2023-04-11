import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { collection, doc, setDoc, addDoc } from "firebase/firestore"
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
  deleteObject,
} from "firebase/storage"

// utils
import { firebaseAuth, firebaseFirestore, firebaseStorage } from "@/lib/firebase"
import { compress } from "@/lib/images"
import { prepareSpaces } from "@/components/CargosBlock/helpers/prepareBody"
import {
  CargosItems,
  CargosState,
  CARGO_RECEIVED_BY_CUSTOMER,
  uploadCargoImageResType,
  CargoInterfaceFull,
  CargoInterfaceForForm,
  CargoAddResponse,
  AddCargoInterface,
  CARGOS_DB_COLLECTION_NAME,
  CargoInterfaceDBFormat,
  CargoSavingResponse,
  spaceOfDB,
  CARGO_FIELD_NAMES,
  UploadImageType,
  spaceItemType,
  UploadImageStatus,
  IMAGE_STATUS_FILE_JUST_UPLOADED,
  UPLOAD_IMAGE_STATUS_UPLOADING,
  UPLOAD_IMAGE_STATUS_SUCCESS, UPLOAD_IMAGE_STATUS_ERROR
} from "@/stores/cargosStore/types"



export class CargosStore {
  cargos: CargosState = {
    items: [],
    currentItemsList: [],
    notLoadedSpaces: {
      list: [],
      numberOfPhotosCurrentlyBeingUploaded: 0,
    },
    currentItem: null,
    isCurrentItemsListArchive: false,
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  toggleIsCurrentItemsListArchive = (status: boolean) => {
    this.cargos.isCurrentItemsListArchive = status
  }

  setList = (cargos: CargosItems) => {
    this.cargos.items = [...cargos]
  }

  clearList = () => {
    this.cargos.items = []
  }

  clearCurrentItemsList = () => {
    this.cargos.currentItemsList = []
  }

  clearCurrentItem = () => {
    this.cargos.currentItem = null
  }

  setCurrentItemsListByStatus = ({
                                   isArchive,
                                   currentUserCode,
                                 } : {
    isArchive: boolean,
    currentUserCode: string
  }) => {
    this.cargos.isCurrentItemsListArchive = isArchive
    this.cargos.currentItemsList = this.cargos.items.filter((cargo) => {
      return Boolean(
        isArchive
          ? Number(cargo.status) === CARGO_RECEIVED_BY_CUSTOMER
          : Number(cargo.status) !== CARGO_RECEIVED_BY_CUSTOMER
      ) && cargo.clientCode === currentUserCode
    })
  }

  setCurrentItem = (currentItem: CargoInterfaceFull) => {
    this.cargos.currentItem = {...currentItem}
  }

  add = async ({
                 cargoId,
                 clientCode,
                 status,
                 costOfDelivery,
                 cargoName,
                 insurance,
                 cost,
                 shippingDate,
                 volume,
                 weight,
                 spaces,
               }: CargoInterfaceForForm) => {
    const response: CargoAddResponse = {
      data: {
        addingCargo: {
          errors: []
        }
      }
    }

    if (!firebaseAuth?.currentUser?.uid) {
      response.data.addingCargo.errors.push({
        field: 'client',
        message: `firebaseAuth?.currentUser?.uid, is not a found`
      })

      return response
    }

    this.cargos.isLoading = true
    const newCargoData: AddCargoInterface = {
      cargoId,
      clientCode,
      status,
      costOfDelivery,
      cargoName,
      insurance,
      cost,
      shippingDate,
      volume,
      weight,
      spaces: prepareSpaces(spaces),
    }
    await addDoc(
      collection(firebaseFirestore, CARGOS_DB_COLLECTION_NAME),
      newCargoData
    ).then((Doc) => {
      const newCargo = {
        ...newCargoData,
        spaces: spaces,
        id: Doc.id
      }

      // add to all cargos
      this.cargos.items = [
        ...this.cargos.items,
        newCargo
      ]

      // add for current cargo list
      if ((
        this.cargos.isCurrentItemsListArchive &&
        status === CARGO_RECEIVED_BY_CUSTOMER
      ) || (
        !this.cargos.isCurrentItemsListArchive &&
        status !== CARGO_RECEIVED_BY_CUSTOMER
      )) this.cargos.currentItemsList = [
        ...this.cargos.currentItemsList,
        newCargo
      ]

      // set as current item in info block
      this.cargos.currentItem = newCargo
    }).catch((e) => {
      console.error('addDoc(collection(firebaseFirestore, \'cargos\')')
    }).finally(() => {
      this.cargos.isLoading = false
    })

    return response
  }

  update = async ({
                    cargoId,
                    clientCode,
                    status,
                    costOfDelivery,
                    cargoName,
                    insurance,
                    cost,
                    shippingDate,
                    volume,
                    weight,
                    id,
                    spaces,
                  }: CargoInterfaceDBFormat) => {
    const response: CargoSavingResponse = {
      data: {
        cargoSaving: {
          errors: []
        }
      }
    }

    if (!cargoId || cargoId.length <= 2) {
      response.data.cargoSaving.errors.push({
        field: 'cargoId',
        message: `Не корректный номер отправки`
      })
    }

    if (!clientCode || clientCode.length < 2) {
      response.data.cargoSaving.errors.push({
        field: 'clientCode',
        message: `Не корректный код клиента`
      })
    }

    if (status === null || status === undefined || Number(status) < 0) {
      response.data.cargoSaving.errors.push({
        field: 'status',
        message: `Не корректный статус`
      })
    }

    if (!costOfDelivery || costOfDelivery.length < 0) {
      response.data.cargoSaving.errors.push({
        field: 'costOfDelivery',
        message: `Не корректная стоимость доставки`
      })
    }

    if (!cargoName || cargoName.length < 2) {
      response.data.cargoSaving.errors.push({
        field: 'cargoName',
        message: `Не корректное название груза`
      })
    }

    if (!insurance || Number(insurance) < 0) {
      response.data.cargoSaving.errors.push({
        field: 'insurance',
        message: `Не корректная страховка`
      })
    }

    if (!cost || Number(cost) < 0) {
      response.data.cargoSaving.errors.push({
        field: 'cost',
        message: `Не корректная стоимость`
      })
    }

    if (!shippingDate || shippingDate.length < 4) {
      response.data.cargoSaving.errors.push({
        field: 'shippingDate',
        message: `Не корректный номер отправки`
      })
    }

    if (!id || id.length < 2) {
      response.data.cargoSaving.errors.push({
        field: 'client',
        message: `Что то пошло не так. Попробуейте перезагрузить страницу и повторить.`
      })
    }

    if (spaces.length && cargoId.length >= 2) {
      enum spacePropertiesEnum {
        weight='weight',
        piecesInPlace='piecesInPlace'
      }
      const checkSpaceFieldIsValid = (spaces: Array<spaceOfDB>, property: spacePropertiesEnum): {
        isPropertyValid: boolean,
        spaceIndex: number
      } => {
        const findIndexCallback = (space: spaceOfDB) => {
          const value = space?.[`${property}`]
          const valueNumber = Number(value)

          return (value === null || isNaN(valueNumber) || valueNumber < 0)
        }
        const spaceIndex = spaces.findIndex(findIndexCallback)

        return {
          isPropertyValid: spaceIndex !== -1 ? true : false,
          spaceIndex: spaceIndex
        }
      }

      const weightChecks = checkSpaceFieldIsValid(spaces, spacePropertiesEnum['weight'])
      const piecesInPlaceChecks = checkSpaceFieldIsValid(spaces, spacePropertiesEnum['piecesInPlace'])
      if (weightChecks.isPropertyValid) {
        response.data.cargoSaving.errors.push({
          field: `spaces.${weightChecks.spaceIndex}.${CARGO_FIELD_NAMES.WEIGHT.value}`,
          message: `Не корректный вес места`
        })
      }

      if (piecesInPlaceChecks.isPropertyValid) {
        response.data.cargoSaving.errors.push({
          field: `spaces.${piecesInPlaceChecks.spaceIndex}.${CARGO_FIELD_NAMES.PIECES_IN_PLACE.value}`,
          message: `Не корректное количество шт. в месте`
        })
      }
    }

    if (response.data.cargoSaving.errors.length) {
      return response
    }

    this.cargos.isLoading = true

    const cargosRef = await doc(firebaseFirestore, CARGOS_DB_COLLECTION_NAME, id)
    const newCargoData: CargoInterfaceDBFormat = {
      id,
      cargoId,
      clientCode,
      status,
      costOfDelivery,
      cargoName,
      insurance,
      cost,
      shippingDate,
      volume,
      weight,
      spaces
    }
    const resSetDoc = await setDoc(
      cargosRef,
      newCargoData,
      { merge: false }
    ).then((docRef) => {
      console.log("Document written with ID: ", docRef)

      const cargosTmp = JSON.parse(JSON.stringify(this.cargos.items))
      const currentCargoIndex = cargosTmp.findIndex((cargo: CargoInterfaceFull) => cargo.id === id)
      cargosTmp[currentCargoIndex] = { ...newCargoData }
      this.cargos.items = cargosTmp

      // add/edit/delete from current cargo list
      const currCargoInItemsList = this.cargos.currentItemsList.findIndex((cargo) => cargo.id === id)
      if (
        currCargoInItemsList !== -1 &&
        (
          this.cargos.isCurrentItemsListArchive &&
          status === CARGO_RECEIVED_BY_CUSTOMER
        ) || (
          !this.cargos.isCurrentItemsListArchive &&
          status !== CARGO_RECEIVED_BY_CUSTOMER
        )
      ) {
        const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

        currItemsListTmp.splice(currCargoInItemsList, 1, newCargoData)
        this.cargos.currentItemsList = [...currItemsListTmp]
      } else if (currCargoInItemsList !== -1) {
        const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

        currItemsListTmp.splice(currCargoInItemsList, 1)
        this.cargos.currentItemsList = [...currItemsListTmp]
      } else {
        console.error('Something went wrong in add/edit/delete from current cargo list logic')
      }

      return docRef
    }).catch((error) => {
      console.error("Error adding user document: ", error)
      response.data.cargoSaving.errors.push({
        field: 'server',
        message: `addDoc was failed, error: ${error}`
      })

      return response
    }).finally(() => {
      this.cargos.isLoading = false
    })

    return response
  }

  // SPACES
  generateSpaceItem = ({ clientId, cargoId, photos, id, weight, piecesInPlace }: {
    clientId: string
    cargoId?: string
    id?: string
    photos?: Array<UploadImageType>
    weight?: number
    piecesInPlace?: number
  }): spaceItemType => {
    const newSpace: spaceItemType = {
      id: id ? id : uuidv4(),
      clientId,
      weight: typeof weight === 'number' ? weight : Number(CARGO_FIELD_NAMES.WEIGHT.defaultValue),
      piecesInPlace: typeof piecesInPlace === 'number' ? piecesInPlace : Number(CARGO_FIELD_NAMES.PIECES_IN_PLACE.defaultValue),
      photos: (Array.isArray(photos) && photos.length) ? photos : [],
    }
    if (cargoId) newSpace.cargoId = cargoId

    return newSpace
  }

  initNotLoadedSpaces = (newSpaces: Array<spaceItemType>) => {
    this.cargos.notLoadedSpaces.list = JSON.parse(JSON.stringify(newSpaces))
  }

  addNotLoadedSpaces = (newSpaces: Array<spaceItemType>) => {
    // add new tmp spaces instance
    const newNotLoadedSpaces = [
      ...this.cargos.notLoadedSpaces.list,
      ...newSpaces
    ]
    this.cargos.notLoadedSpaces.list = JSON.parse(JSON.stringify(newNotLoadedSpaces))
  }

  clearNotLoadedSpaces = () => {
    this.cargos.notLoadedSpaces.list = []
  }

  addSpace = ({ clientId, cargoId, newSpaceItem }: {
    clientId: string
    cargoId?: string
    newSpaceItem?: spaceItemType
  }) => {
    const newSpace = (() => {
      if (newSpaceItem) {
        return newSpaceItem
      }

      const generateItemArgs: {
        clientId: string,
        cargoId?: string
      } = { clientId }
      if (cargoId) generateItemArgs.cargoId = cargoId

      return this.generateSpaceItem(generateItemArgs)
    })()

    const tmpSpaces = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    tmpSpaces.push({...newSpace})
    this.cargos.notLoadedSpaces.list = tmpSpaces
  }

  updateSpace = ({ id, weight, piecesInPlace }: {
    id: string
    weight?: number
    piecesInPlace?: number
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const indexOfSpace = spacesTmp.findIndex((space: spaceItemType) => space.id === id)
    const currentSpace = spacesTmp[indexOfSpace]
    if (weight) currentSpace.weight = weight
    else if (piecesInPlace) currentSpace.piecesInPlace = piecesInPlace
    this.cargos.notLoadedSpaces.list = [...spacesTmp]
  }

  removeSpace = ({ clientId, cargoId, index, isItEditForm }: {
    clientId: string,
    cargoId?: string,
    index: number,
    isItEditForm: boolean
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const filterCallback = (space: spaceItemType, _index: number) => {
      return Boolean(
        _index !== index &&
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      )
    }
    const spacesWithoutRemoved = spacesTmp.filter(filterCallback)

    const newSpaces = spacesWithoutRemoved.map((space: spaceItemType) => {
      if (
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)() &&
        space.photos.length
      ) {
        const photosWithNewIndexes = space.photos.map((photo: UploadImageType) => ({
          ...photo,
          spaceIndex: photo.spaceIndex > index ? photo.spaceIndex - 1 : photo.spaceIndex
        }))
        return {
          ...space,
          photos: photosWithNewIndexes
        }
      } else {
        return space
      }
    })

    this.cargos.notLoadedSpaces.list = newSpaces
  }

  getFileIndex = ({
                    tmpSpaces,
                    spaceIndex,
                    acceptedFileIndex
                  }: {
    tmpSpaces: Array<spaceItemType>,
    spaceIndex: number,
    acceptedFileIndex: number
  }): number | null => {
    if (tmpSpaces.length > 0) {
      const photosLengthBeforeSetNewPhoto = tmpSpaces[spaceIndex]?.photos?.length

      if (photosLengthBeforeSetNewPhoto === null) {
        console.warn('tmpSpaces[indexOfSpaceBeforeSetNewPhoto].photos.length is null')
        return 0
      }

      if ( // if it isn't first photo
        Number.isInteger(photosLengthBeforeSetNewPhoto) &&
        photosLengthBeforeSetNewPhoto > 0
      ) {
        return photosLengthBeforeSetNewPhoto + acceptedFileIndex
      } else if ( // if its first photos for space - user uploaded few photos
        Number.isInteger(photosLengthBeforeSetNewPhoto) &&
        photosLengthBeforeSetNewPhoto === 0 &&
        acceptedFileIndex > 0
      ) {
        return acceptedFileIndex
      } else { // if its first photo - user uploaded a picture
        return 0
      }
    } else {
      console.warn('getFileIndex: something went wrong, places(tmpSpaces.length) not found')
      return 0
    }
  }

  increaseUploadingFiles = () => {
    this.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded += 1
  }

  decreaseUploadingFiles = () => {
    this.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded -= 1
  }

  resetUploadFiles = () => {
    this.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded = 0
  }

  addPhoto = async (
    spaceInfo: {
      spaceIndex: number
      clientId: string
      cargoId?: string
      isItEditForm: boolean
    },
    fileInfo: {
      file: File
      metadata: object
      fileIndex: number
    }
  ): Promise<void> => {
    const { spaceIndex, clientId, cargoId, isItEditForm } = spaceInfo
    const {
      file,
      metadata,
      fileIndex
    } = fileInfo

    this.increaseUploadingFiles()

    const tmpSpacesBeforeSetNewPhoto: Array<spaceItemType> = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))

    const findIndexSpaceCallback = (space: spaceItemType, index: number) => {
      return Boolean(
        space.clientId === clientId &&
        spaceIndex === index &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      )
    }

    function getIndexOfUnsavedSpace (
      spaces: Array<spaceItemType>,
      cargoId: string,
      clientId: string,
      spaceIndex: number,
    ) {

      let _spaceIndex = 0
      let result
      for (let i=0; i<spaces.length; i++) {
        const space = spaces[i]
        if (space?.cargoId) continue
        else if (
          space.clientId === clientId &&
          spaceIndex === _spaceIndex
        ) {
          result = i
        }
        _spaceIndex += 1
      }

      return result
    }

    function getIndexOfSavedSpace (spaces: Array<spaceItemType>, findIndexCurrentSpaceCallback: (value: spaceItemType, index: number, obj: spaceItemType[]) => unknown) {
      const index: number = spaces.findIndex(findIndexCurrentSpaceCallback)
      return index
    }

    let getSpaceIndex: Function
    if (isItEditForm && cargoId) getSpaceIndex = getIndexOfSavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, findIndexSpaceCallback)
    else if (!isItEditForm && !cargoId) {
      // @ts-ignore
      getSpaceIndex = getIndexOfUnsavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, cargoId, clientId, spaceIndex)
      if (getSpaceIndex === undefined) {
        console.warn('addPhoto error: getSpaceIndex return undefined')
        this.resetUploadFiles()

        return
      }
    }
    else {
      console.warn('addPhoto error: something wrong with cargoId')
      this.resetUploadFiles()

      return
    }

    const currentSpaceIndex = getSpaceIndex()
    const newPhotoIndex = this.getFileIndex({
      tmpSpaces: tmpSpacesBeforeSetNewPhoto,
      spaceIndex: currentSpaceIndex,
      acceptedFileIndex: fileIndex
    })
    if (newPhotoIndex === null || newPhotoIndex < 0) {
      console.warn('newPhotoIndex is null or < 0', { newPhotoIndex })
      this.resetUploadFiles()

      return
    }

    const uploadCargoImageArgs: {
      fileData: {
        file: File
        metadata: object
      }
      spaceData: {
        spaceIndexOfState: number
        spaceIndexOfForm: number
        photoIndex: number
        clientId: string
        cargoId?: string
        isItEditForm: boolean
      }
    } = {
      fileData: {
        file,
        metadata: {}
      },
      spaceData: {
        spaceIndexOfState: currentSpaceIndex,
        spaceIndexOfForm: spaceIndex,
        photoIndex: newPhotoIndex,
        clientId,
        isItEditForm,
      }
    }
    if (isItEditForm) uploadCargoImageArgs.spaceData.cargoId = cargoId

    const uploadCargoImageRes: uploadCargoImageResType = await this.uploadCargoImage(uploadCargoImageArgs)
    const url = uploadCargoImageRes?.url
    console.log('addPhoto url', url)
    if (!url) {
      this.resetUploadFiles()

      return
    }

    const notLoadedSpacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))

    const indexOfSpaceToBeUpdated = getSpaceIndex()
    if (indexOfSpaceToBeUpdated === -1 || indexOfSpaceToBeUpdated === undefined) {
      console.warn('AddPhoto error: not found indexOfSpaceToBeUpdated')
      this.resetUploadFiles()

      return
    }

    // is indexOfSpaceToBeUpdated exists - we was checked from indexOfSpaceBeforeSetNewPhoto

    const findIndexPhotoCallback = (photo: UploadImageType): boolean => photo.photoIndex === newPhotoIndex

    const indexOfPhotoToBeUpdated = notLoadedSpacesTmp[indexOfSpaceToBeUpdated].photos.findIndex(findIndexPhotoCallback)
    if (indexOfPhotoToBeUpdated === -1) {
      console.warn('AddPhoto error: not found photo of space to update')
      this.resetUploadFiles()

      return
    }

    notLoadedSpacesTmp[indexOfSpaceToBeUpdated].photos[indexOfPhotoToBeUpdated].url = url
    this.cargos.notLoadedSpaces.list = [...notLoadedSpacesTmp]

    this.decreaseUploadingFiles()
  }

  removePhoto = (
    spaceInfo: {
      spaceIndex: number,
      clientId: string,
      cargoId?: string,
      isItEditForm: boolean,
    }, photoIndex: number) => {
    const { spaceIndex, clientId, cargoId, isItEditForm } = spaceInfo
    console.log('removePhoto', {
      ...spaceInfo,
      spaceIndex,
      photoIndex
    })
    // CargosStore.deleteCargoImage()

    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const spacesWithoutRemovedPhoto = spacesTmp.map((space: spaceItemType, _space_index: number) => {
      if (
        space.clientId === clientId &&
        spaceIndex === _space_index &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      ) {
        const photos = space.photos.filter((photo: UploadImageType, _photo_index: number) => photoIndex !== _photo_index)
        const photosWithUpdatedIndexes = photos.map((photo) => {
          if (photo.photoIndex > photoIndex) photo.photoIndex -= 1

          return photo
        })
        space.photos = photosWithUpdatedIndexes

        return space
      } else return space
    })
    this.cargos.notLoadedSpaces.list = spacesWithoutRemovedPhoto
  }

  setUploadImage = ({
                      uploadStatus,
                      spaceIndexOfState,
                      spaceIndexOfForm,
                      photoIndex,
                      clientId,
                      cargoId,
                      isItEditForm,
                    }: {
    uploadStatus: UploadImageStatus
    spaceIndexOfState: number
    spaceIndexOfForm: number
    photoIndex: number
    clientId: string
    cargoId?: string
    isItEditForm: boolean
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    if (isItEditForm && this.cargos?.currentItem === null) {
      console.warn('isItEditForm is true, but this.cargos.currentItem.id not found')
      return
    }

    const newUploadImage: UploadImageType = {
      id: uuidv4(),
      status: IMAGE_STATUS_FILE_JUST_UPLOADED,
      uploadStatus,
      progress: 0,
      isShowProgress: true,
      spaceIndex: isItEditForm ? spaceIndexOfState : spaceIndexOfForm,
      photoIndex,
      url: null
    }

    const findIndexCallback = (space: spaceItemType, index: number): boolean => {
      return (
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)() &&
        spaceIndexOfState === index
      )
    }
    const currentSpaceIndex = spacesTmp.findIndex(findIndexCallback)
    if (currentSpaceIndex === -1) {
      const newTmpSpaceItem: spaceItemType = {
        id: uuidv4(),
        clientId,
        weight: Number(CARGO_FIELD_NAMES.WEIGHT.defaultValue),
        piecesInPlace: Number(CARGO_FIELD_NAMES.PIECES_IN_PLACE.defaultValue),
        photos: [newUploadImage]
      }
      if (isItEditForm) newTmpSpaceItem.cargoId = cargoId

      this.cargos.notLoadedSpaces.list = [
        ...spacesTmp,
        newTmpSpaceItem
      ]
    } else {
      this.cargos.notLoadedSpaces.list[currentSpaceIndex].photos = [
        ...spacesTmp[currentSpaceIndex].photos,
        newUploadImage
      ]
    }

    return newUploadImage
  }

  updateUploadImage = ({
                         id,
                         spaceIndexOfState,
                         spaceIndexOfForm,
                         uploadStatus,
                         progress,
                         isShowProgress,
                         url,
                         clientId,
                         cargoId,
                       }: {
    id: string
    spaceIndexOfState: number
    spaceIndexOfForm: number
    uploadStatus?: UploadImageStatus
    isShowProgress?: boolean
    progress?: number
    url?: string
    clientId: string
    cargoId?: string
    isItEditForm: boolean
  }) => {
    const spaces = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    if (!spaces.length) {
      console.warn('this.cargos.notLoadedSpaces.list is empty')

      return null // kill all downloads
    }

    const currentSpace = spaces[spaceIndexOfState]
    if (!currentSpace || !currentSpace.photos?.length) {
      console.warn('spaces[spaceIndex] not found')

      return null // kill all downloads
    }

    const currentImageIndex = currentSpace.photos.findIndex((photo: UploadImageType) => photo.id === id)

    if (currentImageIndex !== -1) {
      const currentPhoto = {...currentSpace.photos[currentImageIndex]}
      if (uploadStatus !== undefined) currentPhoto.uploadStatus = uploadStatus
      if (progress !== undefined) currentPhoto.progress = progress
      if (url !== undefined) currentPhoto.url = url
      if (isShowProgress !== undefined) currentPhoto.isShowProgress = isShowProgress

      this.cargos.notLoadedSpaces.list[spaceIndexOfState].photos[currentImageIndex] = { ...currentPhoto }
    } else {
      console.warn(`${Object.keys({currentImageIndex})[0]} not found`)

      return null // kill all downloads
    }
  }

  hideUploadImageProgress = (id: string) => {

  }

  uploadCargoImage = async ({
                              fileData: {
                                file,
                                metadata={},
                              },
                              spaceData: {
                                spaceIndexOfState,
                                spaceIndexOfForm,
                                photoIndex,
                                clientId,
                                cargoId,
                                isItEditForm,
                              }
                            }: {
    fileData: {
      file: File
      metadata: object
    },
    spaceData: {
      spaceIndexOfState: number
      spaceIndexOfForm: number
      photoIndex: number
      clientId: string
      cargoId?: string
      isItEditForm: boolean
    }
  }): Promise<uploadCargoImageResType> => {
    const storageRef = await ref(firebaseStorage, `images/${file.name}`)

    const compressedFile = await compress(file, 0.6, 2000, 2000, 1000)

    return new Promise(async (resolve, reject) => {
      if (!compressedFile) reject(null)
      const setUploadImageArgs: {
        uploadStatus: UploadImageStatus
        spaceIndexOfState: number
        spaceIndexOfForm: number
        photoIndex: number
        clientId: string
        cargoId?: string
        isItEditForm: boolean
      } = {
        uploadStatus: UPLOAD_IMAGE_STATUS_UPLOADING,
        spaceIndexOfState,
        spaceIndexOfForm,
        photoIndex,
        clientId,
        isItEditForm,
      }
      if (isItEditForm) setUploadImageArgs.cargoId = cargoId
      const newUploadImage = await this.setUploadImage(setUploadImageArgs)
      if (!newUploadImage) {
        console.warn('failed to create a new instance of the image to upload')
        return null
      }

      const updateUploadImageArgs: {
        id: string
        spaceIndexOfState: number
        spaceIndexOfForm: number
        clientId: string
        isItEditForm: boolean
        progress?: number
        uploadStatus?: UploadImageStatus
        cargoId?: string
      } = {
        id: newUploadImage.id,
        clientId,
        isItEditForm,
        spaceIndexOfState,
        spaceIndexOfForm,
      }
      if (isItEditForm) updateUploadImageArgs.cargoId = cargoId

      const uploadTask = uploadBytesResumable(storageRef, compressedFile)
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS_UPLOADING
          updateUploadImageArgs.progress = progress
          if (isItEditForm) updateUploadImageArgs.cargoId = cargoId
          const updatingImageStatus = this.updateUploadImage(updateUploadImageArgs)

          if (updatingImageStatus === null) {
            console.warn('there was an update on incorrect indexes: updateUploadImage returned null')

            return null
          }

          console.log('Upload is ' + progress + '% done')
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error(`uploadBytes error: ${error}`)
          reject(null)

          return null
        },
        async () => {
          return await getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS_SUCCESS
            this.updateUploadImage(updateUploadImageArgs)
            // resolve(url)
            resolve({
              id: newUploadImage.id,
              url
            })

            return url
          }).catch((error) => {
            console.error(`uploadBytes error: ${error}`)
            updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS_ERROR
            this.updateUploadImage(updateUploadImageArgs)
            reject(null)

            return null
          })
        }
      )
    })
  }

  deleteCargoImage = async (pathToImage: string) => {
    const storage = getStorage()
    // Create a reference to the file to delete
    const desertRef = ref(storage, pathToImage)

    // Delete the file
    deleteObject(desertRef).then(() => {
      // File deleted successfully
      console.log('image was delete')
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.error('deleteObject return error:', error)
    })
  }

  clearAll = () => {
    this.clearNotLoadedSpaces()
    this.clearCurrentItemsList()
    this.clearCurrentItem()
    this.clearList()
  }
}

// export default new CargosStore()
