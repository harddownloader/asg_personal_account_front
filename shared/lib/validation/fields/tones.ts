import { TToneLabel } from "@/entities/Tone"
import {
  commonArgsForCheckType
} from "@/shared/lib/validation/fields/conditions"

export const checkToneName = ({
                            toneLabel,
                            responseErrorsArray,
                            fieldName,
                            errorMessage,
                          }: commonArgsForCheckType & { toneLabel: TToneLabel }) => {
  if (!toneLabel || toneLabel.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}
