export interface AccessToken {
  accessToken: string;
}
export interface RefreshToken {
  refreshToken: string;
}
export type Tokens = AccessToken & RefreshToken;
