import * as Sentry from '@sentry/nextjs'
import { IUserOfDB } from '../../types/user'

/*
* convert user data from backend to frontend entity format
* */
export const mapUserDataFromApi = (userDB: Object): IUserOfDB => {
  const user: IUserOfDB = {
    id: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    role: 0,
    userCodeId: '',
    country: ''
  }

  for (let prop of Object.keys(user)) {
    // check - is needed prop exists?
    if (Object.keys(userDB).includes(prop)) {
      // @ts-ignore // check - match by type
      if (typeof user[`${prop}`] === typeof userDB[`${prop}`] || user[`${prop}`] === null) user[`${prop}`] = userDB[`${prop}`]
      else Sentry.captureMessage(`spreadUserEntity Custom Error: '${prop}' in userDB(${userDB}) has a strange type, typeof prop=${typeof prop}`);

    } else {
      Sentry.captureMessage(`spreadUserEntity Custom Error: not found '${prop}' in userDB(${userDB}), typeof userDB=${typeof userDB}`);
    }
  }

  return user
}
