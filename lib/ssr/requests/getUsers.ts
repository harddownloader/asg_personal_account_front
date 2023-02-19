import { fixMeInTheFuture } from "@/lib/types"
import { UserOfDB } from "@/stores/userStore"

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
}

export type getAllClients = {
  usersRef: fixMeInTheFuture
}

export const getAllClients = async ({
                                      usersRef
                                    }: getAllClients): Promise<Array<UserOfDB>> => {
  return await usersRef
    .where("role", "==", 0)
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
