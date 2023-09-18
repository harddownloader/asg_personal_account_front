import { _NotificationsStore, _NotificationsListPooling } from "@/entities/Notification/model/store"

const rootStore = new _NotificationsStore()

// export stores
export const NotificationsStore = rootStore
export const NotificationsListPooling = new _NotificationsListPooling(rootStore)
