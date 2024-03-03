import {
  TUserEmail,
  TUserName,
  TUserPhone,
  TUserCity,
  TUserId,
  TUserCodeId,
  TUserCountry,
} from "@/entities/User"

export interface IProfileContacts {
  name: TUserName
  email: TUserEmail
  phone: TUserPhone
  city: TUserCity
}

export interface ISaveContactUserDataArgs extends IProfileContacts {
  id: TUserId
  userCodeId: TUserCodeId
  country: TUserCountry
}
