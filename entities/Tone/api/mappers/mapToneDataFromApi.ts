import * as Sentry from "@sentry/nextjs"
import { ITone } from "@/entities/Tone"

export const mapToneDataFromApi = (toneDB: Object) => {
  const tone: ITone = {
    _id: '',
    label: '',
    createdAt: '',
    updatedAt: ''
  }

  for (let prop of Object.keys(tone)) {
    // check - is needed prop exists?
    if(Object.keys(toneDB).includes(prop)) {
      /*
      * here we can implement some additional checks of props
      * */

      // @ts-ignore // check - match by type
      if (typeof tone[`${prop}`] === typeof toneDB[`${prop}`] || tone[`${prop}`] === null) tone[`${prop}`] = toneDB[`${prop}`]
      else Sentry.captureMessage(`mapToneDataFromApi Custom Error: '${prop}' in toneDB(${toneDB}) has a strange type, typeof prop=${typeof prop}`);

    } else {
      Sentry.captureMessage(`mapToneDataFromApi Custom Error: not found '${prop}' in toneDB(${toneDB}), typeof toneDB=${typeof toneDB}`);
    }
  }

  return tone
}
