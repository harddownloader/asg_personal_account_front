import { makeAutoObservable } from "mobx"
import {
  ISaveClientProfile,
  IUserOfDB,
  TUserSavingResponse
} from "@/entities/User"
import * as Sentry from '@sentry/nextjs'

// helpers
import {
  checkEditClientByManagerFields
} from "@/entities/User/model/userStore/helpers/validation"
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"
import { getCookies } from "@/shared/lib/cookies"

export interface ClientsState {
  items: Array<IUserOfDB>,
  currentItem: IUserOfDB | null,
  isLoading: boolean,
}

export class _ClientsStore {
  clients: ClientsState = {
    items: [],
    currentItem: null,
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentItem = (currentItem: IUserOfDB) => {
    this.clients.currentItem = {...currentItem}
  }

  clearCurrentItem = () => {
    this.clients.currentItem = null
  }

  setList = (clientsList: Array<IUserOfDB>) => {
    this.clients.items = [...clientsList]
  }

  addClient = (client: IUserOfDB) => {
    this.clients.items = [
      ...this.clients.items,
      client
    ]
  }

  saveClientProfile = async ({
                               name,
                               phone,
                               email,
                               city,
                               userCodeId,
                               id,
                               country
                             }: ISaveClientProfile): Promise<TUserSavingResponse> => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    const response: TUserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    await checkEditClientByManagerFields({
      name,
      phone,
      email,
      city,
      responseErrorsArray: response.data.accountSaving.errors,
      id,
      country,
      token
    })

    if (!response.data.accountSaving.errors.length ) {
      try {
        this.clients.isLoading = true
        const updatedUserData = await fetch(`/api/users/${country}/${id}`, {
          method: 'PATCH',
          headers: new Headers({
            'Content-Type': 'application/json',
            [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
          }),
          credentials: "same-origin",
          body: JSON.stringify({
            name,
            phone,
            email,
            city,
            userCodeId,
            id
          })
        })
          .then((response) => response.json())
          .then((res) => res)
          .catch((error) => {
            console.error(error)
            Sentry.captureException(error)
          })
          .finally(() => {
            this.clients.isLoading = false
          })

        const clientsItemsTmp = JSON.parse(JSON.stringify(this.clients.items))
        const currentUserIndex = clientsItemsTmp.findIndex((user: IUserOfDB) => user.id === id)
        if (currentUserIndex !== -1) {
          clientsItemsTmp.splice(currentUserIndex, 1, updatedUserData)
          this.setList(clientsItemsTmp)
          this.setCurrentItem(updatedUserData)
        }
      } catch (err) {
        this.clients.isLoading = false
        console.error(`Some request was failed, error: ${err}`)
      }
    }

    return response
  }

  updateClient = (client: IUserOfDB) => {
    const clientsTmp = JSON.parse(JSON.stringify(this.clients.items))
    const clientIndex = clientsTmp.findIndex((_client: IUserOfDB) => _client.id === client.id)
    if (clientIndex !== -1) {
      clientsTmp.splice(clientIndex, 1 , client)
      this.clients.items = clientsTmp
    }
  }
}
