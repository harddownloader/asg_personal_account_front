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

export interface IClientsState {
  items: Array<IUserOfDB>,
  currentList: Array<IUserOfDB>
  currentItem: IUserOfDB | null,
  isLoading: boolean,
}

export class _ClientsStore {
  clients: IClientsState = {
    items: [], // all clients
    currentList: [], // clients what we can see in list
    currentItem: null, // selected client
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  initClientsLists(clientsList: Array<IUserOfDB>) {
    this.clients.items = [...clientsList]
    this.clients.currentList = [...clientsList]
  }

  setCurrentItem = (currentItem: IUserOfDB) => {
    this.clients.currentItem = {...currentItem}
  }

  clearCurrentItem = () => {
    this.clients.currentItem = null
  }

  setList = (clientsList: Array<IUserOfDB>) => {
    this.clients.items = JSON.parse(JSON.stringify(clientsList))
  }

  addClient = (client: IUserOfDB) => {
    this.clients.items = [
      ...this.clients.items,
      client
    ]
  }

  setCurrentList = (clientsList: Array<IUserOfDB>) => {
    this.clients.currentList = [...clientsList]
  }

  restoreCurrentList = () => {
    this.clients.currentList = [...this.clients.items]
  }

  updateClientInLists = (updatedUser: IUserOfDB) => {
    const clientsItemsTmp = JSON.parse(JSON.stringify(this.clients.items))
    const currentClientsItemsTmp = JSON.parse(JSON.stringify(this.clients.currentList))
    const currentUserIndex__all = clientsItemsTmp.findIndex(
      (user: IUserOfDB) => user.id === updatedUser.id
    )
    const currentUserIndex__view = currentClientsItemsTmp.findIndex(
      (user: IUserOfDB) => user.id === updatedUser.id
    )
    if (
      currentUserIndex__all !== -1 &&
      currentUserIndex__view !== -1
    ) {
      clientsItemsTmp.splice(currentUserIndex__all, 1, updatedUser)
      currentClientsItemsTmp.splice(currentUserIndex__view, 1, updatedUser)
      this.setList(clientsItemsTmp)
      this.setCurrentList(currentClientsItemsTmp)
      this.setCurrentItem(updatedUser)
    } else console.warn(
      'clientsStore->updateClientInLists error: we can not found updated user in lists', {
        currentUserIndex__all,
        currentUserIndex__view,
      }
    )
  }

  saveClientProfile = async ({
                               name,
                               phone,
                               email,
                               city,
                               userCodeId,
                               id,
                               country,
                               role
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
            id,
            role,
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

        this.updateClientInLists(updatedUserData)
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

  clearAll() {
    this.clients.items = []
    this.clients.currentList = []
    this.clients.currentItem = null
    this.clients.isLoading = false
  }
}
