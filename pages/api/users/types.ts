// import { Condition } from "mongoose";
// import { ObjectId } from "mongodb";

import { ChangeUserRegionDto } from "./dto/change-user-region.dto";

export type TUserCodeId = string;
export type TUserName = string;
export type TEmail = string;
export type TPassword = string;
export type TRefreshToken = string | null;
export type TPhone = string;
export type TRole = number;
export type TCity = string;
export type TCountry = string;
export type TUserRegionExists = boolean;

export type TCountryOfLoginHistory = string;
export type TIpOfLoginHistory = string;
export type TLoginHistories = {
  country: TCountryOfLoginHistory;
  ip: TIpOfLoginHistory;
}

export type TUser = {
  userCodeId: TUserCodeId;
  name: TUserName;
  email: TEmail;
  password: TPassword;
  phone: TPhone;
  role: TRole;
  city: TCity;
  country: TCountry;
  userRegionExists: TUserRegionExists;
  loginHistory: TLoginHistories;
}

// export type TFullUser = TUser & {
//   // _id: string;
//   _id: Condition<ObjectId>;
// }

// change region
export type TCountryArg = string;
export type TIdArg = string;
export type TChangeArgs = {
  currentCountry: TCountryArg;
  id: TIdArg;
  changeUserRegionDto: ChangeUserRegionDto;
}
