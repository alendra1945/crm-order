export class JwtPayload {
  email?: string;
  id?: string;
  jti?: string;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
}
