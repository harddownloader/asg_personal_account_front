import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { fixMeInTheFuture } from "@/lib/types"
import { NOTIFICATION_DB_COLLECTION_NAME } from "@/stores/notificationsStore"

export const updateNotification = async (notificationID: string) => {
  const db = firebaseAdmin.firestore()
  const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)

  const currentNotificationArr = await notificationsRef
    .where("id", "==", notificationID)
    .get()
    .then((notifications: fixMeInTheFuture) => {
      return notifications.docs.map((notification: fixMeInTheFuture) => {
        const notificationDecode = {...notification.data()}

        return {
          id: notification.id,
          userId: notificationDecode.userId,
          content: notificationDecode.content,
          isViewed: notificationDecode.isViewed,
        }
      })
    })

  if (currentNotificationArr.length === 0) {
    console.warn('not found notification by id')
    return null
  }

  const currentNotification = currentNotificationArr[0]
  console.log('currentNotification', {currentNotification})

  // const newNotification = {
  //   id: notificationID,
  //   userId: recipientUserId,
  //   content: text,
  //   isViewed: false,
  // }
  //
  // return await notificationsRef
  //   .doc(notificationID)
  //   .set(newNotification)
  //   .then(() => {
  //     console.log('createNotification', {newNotification})
  //
  //     return newNotification
  //   })
}
