import { TResponseFieldErrorsArray } from "@/shared/types"

export type TToneId = string
export type TToneIdState = TToneId | null
export type TToneLabel = string
export type TToneCreatedAt = string
export type TToneUpdatedAt = string

export interface ITone {
  id: TToneId
  label: TToneLabel
  createdAt: TToneCreatedAt
  updatedAt: TToneUpdatedAt
}

export interface IToneAddResponse {
  data: {
    addingTone: {
      errors: TResponseFieldErrorsArray
      newTone?: ITone
    }
  }
}
