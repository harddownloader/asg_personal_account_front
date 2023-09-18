export function splitArrayIntoSubArrays(hugeArray: Array<any>, sizeToSplit=10) {
  let arrayOfArrays = []
  for (let i=0; i<hugeArray.length; i+=sizeToSplit) {
    arrayOfArrays.push(hugeArray.slice(i,i+sizeToSplit))
  }
  return arrayOfArrays
}
