import { ReactNode } from 'react'

export interface UploadDropZoneProps {
  children: ReactNode
}

export const UploadDropZone = ({ children }: UploadDropZoneProps) => {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file"
               className="flex flex-col items-center justify-center w-full h-44 border-2 border-white border-dashed rounded-lg cursor-pointer text-white bg-brand transition hover:border-gray-300 hover:bg-white hover:text-brand">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-inherit" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            { children }
          </div>
        </label>
      </div>
    </>
  )
}
