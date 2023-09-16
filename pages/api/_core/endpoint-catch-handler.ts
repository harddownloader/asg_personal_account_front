import {
  BadRequestException, ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "next-api-decorators"
import { NextApiRequest, NextApiResponse } from "next/types"

function exceptionHandler(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  res.status(200).json({ success: false, error: message });
}

export const endpointCatchHandler = (error: {
  statusCode: number
  errors?: string[]
  message: string
}, response: NextApiResponse) => {
  console.log(`endpointCatchHandler statusCode:${error?.statusCode}`)

  switch (error?.statusCode) {
    case 400:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.errors
      })
      break
    case 401:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 403:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 404:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 409:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 413:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 422:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    case 500:
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      })
      break
    default:
      return response.status(500).json({
        statusCode: 500,
        message: error.message
      })
  }
}

export const exceptionsAdapter = (error: any) => {
  if (!(error?.name && typeof error.name === 'string')) return null
  console.log({exceptionsAdapter: error})

  switch (error.name) {
    case 'BadRequestException':
      throw new BadRequestException(error.message, error.errors)
      break
    case 'UnauthorizedException':
      throw new UnauthorizedException(error.message)
      break
    case 'ForbiddenException':
      throw new ForbiddenException(error.message)
      break
    case 'NotFoundException':
      throw new NotFoundException(error.message)
      break
    case 'ConflictException':
      throw new ConflictException(error.message)
      break
    case 'PayloadTooLargeException':
      throw new PayloadTooLargeException(error.message)
      break
    case 'UnprocessableEntityException':
      throw new UnprocessableEntityException(error.message)
      break
    case 'InternalServerErrorException':
      throw new InternalServerErrorException(error.message)
      break

    default:
      return null
  }
}
