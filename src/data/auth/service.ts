import axios, { AxiosResponse, AxiosError } from "axios";

import { BaseResponse, UnknownResponse } from '../../commons/common';
import { AuthLoginBody, AuthLoginRes, AuthRefreshTokenRes } from './contracts';

export class AuthService {

  static async login(body: AuthLoginBody): Promise<BaseResponse<AuthLoginRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<AuthLoginRes>> = await axios.post(`${process.env.API_URL}/auth/login`, body, {
        headers: {
          Accept: 'application/json'
        }
      });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async refreshToken(): Promise<BaseResponse<AuthRefreshTokenRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<AuthLoginRes>> = await axios.get(`${process.env.API_URL}/auth/refresh-token`, {
        headers: {
          Accept: 'application/json'
        }
      });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
