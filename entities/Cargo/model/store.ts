import { action, makeObservable, observable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
  deleteObject
} from 'firebase/storage'
import * as Sentry from '@sentry/nextjs'

// shared
import { getSortedCurrentItemsListByDate } from '@/shared/lib/arrays/sorting'
import { compress } from '@/shared/lib/images'
import { prepareSpaces } from '@/widgets/CargosBlock/helpers/prepareBody'
import { getCookies } from '@/shared/lib/cookies'

// helpers
import {
  checkAddCargoFields,
  checkUpdateCargoFields
} from '@/entities/User/model/userStore/helpers/validation'

// entities
import {
  // const
  CARGOS_DB_COLLECTION_NAME,
  CARGO_STATUS,
  CARGO_FIELD_NAMES,
  CARGO_IMAGE_STATUS,
  UPLOAD_IMAGE_STATUS,
  SORTING_BY_DATE,
  CargosStore
} from '@/entities/Cargo'
import { firebaseStorage } from '@/entities/Region'


import type {
  IFiltersOfList,
  TByDate,
  TIsShowFilters,
  TCargosItems,
  TCargosState,
  TUploadCargoImageRes,
  ICargoFull,
  ICargoForForm,
  ICargoAddResponse,
  IAddCargo,
  ICargoDBFormat,
  ICargoSavingResponse,
  TSpaceOfDB,
  TUploadImage,
  TSpaceItem,
  TAddPhotoSpaceInfoArgs,
  TAddPhotoFileInfoArgs,
  TUploadCargoImageFileDataArgs,
  TUploadCargoImageSpaceDataArgs,
  TUpdateUploadImageArgs,
  TSetUploadImageArgs,
  ICargoDBFormatWithoutId,
  IUpdateCargoReqBody
} from '@/entities/Cargo'

// stores
import { ClientsStore } from '@/entities/User'
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from '@/shared/lib/providers/auth'
import {
  createCargo,
  getAllCargos,
  getCargosByUserId,
  mapCargoDataFromApi,
  updateCargo
} from '@/entities/Cargo'
import type { TDecodedAccessToken } from '@/entities/User'
import { parseJwtOnServer } from '@/shared/lib/token'
import { splitArrayIntoSubArrays } from '@/shared/lib/arrays/splitArrayIntoSubArrays'
import { ICargoSubmitForm } from '../types'
import { ToneStore, TToneIdState } from '@/entities/Tone'
import {TSetCurrentItemsListByStatusArgs} from "@/entities/Cargo/types/methodArgs";

export class _CargosStore {
  cargos: TCargosState = {
    items: [],
    currentItemsList: [],
    notLoadedSpaces: {
      list: [],
      numberOfPhotosCurrentlyBeingUploaded: 0
    },
    currentItem: null,
    isCurrentItemsListArchive: false,
    isLoading: false
  }

  filtersOfList: IFiltersOfList = {
    isShowFilters: false,
    byDate: SORTING_BY_DATE.ASC
  }

  constructor() {
    makeObservable(this, {
      cargos: observable,
      toggleIsCurrentItemsListArchive: action,
      setList: action,
      clearList: action,
      clearCurrentItemsList: action,
      clearCurrentItem: action,
      setCurrentItemsListByStatus: action,
      setCurrentItem: action,
      add: action,
      update: action,
      generateSpaceItem: action,
      initNotLoadedSpaces: action,
      addNotLoadedSpaces: action,
      clearNotLoadedSpaces: action,
      addSpace: action,
      updateSpace: action,
      removeSpace: action,
      getFileIndex: action,
      increaseUploadingFiles: action,
      decreaseUploadingFiles: action,
      resetUploadFiles: action,
      addPhoto: action,
      removePhoto: action,
      setUploadImage: action,
      updateUploadImage: action,
      hideUploadImageProgress: action,
      uploadCargoImage: action,
      deleteCargoImage: action,
      clearAll: action,

      // FILTERS
      toggleShowingFilters: action,
      toggleByDate: action,
      filtersOfList: observable
    })
  }

  toggleIsCurrentItemsListArchive = (status: boolean) => {
    this.cargos.isCurrentItemsListArchive = status
  }

  setList = (cargos: TCargosItems) => {
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
  }: TSetCurrentItemsListByStatusArgs) => {
    const currentToneId: TToneIdState = ToneStore.tones.currentToneId

    this.cargos.isCurrentItemsListArchive = isArchive

    const filteredList = this.cargos.items.filter(cargo => {
      return (
        Boolean(
          isArchive
            ? Number(cargo.status) === CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER
            : Number(cargo.status) !== CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER
        ) &&
        (currentUserCode ? cargo.clientCode === currentUserCode : true) &&
        (currentToneId ? cargo.toneId === currentToneId : true)
      )
    })

    const sortedCargos = getSortedCurrentItemsListByDate<TCargosItems>(
      JSON.parse(JSON.stringify(filteredList)),
      this.filtersOfList.byDate
    )
    this.cargos.currentItemsList = sortedCargos

    return sortedCargos
  }

  setCurrentItem = (currentItem: ICargoFull) => {
    this.cargos.currentItem = { ...currentItem }
  }

  add = async ({
    toneId,
    clientCode,
    status,
    costOfDelivery,
    insurance,
    cost,
    tariff,
    volume,
    weight,
    spaces
  }: ICargoSubmitForm) => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    const response: ICargoAddResponse = {
      data: {
        addingCargo: {
          errors: []
        }
      }
    }

    const userOfCargo = await checkAddCargoFields({
      toneId,
      clientCode,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      responseErrorsArray: response.data.addingCargo.errors,
      userId: ClientsStore.clients.currentItem?.id,
      country: ClientsStore.clients.currentItem?.country,
      token
    })

    if (response.data.addingCargo.errors.length) return response

    if (!userOfCargo?.id || !userOfCargo?.country || !token) {
      Sentry.captureMessage(
        `cargoStore.add: Something wrong with - userOfCargo?.id:${userOfCargo?.id}, userOfCargo?.country:${userOfCargo?.country}, token:${token}`
      )
      return response
    }

    this.cargos.isLoading = true
    const newUpdatedAndCreatedAt = new Date().toISOString()
    const newCargoData: IAddCargo = {
      toneId,
      clientCode,
      clientId: userOfCargo.id,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces: prepareSpaces(spaces),
      updatedAt: newUpdatedAndCreatedAt,
      createdAt: newUpdatedAndCreatedAt
    }

    await createCargo({
      country: userOfCargo.country,
      token,
      body: newCargoData
    })
      .then(data => {
        const newCargo = mapCargoDataFromApi(data)

        // add to all cargos
        this.cargos.items = [...this.cargos.items, newCargo]

        // add for current cargo list
        if (
          (this.cargos.isCurrentItemsListArchive &&
            status === CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER) ||
          (!this.cargos.isCurrentItemsListArchive &&
            status !== CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER)
        )
          this.cargos.currentItemsList = getSortedCurrentItemsListByDate<TCargosItems>(
            [...this.cargos.currentItemsList, newCargo],
            this.filtersOfList.byDate
          )

        // set as current item in info block
        this.cargos.currentItem = newCargo
      })
      .catch(error => {
        console.error('cargosStore.add', error)
        Sentry.captureException(error)

        return null
      })
      .finally(() => {
        this.cargos.isLoading = false
      })

    return response
  }

  update = async ({
    toneId,
    clientCode,
    status,
    costOfDelivery,
    insurance,
    cost,
    tariff,
    volume,
    weight,
    id,
    spaces,
    updatedAt,
    createdAt
  }: ICargoDBFormat) => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    const response: ICargoSavingResponse = {
      data: {
        cargoSaving: {
          errors: []
        }
      }
    }

    const userOfCargo = await checkUpdateCargoFields({
      toneId,
      clientCode,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      id,
      responseErrorsArray: response.data.cargoSaving.errors,
      userId: ClientsStore.clients.currentItem?.id,
      country: ClientsStore.clients.currentItem?.country,
      token
    })

    console.log({
      toneId,
      clientCode,
      status,
      costOfDelivery,
      // cargoName,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces
    })
    // return response

    if (spaces.length && toneId) {
      enum spacePropertiesEnum {
        weight = 'weight',
        piecesInPlace = 'piecesInPlace',
        volume = 'volume'
      }
      const checkSpaceFieldIsValid = (
        spaces: Array<TSpaceOfDB>,
        property: spacePropertiesEnum
      ): {
        isPropertyValid: boolean
        spaceIndex: number
      } => {
        const findIndexCallback = (space: TSpaceOfDB) => {
          const value = space?.[`${property}`]
          const valueNumber = Number(value)

          return value === null || isNaN(valueNumber) || valueNumber < 0
        }
        const spaceIndex = spaces.findIndex(findIndexCallback)

        return {
          isPropertyValid: spaceIndex !== -1 ? true : false,
          spaceIndex: spaceIndex
        }
      }

      const weightChecks = checkSpaceFieldIsValid(spaces, spacePropertiesEnum['weight'])
      const piecesInPlaceChecks = checkSpaceFieldIsValid(
        spaces,
        spacePropertiesEnum['piecesInPlace']
      )
      const volumeChecks = checkSpaceFieldIsValid(spaces, spacePropertiesEnum['volume'])
      if (weightChecks.isPropertyValid) {
        response.data.cargoSaving.errors.push({
          field: `spaces.${weightChecks.spaceIndex}.${CARGO_FIELD_NAMES.SPACE_WEIGHT.value}`,
          message: `Не корректный вес места`
        })
      }

      if (piecesInPlaceChecks.isPropertyValid) {
        response.data.cargoSaving.errors.push({
          field: `spaces.${piecesInPlaceChecks.spaceIndex}.${CARGO_FIELD_NAMES.PIECES_IN_PLACE.value}`,
          message: `Не корректное количество шт. в месте`
        })
      }

      if (volumeChecks.isPropertyValid) {
        response.data.cargoSaving.errors.push({
          field: `spaces.${volumeChecks.spaceIndex}.${CARGO_FIELD_NAMES.SPACE_VOLUME.value}`,
          message: `Не корректный объём в месте`
        })
      }
    }

    if (response.data.cargoSaving.errors.length) return response

    if (!userOfCargo?.id || !userOfCargo?.country || !token) {
      Sentry.captureMessage(
        `cargoStore.edit: Something wrong with - userOfCargo?.id:${userOfCargo?.id}, userOfCargo?.country:${userOfCargo?.country}, token:${token}`
      )
      return response
    }

    this.cargos.isLoading = true

    const requestData: IUpdateCargoReqBody = {
      toneId,
      clientCode,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces,
      updatedAt,
      createdAt,
      clientId: userOfCargo.id
    }

    updateCargo({
      userId: id,
      country: userOfCargo.country,
      token,
      body: requestData
    })
      .then(updatedCargo => {
        const cargosTmp = JSON.parse(JSON.stringify(this.cargos.items))
        const currentCargoIndex = cargosTmp.findIndex((cargo: ICargoFull) => cargo.id === id)
        cargosTmp[currentCargoIndex] = { ...updatedCargo }
        this.cargos.items = cargosTmp

        // add/edit/delete from current cargo list
        const currCargoInItemsList = this.cargos.currentItemsList.findIndex(
          cargo => cargo.id === id
        )
        if (
          (currCargoInItemsList !== -1 &&
            this.cargos.isCurrentItemsListArchive &&
            status === CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER) ||
          (!this.cargos.isCurrentItemsListArchive &&
            status !== CARGO_STATUS.CARGO_RECEIVED_BY_CUSTOMER)
        ) {
          const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

          currItemsListTmp.splice(currCargoInItemsList, 1, updatedCargo)
          this.cargos.currentItemsList = getSortedCurrentItemsListByDate<TCargosItems>(
            [...currItemsListTmp],
            this.filtersOfList.byDate
          )
        } else if (currCargoInItemsList !== -1) {
          const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

          currItemsListTmp.splice(currCargoInItemsList, 1)
          this.cargos.currentItemsList = getSortedCurrentItemsListByDate<TCargosItems>(
            [...currItemsListTmp],
            this.filtersOfList.byDate
          )
        } else {
          console.error('Something went wrong in add/edit/delete from current cargo list logic')
        }

        return updatedCargo
      })
      .catch(error => {
        console.error('Error adding users document: ', error)
        Sentry.captureException(error)
        response.data.cargoSaving.errors.push({
          field: 'server',
          message: `addDoc was failed, error: ${error}`
        })

        return response
      })
      .finally(() => {
        this.cargos.isLoading = false
      })

    return response
  }

  // SPACES
  generateSpaceItem = ({
    clientId,
    cargoId,
    photos,
    id,
    weight,
    piecesInPlace,
    cargoName,
    volume
  }: {
    clientId: string
    cargoId?: string
    id?: string
    photos?: Array<TUploadImage>
    weight?: number
    volume?: number
    cargoName?: string
    piecesInPlace?: number
  }): TSpaceItem => {
    const newSpace: TSpaceItem = {
      id: id ? id : uuidv4(),
      clientId,
      weight: typeof weight === 'number' ? weight : Number(CARGO_FIELD_NAMES.WEIGHT.defaultValue),
      volume: typeof volume === 'number' ? volume : Number(CARGO_FIELD_NAMES.VOLUME.defaultValue),
      cargoName: cargoName ? cargoName : '',
      piecesInPlace:
        typeof piecesInPlace === 'number'
          ? piecesInPlace
          : Number(CARGO_FIELD_NAMES.PIECES_IN_PLACE.defaultValue),
      photos: Array.isArray(photos) && photos.length ? photos : []
    }
    if (cargoId) newSpace.cargoId = cargoId

    return newSpace
  }

  initNotLoadedSpaces = (newSpaces: Array<TSpaceItem>) => {
    this.cargos.notLoadedSpaces.list = JSON.parse(JSON.stringify(newSpaces))
  }

  addNotLoadedSpaces = (newSpaces: Array<TSpaceItem>) => {
    // add new tmp spaces instance
    const newNotLoadedSpaces = [...this.cargos.notLoadedSpaces.list, ...newSpaces]
    this.cargos.notLoadedSpaces.list = JSON.parse(JSON.stringify(newNotLoadedSpaces))
  }

  clearNotLoadedSpaces = () => {
    this.cargos.notLoadedSpaces.list = []
  }

  addSpace = ({
    clientId,
    cargoId,
    newSpaceItem
  }: {
    clientId: string
    cargoId?: string
    newSpaceItem?: TSpaceItem
  }) => {
    const newSpace = (() => {
      if (newSpaceItem) {
        return newSpaceItem
      }

      const generateItemArgs: {
        clientId: string
        cargoId?: string
      } = { clientId }
      if (cargoId) generateItemArgs.cargoId = cargoId

      return this.generateSpaceItem(generateItemArgs)
    })()

    const tmpSpaces = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    tmpSpaces.push({ ...newSpace })
    this.cargos.notLoadedSpaces.list = tmpSpaces
  }

  updateSpace = ({
    id,
    weight,
    piecesInPlace,
    volume,
    cargoName
  }: {
    id: string
    weight?: number
    piecesInPlace?: number
    volume?: number
    cargoName?: string
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const indexOfSpace = spacesTmp.findIndex((space: TSpaceItem) => space.id === id)
    const currentSpace = spacesTmp[indexOfSpace]
    if (typeof weight === 'number' && weight >= 0) currentSpace.weight = weight
    else if (typeof piecesInPlace === 'number' && piecesInPlace >= 0)
      currentSpace.piecesInPlace = piecesInPlace
    else if (typeof volume === 'number' && volume >= 0) currentSpace.volume = volume
    else if (typeof cargoName === 'string') currentSpace.cargoName = cargoName

    this.cargos.notLoadedSpaces.list = [...spacesTmp]
  }

  removeSpace = ({
    clientId,
    cargoId,
    index,
    isItEditForm
  }: {
    clientId: string
    cargoId?: string
    index: number
    isItEditForm: boolean
  }) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const filterCallback = (space: TSpaceItem, _index: number) => {
      return Boolean(
        _index !== index &&
          space.clientId === clientId &&
          (() => (isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined))()
      )
    }
    const spacesWithoutRemoved = spacesTmp.filter(filterCallback)

    const newSpaces = spacesWithoutRemoved.map((space: TSpaceItem) => {
      if (
        space.clientId === clientId &&
        (() => (isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined))() &&
        space.photos.length
      ) {
        const photosWithNewIndexes = space.photos.map((photo: TUploadImage) => ({
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
    tmpSpaces: Array<TSpaceItem>
    spaceIndex: number
    acceptedFileIndex: number
  }): number | null => {
    if (tmpSpaces.length > 0) {
      const photosLengthBeforeSetNewPhoto = tmpSpaces[spaceIndex]?.photos?.length

      if (photosLengthBeforeSetNewPhoto === null) {
        console.warn('tmpSpaces[indexOfSpaceBeforeSetNewPhoto].photos.length is null')
        return 0
      }

      if (
        // if it isn't first photo
        Number.isInteger(photosLengthBeforeSetNewPhoto) &&
        photosLengthBeforeSetNewPhoto > 0
      ) {
        return photosLengthBeforeSetNewPhoto + acceptedFileIndex
      } else if (
        // if its first photos for space - users uploaded few photos
        Number.isInteger(photosLengthBeforeSetNewPhoto) &&
        photosLengthBeforeSetNewPhoto === 0 &&
        acceptedFileIndex > 0
      ) {
        return acceptedFileIndex
      } else {
        // if its first photo - users uploaded a picture
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
    spaceInfo: TAddPhotoSpaceInfoArgs,
    fileInfo: TAddPhotoFileInfoArgs
  ): Promise<void> => {
    const { spaceID, spaceIndex, clientId, cargoId, isItEditForm } = spaceInfo
    const { file, metadata, fileIndex } = fileInfo

    this.increaseUploadingFiles()

    const tmpSpacesBeforeSetNewPhoto: Array<TSpaceItem> = JSON.parse(
      JSON.stringify(this.cargos.notLoadedSpaces.list)
    )

    const findIndexSpaceCallback = (space: TSpaceItem, index: number): boolean => {
      return Boolean(
        space.clientId === clientId &&
          spaceID === space.id &&
          spaceIndex === index &&
          (() => (isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined))()
      )
    }

    function getIndexOfUnsavedSpace(
      spaces: Array<TSpaceItem>,
      clientId: string,
      spaceIndex: number
    ): number {
      let _spaceIndex = 0
      let result: number = -1
      for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i]
        if (space?.cargoId) continue
        else if (
          space.clientId === clientId &&
          space.id === spaceID &&
          spaceIndex === _spaceIndex
        ) {
          result = i
        }
        _spaceIndex += 1
      }

      return result
    }

    function getIndexOfSavedSpace(
      spaces: Array<TSpaceItem>,
      findIndexCurrentSpaceCallback: (
        value: TSpaceItem,
        index: number,
        obj: TSpaceItem[]
      ) => unknown
    ): number {
      const index: number = spaces.findIndex(findIndexCurrentSpaceCallback)
      return index
    }

    let getSpaceIndex: Function
    if (isItEditForm && cargoId)
      getSpaceIndex = getIndexOfSavedSpace.bind(
        null,
        tmpSpacesBeforeSetNewPhoto,
        findIndexSpaceCallback
      )
    else if (!isItEditForm && !cargoId) {
      // @ts-ignore
      getSpaceIndex = getIndexOfUnsavedSpace.bind(
        null,
        tmpSpacesBeforeSetNewPhoto,
        clientId,
        spaceIndex
      )
      if (getSpaceIndex === undefined) {
        console.warn('addPhoto error: getSpaceIndex return undefined')
        this.resetUploadFiles()

        return
      }
    } else {
      console.warn('addPhoto error: something wrong with cargoId')
      this.resetUploadFiles()

      return
    }

    const currentSpaceIndex: number = getSpaceIndex()
    if (currentSpaceIndex === -1) {
      console.warn("currentSpaceIndex wasn't found")
      this.resetUploadFiles()

      return
    }

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
      fileData: TUploadCargoImageFileDataArgs
      spaceData: TUploadCargoImageSpaceDataArgs
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
        isItEditForm
      }
    }
    if (isItEditForm) uploadCargoImageArgs.spaceData.cargoId = cargoId

    const uploadCargoImageRes: TUploadCargoImageRes = await this.uploadCargoImage(
      uploadCargoImageArgs
    )
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

    const findIndexPhotoCallback = (photo: TUploadImage): boolean =>
      photo.photoIndex === newPhotoIndex

    const currentPhotos = notLoadedSpacesTmp[indexOfSpaceToBeUpdated]?.photos
    if (!Array.isArray(currentPhotos)) {
      console.warn("AddPhoto error: currentPhotos wasn't found")
      this.resetUploadFiles()

      return
    }

    const indexOfPhotoToBeUpdated = currentPhotos.findIndex(findIndexPhotoCallback)
    if (indexOfPhotoToBeUpdated === -1) {
      console.warn('AddPhoto error: not found photo of space to update')
      this.resetUploadFiles()

      return
    }

    currentPhotos[indexOfPhotoToBeUpdated].url = url
    this.cargos.notLoadedSpaces.list = [...notLoadedSpacesTmp]

    this.decreaseUploadingFiles()
  }

  removePhoto = (
    spaceInfo: {
      spaceIndex: number
      clientId: string
      cargoId?: string
      isItEditForm: boolean
    },
    photoIndex: number
  ) => {
    const { spaceIndex, clientId, cargoId, isItEditForm } = spaceInfo
    console.log('removePhoto', {
      ...spaceInfo,
      spaceIndex,
      photoIndex
    })

    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    const spacesWithoutRemovedPhoto = spacesTmp.map((space: TSpaceItem, _space_index: number) => {
      if (
        space.clientId === clientId &&
        spaceIndex === _space_index &&
        (() => (isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined))()
      ) {
        const photos = space.photos.filter(
          (photo: TUploadImage, _photo_index: number) => photoIndex !== _photo_index
        )
        const photosWithUpdatedIndexes = photos.map(photo => {
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
    isItEditForm
  }: TSetUploadImageArgs) => {
    const spacesTmp = JSON.parse(JSON.stringify(this.cargos.notLoadedSpaces.list))
    if (isItEditForm && this.cargos?.currentItem === null) {
      console.warn('isItEditForm is true, but this.cargos.currentItem.id not found')
      return
    }

    const newUploadImage: TUploadImage = {
      id: uuidv4(),
      status: CARGO_IMAGE_STATUS.FILE_JUST_UPLOADED,
      uploadStatus,
      progress: 0,
      isShowProgress: true,
      spaceIndex: isItEditForm ? spaceIndexOfState : spaceIndexOfForm,
      photoIndex,
      url: null
    }

    const findIndexCallback = (space: TSpaceItem, index: number): boolean => {
      return (
        space.clientId === clientId &&
        (() => (isItEditForm ? space.cargoId === cargoId : space?.cargoId === undefined))() &&
        spaceIndexOfState === index
      )
    }
    const currentSpaceIndex = spacesTmp.findIndex(findIndexCallback)
    if (currentSpaceIndex === -1) {
      const newTmpSpaceItem: TSpaceItem = {
        id: uuidv4(),
        clientId,
        weight: Number(CARGO_FIELD_NAMES.WEIGHT.defaultValue),
        volume: Number(CARGO_FIELD_NAMES.VOLUME.defaultValue),
        piecesInPlace: Number(CARGO_FIELD_NAMES.PIECES_IN_PLACE.defaultValue),
        cargoName: CARGO_FIELD_NAMES.CARGO_NAME.defaultValue as string,
        photos: [newUploadImage]
      }
      if (isItEditForm) newTmpSpaceItem.cargoId = cargoId

      this.cargos.notLoadedSpaces.list = [...spacesTmp, newTmpSpaceItem]
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
    cargoId
  }: TUpdateUploadImageArgs) => {
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

    const currentImageIndex = currentSpace.photos.findIndex(
      (photo: TUploadImage) => photo.id === id
    )

    if (currentImageIndex !== -1) {
      const currentPhoto = { ...currentSpace.photos[currentImageIndex] }
      if (uploadStatus !== undefined) currentPhoto.uploadStatus = uploadStatus
      if (progress !== undefined) currentPhoto.progress = progress
      if (url !== undefined) currentPhoto.url = url
      if (isShowProgress !== undefined) currentPhoto.isShowProgress = isShowProgress

      this.cargos.notLoadedSpaces.list[spaceIndexOfState].photos[currentImageIndex] = {
        ...currentPhoto
      }
    } else {
      console.warn(`${Object.keys({ currentImageIndex })[0]} not found`)

      return null // kill all downloads
    }
  }

  hideUploadImageProgress = (id: string) => {}

  uploadCargoImage = async ({
    fileData: { file, metadata = {} },
    spaceData: { spaceIndexOfState, spaceIndexOfForm, photoIndex, clientId, cargoId, isItEditForm }
  }: {
    fileData: TUploadCargoImageFileDataArgs
    spaceData: TUploadCargoImageSpaceDataArgs
  }): Promise<TUploadCargoImageRes> => {
    const storageRef = await ref(firebaseStorage, `images/${file.name}`)

    const compressedFile = await compress(file, 0.6, 2000, 2000, 1000)

    return new Promise(async (resolve, reject) => {
      if (!compressedFile) reject(null)
      const setUploadImageArgs: TSetUploadImageArgs = {
        uploadStatus: UPLOAD_IMAGE_STATUS.UPLOADING,
        spaceIndexOfState,
        spaceIndexOfForm,
        photoIndex,
        clientId,
        isItEditForm
      }
      if (isItEditForm) setUploadImageArgs.cargoId = cargoId
      const newUploadImage = await this.setUploadImage(setUploadImageArgs)
      if (!newUploadImage) {
        console.warn('failed to create a new instance of the image to upload')
        return null
      }

      const updateUploadImageArgs: TUpdateUploadImageArgs = {
        id: newUploadImage.id,
        clientId,
        isItEditForm,
        spaceIndexOfState,
        spaceIndexOfForm
      }
      if (isItEditForm) updateUploadImageArgs.cargoId = cargoId

      const uploadTask = uploadBytesResumable(storageRef, compressedFile)
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS.UPLOADING
          updateUploadImageArgs.progress = progress
          if (isItEditForm) updateUploadImageArgs.cargoId = cargoId
          const updatingImageStatus = this.updateUploadImage(updateUploadImageArgs)

          if (updatingImageStatus === null) {
            console.warn(
              'there was an update on incorrect indexes: updateUploadImage returned null'
            )

            return null
          }

          console.log('Upload is ' + progress + '% done')
        },
        error => {
          // Handle unsuccessful uploads
          console.error(`uploadBytes error: ${error}`)
          reject(null)

          return null
        },
        async () => {
          return await getDownloadURL(uploadTask.snapshot.ref)
            .then(async url => {
              updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS.SUCCESS
              this.updateUploadImage(updateUploadImageArgs)
              // resolve(url)
              resolve({
                id: newUploadImage.id,
                url
              })

              return url
            })
            .catch(error => {
              console.error(`uploadBytes error: ${error}`)
              updateUploadImageArgs.uploadStatus = UPLOAD_IMAGE_STATUS.ERROR
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
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log('image was delete')
      })
      .catch(error => {
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

  // FILTERS
  toggleShowingFilters = (status: TIsShowFilters) => {
    this.filtersOfList.isShowFilters = status
  }

  toggleByDate = (status: TByDate) => {
    this.filtersOfList.byDate = status

    this.setCurrentItemsListByStatus({
      isArchive: this.cargos.isCurrentItemsListArchive,
      currentUserCode: ClientsStore.clients.currentItem?.userCodeId
        ? ClientsStore.clients.currentItem.userCodeId
        : undefined
    })
  }
}

export class _CargosListView {
  constructor(private readonly rootStore: _CargosStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      archiveItemsToggle: action
    })
  }

  archiveItemsToggle = (status: boolean): void => {
    this.rootStore.setCurrentItemsListByStatus({
      isArchive: status,
      currentUserCode: ClientsStore.clients.currentItem?.userCodeId
        ? ClientsStore.clients.currentItem.userCodeId
        : undefined
    })
  }
}

export class _CargosListPooling {
  constructor(
    private readonly rootStore: _CargosStore,
    private readonly listViewStore: _CargosListView
  ) {
    this.rootStore = rootStore
    this.listViewStore = listViewStore

    makeObservable(this, {
      poolingNewCargosForUser: action
    })
  }

  poolingNewCargosForUser = async (isUserEmployee: boolean) => {
    const accessToken = await getCookies(ACCESS_TOKEN_KEY)
    if (!accessToken) {
      Sentry.captureMessage(
        `CargoBlock poolingNewCargosForUser error: By some reasons we coundnt found a token in cookies. accessToken:${accessToken}`
      )
      return
    }

    console.info('cargos pooling...')
    const decodedJwt: TDecodedAccessToken = await parseJwtOnServer(accessToken as string)
    const countryByToken = decodedJwt.claims.country
    const userIdByToken = decodedJwt.claims.id

    const cargosRequest = isUserEmployee
      ? getAllCargos({
          country: countryByToken,
          token: accessToken
        })
      : getCargosByUserId({
          userId: userIdByToken,
          country: countryByToken,
          token: accessToken
        })

    await cargosRequest
      .then(cargosRes => {
        const cargosArrayParts = splitArrayIntoSubArrays(cargosRes)

        let noNewCargos = true
        for (let i = 0; i < cargosArrayParts.length; i++) {
          for (const cargoRes of cargosArrayParts[i]) {
            noNewCargos = [...this.rootStore.cargos.items].some(cargo => cargo.id === cargoRes.id)
            if (!noNewCargos) break
          }
          if (!noNewCargos) break
        }

        if (!noNewCargos) {
          console.info('We found new cargos for current user. Cargo store was updated by pooling!')
          this.rootStore.setList(cargosRes) // save to store
          this.listViewStore.archiveItemsToggle(false) // activate 'visibility' in list
        }
      })
      .catch(error => {
        console.error(
          `_CargosListPooling.poolingNewCargosForUser request to getting cargos was failed`,
          { error }
        )
        Sentry.captureMessage(
          `_CargosListPooling.poolingNewCargosForUser request to getting cargos was failed. error:${error}`
        )
      })
  }
}
