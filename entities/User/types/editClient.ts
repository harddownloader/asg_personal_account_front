import {
  IUser,
  TUserId,
  TUserCodeId,
  TUserCity, TUserRole
} from './user'

export interface ISaveClientProfile extends IUser {
  id: TUserId
  userCodeId: TUserCodeId
  city: TUserCity
  role: TUserRole
}
