import { v4 as uuidv4 } from 'uuid'
import { Notification, NOTIFICATION_DB_COLLECTION_NAME } from "@/stores/notificationsStore"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"

export const createNotification = async ({
  recipientUserId,
  text,
                                       }: {
  recipientUserId: string,
  text: string,
}): Promise<Notification | null> => {
  const db = firebaseAdmin.firestore()
  const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)
  const notificationID: string = uuidv4()
  const newNotification: Notification = {
    id: notificationID,
    userId: recipientUserId,
    content: text,
    isViewed: false,
  }

  return await notificationsRef
    .doc(notificationID)
    .set(newNotification)
    .then(() => {

      return newNotification
    })
    .catch((e) => {
      console.warn('createNotification error', {e})
      return null
    })
}
