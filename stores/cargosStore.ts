import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { collection, doc, setDoc, addDoc } from "firebase/firestore"
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getStorage,
  deleteObject,
} from "firebase/storage"

// utils
import { firebaseAuth, firebaseFirestore, firebaseStorage } from "@/lib/firebase"
import { fixMeInTheFuture } from "@/lib/types"
import { compress } from "@/lib/images"
import firebase from "firebase/compat";
import functions = firebase.functions;
import {prepareSpaces} from "@/components/CargosBlock/helpers/prepareBody";
import {getSpacesOfUnsavedCargo} from "@/stores/helpers/spaces";

export const CARGOS_DB_COLLECTION_NAME: string = 'cargos'

/*
* 0 - The shipment has arrived at the warehouse and is awaiting shipment.
* 1 - Cargo on the way
* 2 - The shipment has arrived at its destination
* 3 - Shipment received by customer
* */
export enum CargosStatusEnum {
  CARGO_WAITING_TO_BE_SEND = 0,
  CARGO_ON_THE_WAY = 1,
  CARGO_HAS_ARRIVED_AT_ITS_DESTINATION = 2,
  CARGO_RECEIVED_BY_CUSTOMER = 3
}
export const CARGO_WAITING_TO_BE_SEND = 0
export const CARGO_ON_THE_WAY = 1
export const CARGO_HAS_ARRIVED_AT_ITS_DESTINATION = 2
export const CARGO_RECEIVED_BY_CUSTOMER = 3

export const statusOptions = [
  {
    text: 'Прибыл на склад в Китае',
    value: CARGO_WAITING_TO_BE_SEND
  },
  {
    text: 'В пути',
    value: CARGO_ON_THE_WAY
  },
  {
    text: 'Прибыл на склад в Украину',
    value: CARGO_HAS_ARRIVED_AT_ITS_DESTINATION
  },
  {
    text: 'Получен клиентом',
    value: CARGO_RECEIVED_BY_CUSTOMER
  },
]

export type cargoFieldNamesType<Type> = {
  [key: string]: {
    label: string,
    value: string,
    defaultValue?: Type
  }
}

export const CARGO_FIELD_NAMES: cargoFieldNamesType<string | number> = {
  CARGO_ID: {
    label: 'Номер отправки',
    value: 'cargoId',
  },
  CLIENT_CODE: {
    label: 'Код клиента',
    value: 'clientCode',
  },
  DISPATCH_NUMBER: {
    label: 'Номер отправки',
    value: 'dispatchNumber',
  },
  NUMBER_OF_SEATS: {
    label: 'Кол-во мест',
    value: 'numberOfSeats',
  },
  STATUS: {
    label: 'Статус',
    value: 'status',
  },
  CARGO_PHOTO: {
    label: 'Фото',
    value: 'cargoPhoto',
  },
  COST_OF_DELIVERY: {
    label: 'Стоимость доставки($)',
    value: 'costOfDelivery',
  },
  CARGO_NAME: {
    label: 'Название груза',
    value: 'cargoName',
  },
  INSURANCE: {
    label: 'Страховка',
    value: 'insurance',
  },
  PIECES_IN_PLACE: {
    label: 'Шт в месте(шт.)',
    value: 'piecesInPlace',
    defaultValue: 0,
  },
  COST: {
    label: 'Стоимость груза',
    value: 'cost',
  },
  SHIPPING_DATE: {
    label: 'Дата отгрузки',
    value: 'shippingDate',
  },
  VOLUME: {
    label: 'Объем',
    value: 'volume',
  },
  WEIGHT: {
    label: 'Вес(кг.)',
    value: 'weight',
    defaultValue: 0,
  },
}

// SPACES PHOTOS data format in DB
export type spacePhotosOfDB = {
  id: string
  photoIndex: number
  url: string
}

// SPACES data format in DB
export type spaceOfDB = {
  id: string
  weight: number
  piecesInPlace: number
  photos: Array<spacePhotosOfDB>
}

// SPACES data format in local state
export type clientIdType = string
export type spaceItemType = {
  id: string,
  clientId: clientIdType,
  cargoId?: string,
  weight: number,
  piecesInPlace: number,
  photos: Array<UploadImageType>
}

export interface CargoInterface {
  status: CargosStatusEnum // Статус
  costOfDelivery: string // Стоимость доставки
  cargoName: string // Название груза
  insurance: number // Страховка
  cost: number // Стоимость
  shippingDate: string // Дата отгрузки
  volume: number // Объем
  weight: number // Вес
}

export type CargoID = string
export type CargoCustomIdentify = string
export type CargoClientCode = string

export interface CargoInterfaceLocalFormat extends CargoInterface {
  spaces: Array<spaceItemType>
}

export interface CargoInterfaceDBFormat extends CargoInterface {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
  id: CargoID // index in DB
}

export interface CargoInterfaceForForm extends CargoInterfaceLocalFormat {
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
}

export interface CargoInterfaceFull extends CargoInterfaceForForm {
  id: CargoID // index in DB
}

export interface AddCargoInterface extends CargoInterface {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
}

export type CargosItems = Array<CargoInterfaceFull>

export interface CargoSavingResponse {
  data: {
    cargoSaving: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentCargo?: CargoInterfaceFull
    }
  }
}

export interface CargoAddResponse {
  data: {
    addingCargo: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentCargo?: CargoInterfaceFull
    }
  }
}

export enum CargoImageStatus {
  FILE_WAS_ALREADY_LOADED = 0, // cargo info was saved
  FILE_JUST_UPLOADED = 1, // new cargo info wasn't saved
}

export const IMAGE_STATUS_FILE_WAS_ALREADY_LOADED = 0
export const IMAGE_STATUS_FILE_JUST_UPLOADED = 1

export enum UploadImageStatus {
  UPLOADING = 0,
  SUCCESS = 1,
  ERROR = -1,
}

export const UPLOAD_IMAGE_STATUS_UPLOADING: UploadImageStatus.UPLOADING = 0
export const UPLOAD_IMAGE_STATUS_SUCCESS: UploadImageStatus.SUCCESS = 1
export const UPLOAD_IMAGE_STATUS_ERROR: UploadImageStatus.ERROR = -1

// state for showing upload images animation
export type UploadImageType = {
  id: string
  // cargoId: string
  status: CargoImageStatus
  uploadStatus: UploadImageStatus
  progress?: number
  isShowProgress: boolean
  spaceIndex: number
  photoIndex: number
  url: string | null
}

export type CargosState = {
  items: CargosItems
  currentItemsList: CargosItems
  currentItem: CargoInterfaceFull | null
  isCurrentItemsListArchive: boolean
  isLoading: boolean
  notLoadedSpaces: Array<spaceItemType>
}

class CargosStore {
  cargos: CargosState = {
    items: [],
    currentItemsList: [],
    notLoadedSpaces: [],
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
      console.log('addDoc', {
        newCargoData, newCargo
      })

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
      console.log(status, typeof status)
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
    console.log({resSetDoc})

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
    this.cargos.notLoadedSpaces = JSON.parse(JSON.stringify(newSpaces))
  }

  addNotLoadedSpaces = (newSpaces: Array<spaceItemType>) => {
    // add new tmp spaces instance
    const newNotLoadedSpaces = [
      ...this.cargos.notLoadedSpaces,
      ...newSpaces
    ]
    this.cargos.notLoadedSpaces = JSON.parse(JSON.stringify(newNotLoadedSpaces))
  }

  clearNotLoadedSpaces = () => {
    this.cargos.notLoadedSpaces = []
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

    const tmpSpaces = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    tmpSpaces.push({...newSpace})
    // const newTmpSpaces = [
    //   ...this.cargos.notLoadedSpaces,
    //   {...newSpace}
    // ]

    console.log('addSpace after', tmpSpaces)
    this.cargos.notLoadedSpaces = tmpSpaces
  }

  updateSpace = ({ id, weight, piecesInPlace }: {
    id: string
    weight?: number
    piecesInPlace?: number
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    const indexOfSpace = spacesTmp.findIndex((space: spaceItemType) => space.id === id)
    const currentSpace = spacesTmp[indexOfSpace]
    if (weight) currentSpace.weight = weight
    else if (piecesInPlace) currentSpace.piecesInPlace = piecesInPlace
    this.cargos.notLoadedSpaces = [...spacesTmp]
  }

  removeSpace = ({ clientId, cargoId, index, isItEditForm }: {
    clientId: string,
    cargoId?: string,
    index: number,
    isItEditForm: boolean
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    console.log('removeSpace', {clientId, cargoId, index})
    const filterCallback = (space: spaceItemType, _index: number) => {
      console.log('removeSpace filterCallback', {
        space,
        '_index !== index': _index !== index,
        'space.clientId === clientId': space.clientId === clientId,
        '(() => isItEditForm ? space.cargoId === cargoId : true)()': (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      })

      return Boolean(
        _index !== index &&
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      )
    }
    const spacesWithoutRemoved = spacesTmp.filter(filterCallback)
    console.log({spacesWithoutRemoved})

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

    this.cargos.notLoadedSpaces = newSpaces
    console.log('removeSpace', {
      now: [...this.cargos.notLoadedSpaces],
      before: spacesTmp,
      newSpaces,
      spacesWithoutRemoved,
    })
  }

  getFileIndex = ({
                    tmpSpaces,
                    // findIndexCurrentSpaceCallback,
                    spaceIndex,
                    acceptedFileIndex
                  }: {
    tmpSpaces: Array<spaceItemType>,
    // findIndexCurrentSpaceCallback: (value: spaceItemType, index: number, obj: spaceItemType[]) => unknown,
    spaceIndex: number,
    acceptedFileIndex: number
  }): number | null => {
    if (tmpSpaces.length > 0) {
      // const indexOfSpaceBeforeSetNewPhoto = getSpaceIndex() // tmpSpaces.findIndex(findIndexCurrentSpaceCallback)
      // console.log('getFileIndex', {indexOfSpaceBeforeSetNewPhoto})
      // if (indexOfSpaceBeforeSetNewPhoto === -1) {
      //   console.warn('not found space for update')
      //   return null
      // }
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

    const tmpSpacesBeforeSetNewPhoto: Array<spaceItemType> = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    console.log('addPhoto spaceInfo args', { spaceInfo, fileInfo }, {tmpSpacesBeforeSetNewPhoto})

    const findIndexSpaceCallback = (space: spaceItemType, index: number) => {
      return Boolean(
        space.clientId === clientId &&
        spaceIndex === index &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)()
      )
    }

    function getIndexOfUnsavedSpace (spaces: Array<spaceItemType>, cargoId: string, clientId: string, spaceIndex: number, isItEditForm: boolean) {
      let _spaceIndex = 0
      let result
      for (let i=0; i<spaces.length; i++) {
        const space = spaces[i]
        if (space?.cargoId) continue
        else if (
          space.clientId === clientId &&
          (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)() &&
          spaceIndex === _spaceIndex
        ) {
          console.log('getIndexOfUnsavedSpaces return ', i)
          result = i
        }
        _spaceIndex += 1
      }

      return result
    }

    function getIndexOsSavedSpace (spaces: Array<spaceItemType>, findIndexCurrentSpaceCallback: (value: spaceItemType, index: number, obj: spaceItemType[]) => unknown) {
      const index: number = spaces.findIndex(findIndexCurrentSpaceCallback)
      return index
    }

    // const _indexOfUnsavedSpaces = getIndexOfUnsavedSpace(tmpSpacesBeforeSetNewPhoto, cargoId, clientId, spaceIndex, isItEditForm)
    // console.log({
    //   _indexOfUnsavedSpaces,
    //   tmpSpacesBeforeSetNewPhoto,
    //   spaceIndex
    // })

    let getSpaceIndex: Function
    if (isItEditForm && cargoId) getSpaceIndex = getIndexOsSavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, findIndexSpaceCallback)
    else if (!isItEditForm && !cargoId) {
      // @ts-ignore
      getSpaceIndex = getIndexOfUnsavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, cargoId, clientId, spaceIndex, isItEditForm)
      if (getSpaceIndex === undefined) {
        console.warn('addPhoto error: getSpaceIndex return undefined')
        return
      }
    }
    else {
      console.warn('addPhoto error: something wrong with cargoId')
      return
    }

    const currentSpaceIndex = getSpaceIndex()
    const newPhotoIndex = this.getFileIndex({
      tmpSpaces: tmpSpacesBeforeSetNewPhoto,
      // findIndexCurrentSpaceCallback: findIndexSpaceCallback,
      spaceIndex: currentSpaceIndex,
      // getSpaceIndex: isItEditForm
      //   ? getIndexOsSavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, findIndexSpaceCallback)
      //   : getIndexOfUnsavedSpace.bind(null, tmpSpacesBeforeSetNewPhoto, cargoId, clientId, spaceIndex, isItEditForm),
      acceptedFileIndex: fileIndex
    })
    console.log(`AddPhoto newPhotoIndex = ${newPhotoIndex}`)
    if (newPhotoIndex === null || newPhotoIndex < 0) {
      console.warn('newPhotoIndex is null or < 0', { newPhotoIndex })
      return
    }

    const uploadCargoImageArgs: {
      fileData: {
        file: File
        metadata: object
      }
      spaceData: {
        spaceIndex: number
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
        spaceIndex: currentSpaceIndex,
        photoIndex: newPhotoIndex,
        clientId,
        isItEditForm,
      }
    }
    if (isItEditForm) uploadCargoImageArgs.spaceData.cargoId = cargoId
    console.log({'addPhoto uploadCargoImageArgs': uploadCargoImageArgs})
    const url: string | null = await this.uploadCargoImage(uploadCargoImageArgs)
    console.log('addPhoto url', url)
    if(!url) return

    const notLoadedSpacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))

    const indexOfSpaceToBeUpdated = getSpaceIndex() //notLoadedSpacesTmp.findIndex(findIndexSpaceCallback)
    if (indexOfSpaceToBeUpdated === -1 || indexOfSpaceToBeUpdated === undefined) {
      console.warn('AddPhoto error: not found indexOfSpaceToBeUpdated')
      return
    }
    // is indexOfSpaceToBeUpdated exists - we was checked from indexOfSpaceBeforeSetNewPhoto

    const findIndexPhotoCallback = (photo: UploadImageType): boolean => photo.photoIndex === newPhotoIndex

    const indexOfPhotoToBeUpdated = notLoadedSpacesTmp[indexOfSpaceToBeUpdated].photos.findIndex(findIndexPhotoCallback)
    if (indexOfPhotoToBeUpdated === -1) {
      console.warn('AddPhoto error: not found photo of space to update')
      return
    }

    notLoadedSpacesTmp[indexOfSpaceToBeUpdated].photos[indexOfPhotoToBeUpdated].url = url
    console.log('addPhoto', {
      notLoadedSpacesTmp,
      nowState: JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    })
    this.cargos.notLoadedSpaces = [...notLoadedSpacesTmp]
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

    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
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
    this.cargos.notLoadedSpaces = spacesWithoutRemovedPhoto
  }

  setUploadImage = ({
                      uploadStatus,
                      spaceIndex,
                      photoIndex,
                      clientId,
                      cargoId,
                      isItEditForm,
                    }: {
    uploadStatus: UploadImageStatus
    spaceIndex: number
    photoIndex: number
    clientId: string
    cargoId?: string
    isItEditForm: boolean
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    console.log('setUploadImage before', spacesTmp)
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
      spaceIndex,
      photoIndex,
      url: null
    }

    const findIndexCallback = (space: spaceItemType, index: number): boolean => {
      console.log('setUploadImage findIndexCallback', {
        'space?.cargoId === undefined': space?.cargoId === undefined,
        'space?.cargoId': space?.cargoId,
      })

      return (
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined)() &&
        spaceIndex === index
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

      this.cargos.notLoadedSpaces = [
        ...spacesTmp,
        newTmpSpaceItem
      ]
    } else {
      this.cargos.notLoadedSpaces[currentSpaceIndex].photos = [
        ...spacesTmp[currentSpaceIndex].photos,
        newUploadImage
      ]
    }

    console.log('setUploadImage after', JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces)))
    return newUploadImage
  }

  updateUploadImage = ({
                         id,
                         spaceIndex,
                         uploadStatus,
                         progress,
                         isShowProgress,
                         url,
                         clientId,
                         cargoId,
                       }: {
    id: string
    spaceIndex: number
    uploadStatus?: UploadImageStatus
    isShowProgress?: boolean
    progress?: number
    url?: string
    clientId: string
    cargoId?: string
    isItEditForm: boolean
  }) => {
    console.log('CargosStore updateUploadImage args', {
      id,
      spaceIndex,
      uploadStatus,
      progress,
      isShowProgress,
      url,
      clientId,
      cargoId,
    })
    const spaces = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces))
    if (!spaces.length) {
      console.warn('this.cargos.notLoadedSpaces is empty')
      return
    }

    const currentSpace = spaces[spaceIndex]
    if (!currentSpace || !currentSpace.photos?.length) {
      console.warn('spaces[spaceIndex] not found')
      return
    }

    const currentImageIndex = currentSpace.photos.findIndex((photo: UploadImageType) => photo.id === id)
    console.log(`updateUploadImage currentImageIndex = ${currentImageIndex}, id = ${id}`, {
      currentSpace,
      spaces,
      spaceIndex
    })

    if (currentImageIndex !== -1) {
      const currentPhoto = {...currentSpace.photos[currentImageIndex]}
      if (uploadStatus !== undefined) currentPhoto.uploadStatus = uploadStatus
      if (progress !== undefined) currentPhoto.progress = progress
      if (url !== undefined) currentPhoto.url = url
      if (isShowProgress !== undefined) currentPhoto.isShowProgress = isShowProgress

      this.cargos.notLoadedSpaces[spaceIndex].photos[currentImageIndex] = { ...currentPhoto }
    } else {
      console.warn(`${Object.keys({currentImageIndex})[0]} not found`)
      return
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
                                spaceIndex,
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
      spaceIndex: number
      photoIndex: number
      clientId: string
      cargoId?: string
      isItEditForm: boolean
    }
  }): Promise<string | null> => {
    const storageRef = await ref(firebaseStorage, `images/${file.name}`)

    const compressedFile = await compress(file, 0.6, 2000, 2000, 1000)

    return new Promise(async (resolve, reject) => {
      if (!compressedFile) reject(null)
      const setUploadImageArgs: {
        uploadStatus: UploadImageStatus
        spaceIndex: number
        photoIndex: number
        clientId: string
        cargoId?: string
        isItEditForm: boolean
      } = {
        uploadStatus: UPLOAD_IMAGE_STATUS_UPLOADING,
        spaceIndex,
        photoIndex,
        clientId,
        isItEditForm,
      }
      if (isItEditForm) setUploadImageArgs.cargoId = cargoId
      console.log({'uploadCargoImage setUploadImageArgs': setUploadImageArgs})
      const newUploadImage = await this.setUploadImage(setUploadImageArgs)
      if (!newUploadImage) {
        console.warn('failed to create a new instance of the image to upload')
        return
      }

      const updateUploadImageArgs: {
        id: string
        spaceIndex: number
        clientId: string
        isItEditForm: boolean
        progress?: number
        uploadStatus?: UploadImageStatus
        cargoId?: string
      } = {
        id: newUploadImage.id,
        clientId,
        isItEditForm,
        spaceIndex,
      }
      if (isItEditForm) updateUploadImageArgs.cargoId = cargoId

      const uploadTask = uploadBytesResumable(storageRef, compressedFile)
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS_UPLOADING
          updateUploadImageArgs.progress = progress
          if (isItEditForm) updateUploadImageArgs.cargoId = cargoId
          this.updateUploadImage(updateUploadImageArgs)
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
            resolve(url)
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

export default new CargosStore()
