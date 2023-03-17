import { fixMeInTheFuture } from "@/lib/types"
import { Notification } from "@/stores/notificationsStore"

export const getNotifications = async ({
                                         currentUserId,
                                          notificationsRef,
                                    }: {
  currentUserId: string,
  notificationsRef: fixMeInTheFuture
}): Promise<Array<Notification>> => {

  return await notificationsRef
    .where("userId", "==", currentUserId)
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
}
