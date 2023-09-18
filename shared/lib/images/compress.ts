import Compressor from "compressorjs"

export const compress = async (
  file: File,
  quality: number = 0.6,
  maxHeight: number,
  maxWidth: number,
  convertSize?: number
): Promise<File | Blob> => {
  return await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxHeight,
      maxWidth,
      convertSize,
      success: resolve,
      error: reject,
    })
  })
}
