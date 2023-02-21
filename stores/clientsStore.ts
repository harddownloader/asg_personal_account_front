import { makeAutoObservable } from "mobx"
import {collection, doc, query, updateDoc, where} from "firebase/firestore"
import {updateEmail, updateProfile} from "firebase/auth"
import {SaveClientProfileInterface, UserOfDB, UserSavingResponse} from "@/stores/userStore"
import {validateEmail} from "@/lib/validation/email"
import {firebaseAuth, firebaseFirestore} from "@/lib/firebase"

export interface ClientsState {
  items: Array<UserOfDB>,
  currentItem: UserOfDB | null,
  isLoading: boolean,
}

class ClientsStore {
  clients: ClientsState = {
    items: [],
    currentItem: null,
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentItem = (currentItem: UserOfDB) => {
    this.clients.currentItem = {...currentItem}
  }

  setList = (clientsList: Array<UserOfDB>) => {
    this.clients.items = [...clientsList]
  }

  addClient = (client: UserOfDB) => {
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
                               id
                             }: SaveClientProfileInterface): Promise<UserSavingResponse> => {
    const response: UserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    if (!name || name.length < 2) {
      response.data.accountSaving.errors.push({
        field: 'name',
        message: 'Введите имя'
      })
    }
    if (!phone || phone.length < 5) {
      response.data.accountSaving.errors.push({
        field: 'phone',
        message: 'Не валидный телефон'
      })
    }
    if (!email || !validateEmail(email)) {
      response.data.accountSaving.errors.push({
        field: 'email',
        message: 'Не валидный email'
      })
    }


    if (!response.data.accountSaving.errors.length) {
      try {
        if (firebaseAuth.currentUser) {
          this.clients.isLoading = true
          const updatedUserData = await fetch("/api/userProfile", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "same-origin",
            body: JSON.stringify({
              name,
              phone,
              email,
              city,
              userCodeId,
              id
            })
          }).then((response) => response.json())
            .then((res) => res)
            .finally(() => {
            this.clients.isLoading = false
          })

          const clientsItemsTmp = JSON.parse(JSON.stringify(this.clients.items))
          const currentUserIndex = clientsItemsTmp.findIndex((user: UserOfDB) => user.id === id)
          if (currentUserIndex !== -1) {
            clientsItemsTmp.splice(currentUserIndex, 1, updatedUserData)
            this.setList(clientsItemsTmp)
            this.setCurrentItem(updatedUserData)
          }
        } else {
          this.clients.isLoading = false
          response.data.accountSaving.errors.push({
            field: 'server',
            message: `firebaseAuth.currentUser is not exists`
          })

          return response
        }

      } catch (err) {
        this.clients.isLoading = false
        console.error(`Some request was failed, error: ${err}`);
      }
    }

    return response
  }

  updateClient = (client: UserOfDB) => {
    const clientsTmp = JSON.parse(JSON.stringify(this.clients.items))
    const clientIndex = clientsTmp.findIndex((_client: UserOfDB) => _client.id === client.id)
    if (clientIndex !== -1) {
      clientsTmp.splice(clientIndex, 1 , client)
      this.clients.items = clientsTmp
    }
  }
}

export default new ClientsStore()