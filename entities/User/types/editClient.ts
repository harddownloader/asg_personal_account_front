import {
  IUser,
  TUserId,
  TUserCodeId,
  TUserCity
} from './user'

export interface ISaveClientProfile extends IUser {
  id: TUserId
  userCodeId: TUserCodeId
  city: TUserCity
}
