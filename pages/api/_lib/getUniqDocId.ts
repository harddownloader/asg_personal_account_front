import { v4 as uuidv4 } from "uuid"

export const getUniqDocId = async (
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
): Promise<string> => {
  const id = await getValidId(collectionRef)

  return id
}

/*
* generate a new ID(via recursion) until we get a valid one
*  */
const getValidId = async (
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
): Promise<string> => {
  const id: string = await uuidv4()
  const isIdValid = await checkUniqDocId(id, collectionRef)

  if (isIdValid) return id
  return await getValidId(collectionRef)
}

const checkUniqDocId = async (
  id: string,
  collectionRef:  FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
): Promise<boolean> => {
  const docRef = await collectionRef.doc(id)
  return await docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data())
      return false
    } else {
      console.log('no such document!')
      return true
    }
  }).catch((error) => {
    console.log(error)
    return false
  })
}
