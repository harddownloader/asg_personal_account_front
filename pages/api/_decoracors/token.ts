import { createParamDecorator, UnauthorizedException } from 'next-api-decorators'
import { AUTHORIZATION_HEADER_KEY } from '@/shared/lib/providers/auth'

export const JwtToken = createParamDecorator<string | void>(
  (req) => {
    const authHeader = String(req.headers[AUTHORIZATION_HEADER_KEY] || '');
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length);
      // const payload = jwtDecode(token) as JwtPayload;
      return token
    }

    throw new UnauthorizedException('token wasn\'t found')
    return
  }
)
