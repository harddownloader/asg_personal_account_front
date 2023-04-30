import {
  UserInterface,
  UserIdType,
  UserCodeIdType,
  UserCityType
} from './user'

export interface SaveClientProfileInterface extends UserInterface {
  id: UserIdType
  userCodeId: UserCodeIdType
  city: UserCityType
}
