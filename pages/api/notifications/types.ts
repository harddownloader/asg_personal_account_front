import { Socket } from 'socket.io';
import { Request } from 'express';
import { USER_ROLE } from '@/pages/api/notifications/const';
import type {
  TCountry,
  TEmail,
  TRole,
  TUserRegionExists
} from '@/pages/api/users/types';

export type TTFixMeInTheFuture = any;

export type TUserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export type TUserName = string;
export type TUserEmail = string;
export type TUserPhone = string;
export type TUserId = string;
export type TUserCodeId = string | null;
export type TUserCity = string | null;
export type TPasswordType = string;

export interface IUser {
  name: TUserName;
  email: TUserEmail;
  phone: TUserPhone;
}

export interface IUserOfDB extends IUser {
  id: TUserId;
  userCodeId: TUserCodeId;
  city: TUserCity;
  role: TUserRole;
}

// notifications
export type TNotificationTitle = string;
export type TNotificationContent = string;

export type TNotificationId = string;
export type TNotificationStatus = boolean;

export interface TNotification {
  id: TNotificationId;
  userId: TUserId;
  title: TNotificationTitle;
  content: TNotificationContent;
  isViewed: TNotificationStatus;
}

// guard types
export type TAuthPayload = {
  name: TUserName;
  email: TEmail;
  country: TCountry;
  userRegionExists: TUserRegionExists;
  role: TRole;
};

export type TRequestWithAuth = Request & TAuthPayload;
export type TSocketWithAuth = Socket & TAuthPayload;
