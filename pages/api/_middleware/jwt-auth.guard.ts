import {
  createMiddlewareDecorator,
  NextFunction,
  UnauthorizedException
} from "next-api-decorators";
import type {
  NextApiRequest,
  NextApiResponse
} from "next";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth";

export const checkParsedJwt = (parsedJwt: DecodedIdToken) => {
  return Boolean(
    parsedJwt?.aud !== null &&
    parsedJwt?.iat !== null &&
    parsedJwt?.exp !== null &&
    parsedJwt?.iss !== null &&
    parsedJwt?.sub !== null &&
    parsedJwt?.uid !== null
  )
}

const parseJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const validateJwt = (req: NextApiRequest) => {
  const authHeader = String(req.headers[AUTHORIZATION_HEADER_KEY] || '');
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);
    if (token && checkParsedJwt(parseJwt(token))) return true
  }

  return false
}

export const JwtAuthGuard = createMiddlewareDecorator(
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (!validateJwt(req)) {
      throw new UnauthorizedException('token not found');
    }

    next();
  }
);
