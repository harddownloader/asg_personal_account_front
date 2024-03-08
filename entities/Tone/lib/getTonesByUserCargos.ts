import { ICargoFull } from "@/entities/Cargo"
import { ITone, TToneId } from "@/entities/Tone"

export const getTonesByUserCargos = async (cargos: ICargoFull[]): Promise<ITone[]> => {
  const tones: ITone[] = []
  const tonesIds: TToneId[] = []
  cargos.forEach((cargo) => {
    if (!tonesIds.includes(cargo.tone.id)) {
      tonesIds.push(cargo.tone.id)
      tones.push(cargo.tone)
    }
  })

  return tones
}
