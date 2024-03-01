import { ITone, mapToneDataFromApi, TONES_DB_COLLECTION_NAME } from "@/entities/Tone";


export const getAllTonesSSR = async (db: FirebaseFirestore.Firestore) => {
  const tonesRef = await db.collection(TONES_DB_COLLECTION_NAME)

  const allTones = await tonesRef.get().then((tones) => {
    const tonesList: ITone[] = []
    tones.forEach((tone) => {
      const toneDecode = {...tone.data()}
      tonesList.push(mapToneDataFromApi({
        id: tone.id,
        ...toneDecode
      }))
    })

    return tonesList
  })

  return allTones
}
