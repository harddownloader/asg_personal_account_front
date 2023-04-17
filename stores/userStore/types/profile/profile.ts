import {
  UserEmail,
  UserName,
  UserPhone,
  UserCityType,
} from "@/stores/userStore/types/user"

export interface ProfileContacts {
  name: UserName
  email: UserEmail
  phone: UserPhone
  city: UserCityType
}

export interface saveContactUserDataArgs extends ProfileContacts {

}
