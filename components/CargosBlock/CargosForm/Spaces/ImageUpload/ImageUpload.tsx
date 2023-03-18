import React, { useMemo, useState, Fragment } from 'react'
import NextImage from 'next/image'
import { useDropzone } from 'react-dropzone'
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import Compressor from 'compressorjs'
import { observer } from "mobx-react-lite"

// mui
import { Grid } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

// project components
import { UploadDropZone } from '@/components/ui-component/UploadDropZone'
import { CircularProgressWithLabel } from "@/components/ui-component/CircularProgressWithLabel"

// utils
import { firebaseStorage } from "@/lib/firebase"
import { GRID_SPACING } from "@/lib/const"
import {fixMeInTheFuture} from "@/lib/types"

// assets
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

// store
import CargosStore, {
  UploadImageType,
  UPLOAD_IMAGE_STATUS_UPLOADING,
  UPLOAD_IMAGE_STATUS_SUCCESS,
  UPLOAD_IMAGE_STATUS_ERROR
} from '@/stores/cargosStore'

export interface ImageInputProps {
  addPhotoHandler: ((fileInfo: {
    file: File,
    metadata: object,
    fileIndex: number
  }) => Promise<void | undefined>) | undefined
  currentUploadingFiles: Array<UploadImageType>
}

export const ImageUpload = observer(({
                                       addPhotoHandler,
                                       currentUploadingFiles
}: ImageInputProps) => {
  const setMetadata = (file: File) => {
    const metadata = {
      width: null,
      height: null
    }

    const img = new Image()
    img.onload = function() {
      // alert(this.width + " " + this.height);
      // @ts-ignore
      metadata.width = this.width
      // @ts-ignore
      metadata.height = this.height
    }
    img.onerror = function() {
      alert( "not a valid file: " + file.type);
    }

    return metadata
  }

  const onDrop = async (acceptedFiles: Array<File>) => {
    acceptedFiles.map((file, fileIndex) => {
      console.log({file, fileIndex})
      const metadata = setMetadata(file)

      const fileInfoArgs = {
        file, metadata, fileIndex
      }
      addPhotoHandler && addPhotoHandler(fileInfoArgs)
      return
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  })

  const hideImageProgress = (id: string) => {
    CargosStore.hideUploadImageProgress(id)
  }

  const getProgressFileContent = (image: UploadImageType) => {
    if (!image.progress) return null

    const paddingClass = "p-1"
    switch(image.uploadStatus) {
      case UPLOAD_IMAGE_STATUS_UPLOADING:
        return (<Typography
          variant="caption"
          component="div"
          color="text.secondary"
          className={`${paddingClass}`}
        >{`${Math.round(image.progress)}%`}</Typography>)
      case UPLOAD_IMAGE_STATUS_SUCCESS:
        hideImageProgress(image.id)
        return (<CheckIcon className={`${paddingClass} text-green-500`} />)
      case UPLOAD_IMAGE_STATUS_ERROR:
        hideImageProgress(image.id)
        return (<CloseIcon className={`${paddingClass} text-red-500`} />)
      default:
        return null
    }
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <UploadDropZone>
        <p className="mb-2 text-sm text-inherit">
          <span className="font-semibold">Кликните</span> или <span className="font-semibold">перетащите</span></p>
        <p className="text-xs text-inherit">SVG, PNG, JPG или GIF чтобы загрузить.</p>
      </UploadDropZone>

      <div className={"flex"}>
        {
          Boolean(currentUploadingFiles?.length) &&
          currentUploadingFiles.map((file: UploadImageType) => {
            if (!file.progress) return null

            return (
              <Fragment key={file.id}>
                <div className={"p-2"}>
                  <CircularProgressWithLabel
                    color={"primary"}
                    key={file.id}
                    value={file.progress}
                  >
                    {getProgressFileContent(file)}
                  </CircularProgressWithLabel>
                </div>
              </Fragment>
            )
          })
        }
      </div>
    </div>
  )
})

export default ImageUpload