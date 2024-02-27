import { sign, verify } from 'jsonwebtoken';

export interface TokenPayload {
  userId?: string;
  sessionId?: string;
}
export function CreateAccessToken(payload: TokenPayload) {
  const token = sign(payload, process.env.SECRET_ACCESS_TOKEN);
  return token;
}

export const verifyAccessToken = (token) => {
  const decoded = verify(token, process.env.SECRET_ACCESS_TOKEN);
  return decoded;
};

export function CreateRefreshToken(payload: TokenPayload) {
  const token = sign(payload, process.env.SECRET_REFRESH_TOKEN);
  return token;
}

export const verifyRefreshToken = (refreshToken: string) => {
  const decoded = verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
  return decoded;
};
