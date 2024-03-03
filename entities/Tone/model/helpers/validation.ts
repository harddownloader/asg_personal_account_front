import { checkUserId } from "@/shared/lib/validation/fields/conditions"
import { checkToneName } from "@/shared/lib/validation/fields/tones"

// types
import {
  IUserOfDB,
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"
import { TToneLabel } from "@/entities/Tone"
import { TResponseFieldErrorsArray } from "@/shared/types"
import { CARGO_FIELD_NAMES } from "@/entities/Cargo"

export const checkAddTone = async ({
                                     toneLabel,
                                     responseErrorsArray,
                                     userId,
                                     country,
                                     token,
                                   }: {
  toneLabel: TToneLabel,
  responseErrorsArray: TResponseFieldErrorsArray,
  userId: TUserId | null | undefined,
  country: TUserCountry,
  token: TAccessToken | undefined,
}) => {
  const user: IUserOfDB | null = await checkUserId({
    id: userId,
    country,
    token,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'server',
    errorMessage: 'Что-то пошло не так (проблема с нахождением пользователя)'
  })

  await checkToneName({
    toneLabel,
    responseErrorsArray,
    fieldName: CARGO_FIELD_NAMES.TONE.value as string,
    errorMessage: 'Что-то пошло не так (проблема с именем новой тонны)',
  })

  return user
}
