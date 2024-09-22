export interface AuthLoginBody {
  uname?: string;
  pass?: string;
}

export interface AuthLoginRes {
  token?: string;
}

export interface AuthRefreshTokenRes {
  token?: string;
}
