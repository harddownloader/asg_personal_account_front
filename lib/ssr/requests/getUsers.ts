import { fixMeInTheFuture } from "@/lib/types"
import { USER_ROLE_MANAGER, UserOfDB, USER_ROLE_CLIENT, USERS_DB_COLLECTION_NAME } from "@/stores/userStore"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"

export const getUserFromDB = async ({
                                        currentUserId,
                                        usersRef
                                    }: {
  currentUserId: string,
  usersRef: fixMeInTheFuture
}): Promise<UserOfDB> => {
  return await usersRef.doc(currentUserId).get()
    .then((user: fixMeInTheFuture) => {
      const userDecode = {...user.data()}

      return {
        id: user.id,
        name: userDecode.name,
        phone: userDecode.phone,
        email: userDecode.email,
        city: userDecode.city,
        role: userDecode.role,
        userCodeId: userDecode.userCodeId,
      }
    })
    .catch((error: fixMeInTheFuture) => console.error('getUserFromDB error:', error))
}

export type allClientsArgs = {
  usersRef: fixMeInTheFuture
}

export const getAllClients = async ({
                                      usersRef
                                    }: allClientsArgs): Promise<Array<UserOfDB>> => {
  return await usersRef
    .where("role", "==", USER_ROLE_CLIENT)
    .get()
    .then((clients: fixMeInTheFuture) => {
      return clients.docs.map((client: fixMeInTheFuture) => {
        const clientDecode = {...client.data()}

        return {
          id: client.id,
          name: clientDecode.name,
          email: clientDecode.email,
          phone: clientDecode.phone,
          city: clientDecode.city,
          role: clientDecode.role,
          userCodeId: clientDecode.userCodeId,
        }
      })
    })
}

export const getAllManagers = async (): Promise<Array<UserOfDB>> => {
  const db = firebaseAdmin.firestore()
  const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

  return await usersRef
    .where("role", "==", USER_ROLE_MANAGER)
    .get()
    .then((clients: fixMeInTheFuture) => {
      return clients.docs.map((client: fixMeInTheFuture) => {
        const clientDecode = {...client.data()}

        return {
          id: client.id,
          name: clientDecode.name,
          email: clientDecode.email,
          phone: clientDecode.phone,
          city: clientDecode.city,
          role: clientDecode.role,
          userCodeId: clientDecode.userCodeId,
        }
      })
    })
}
