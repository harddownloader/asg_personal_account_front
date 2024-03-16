import { action, makeObservable, observable } from 'mobx'
import * as Sentry from '@sentry/nextjs'

// types
import {
  TToneId,
  TToneIdState,
  IToneAddResponse,
  TToneLabel,
  ITone
} from './../types'

// const
import {
  CURRENT_TONE_ID_DEFAULT,
  TONE_API_ERRORS
} from './../consts'

// api
import {
  addTone,

  // mappers
  mapToneDataFromApi,
} from './../api'

// shared
import { getSortedCurrentItemsListByDate } from '@/shared/lib/arrays/sorting'
import { getCookies } from '@/shared/lib/cookies'
import { ACCESS_TOKEN_KEY } from '@/shared/lib/providers/auth'

// entities
import { checkAddTone } from '@/entities/Tone/model/helpers/validation'
import {ClientsStore, USER_ROLE, UserStore} from '@/entities/User'
import {
  // const
  CARGO_FIELD_NAMES,
  SORTING_BY_DATE,

  // store
  CargosStore,

  // types
  TSetCurrentItemsListByStatusArgs,
} from '@/entities/Cargo'
import {getRegionCookie} from "@/entities/Region/lib";

type TToneStore = {
  items: ITone[]
  isLoading: boolean
  currentToneId: TToneIdState
}

export class _ToneStore {
  tones: TToneStore = {
    items: [],
    isLoading: false,
    currentToneId: CURRENT_TONE_ID_DEFAULT
  }

  constructor() {
    makeObservable(this, {
      tones: observable,
      setList: action,
      clearList: action,
      setCurrentToneId: action,
      clearCurrentToneId: action
    })
  }

  setList = (tones: ITone[]) => {
    const mappedTones = tones.map(tone => mapToneDataFromApi(tone))
    const tonesSortedByDate = getSortedCurrentItemsListByDate<ITone[]>(mappedTones, SORTING_BY_DATE.ASC)
    this.tones.items = [...tonesSortedByDate]
  }

  clearList = () => {
    this.tones.items = []
  }

  add = async (toneName: TToneLabel) => {
    const token: string | undefined = await getCookies(ACCESS_TOKEN_KEY)
    const response: IToneAddResponse = {
      data: {
        addingTone: {
          errors: []
        }
      }
    }

    const userOfCargo = await checkAddTone({
      toneLabel: toneName,
      responseErrorsArray: response.data.addingTone.errors,
      userId: (ClientsStore.clients.currentItem?.id || '') as string,
      country: ClientsStore.clients.currentItem?.country as string,
      token
    })

    if (response.data.addingTone.errors.length) {
      console.log('response.data.addingTone.errors', response.data.addingTone.errors)
      return response
    }

    if (!userOfCargo?.id || !userOfCargo?.country || !token) {
      Sentry.captureMessage(
        `toneStore.add: Something wrong with - userOfCargo?.id:${userOfCargo?.id}, userOfCargo?.country:${userOfCargo?.country}, token:${token}`
      )
      console.log(
        `Sentry.captureMessage(\`toneStore.add: Something wrong... userOfCargo?.id:${userOfCargo?.id}, userOfCargo?.country:${userOfCargo?.country}, token:${token}`
      )
      return response
    }

    this.tones.isLoading = true
    const newUpdatedAndCreatedAt = new Date().toISOString()
    const currentUser = UserStore.user.currentUser
    await addTone({
      country: (currentUser && currentUser.role === USER_ROLE.ADMIN)
        ? getRegionCookie()
        : userOfCargo.country,
      token,
      body: {
        label: toneName,
        updatedAt: newUpdatedAndCreatedAt,
        createdAt: newUpdatedAndCreatedAt
      }
    })
      .then(newToneRecord => {
        console.log({ newToneRecord })
        this.tones.items = [newToneRecord, ...this.tones.items]

        response.data.addingTone.newTone = newToneRecord
      })
      .catch(error => {
        /* Error handling */
        console.log('Tone store catch', error)
        switch (error.message) {
          case TONE_API_ERRORS.ALREADY_EXISTS:
            response.data.addingTone.errors.push({
              field: CARGO_FIELD_NAMES.TONE.value as string,
              message: `Тонна с таким названием уже существует`
            })
            break
          default:
            response.data.addingTone.errors.push({
              field: CARGO_FIELD_NAMES.TONE.value as string,
              message: `${error.message}`
            })
        }
      })
      .finally(() => {
        this.tones.isLoading = false
      })

    return response
  }

  setCurrentToneId = (toneId: TToneId) => {
    this.tones.currentToneId = toneId

    if (ClientsStore.clients.currentItem?.role !== USER_ROLE.CLIENT) ClientsStore.clearCurrentItem()
    CargosStore.clearCurrentItem()

    const sortedCargos = CargosStore.setCurrentItemsListByStatus({
      isArchive: CargosStore.cargos.isCurrentItemsListArchive
    })

    const uniqClientsCodes = new Set(sortedCargos.map(cargo => cargo.clientCode))
    const relevantClients = ClientsStore.clients.items.filter(client => client.userCodeId && uniqClientsCodes.has(client.userCodeId))
    ClientsStore.setCurrentList(relevantClients)
  }

  clearCurrentToneId = () => {
    this.tones.currentToneId = CURRENT_TONE_ID_DEFAULT

    const cargosListArgs: TSetCurrentItemsListByStatusArgs = {
      isArchive: CargosStore.cargos.isCurrentItemsListArchive,
    }
    if(ClientsStore.clients.currentItem?.userCodeId) cargosListArgs.currentUserCode = ClientsStore.clients.currentItem?.userCodeId
    CargosStore.setCurrentItemsListByStatus(cargosListArgs)

    ClientsStore.restoreCurrentList()
  }

  clearAll() {
    this.tones.items = []
    this.tones.isLoading = false
    this.tones.currentToneId = CURRENT_TONE_ID_DEFAULT
  }
}
