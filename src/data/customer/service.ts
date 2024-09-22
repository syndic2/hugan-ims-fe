import { AxiosResponse, AxiosError } from 'axios';
import axios from '../../commons/axios';

import { BaseResponse, BaseListResponse, UnknownResponse } from '../../commons/common';
import {
  GetCustomersQuery,
  GetCustomersItemRes,
  GetCustomersSelectItemRes,
  GetCustomerParam,
  GetCustomerRes,
  AddCustomerBody,
  AddCustomerRes,
  UpdateCustomerParam,
  UpdateCustomerBody
} from './contracts';

export class CustomerService {

  static async getCustomers(query: GetCustomersQuery): Promise<BaseListResponse<GetCustomersItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetCustomersItemRes>> = await axios.get('/customers', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getCustomersSelect(): Promise<BaseListResponse<GetCustomersSelectItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetCustomersItemRes>> = await axios.get('/customers/select');

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getCustomer(param: GetCustomerParam): Promise<BaseResponse<GetCustomerRes> | BaseResponse<null>> {
    try {
      const { id } = param;
      const { data }: AxiosResponse<BaseResponse<GetCustomerRes>> = await axios.get(`/customers/${id}`);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addCustomer(body: AddCustomerBody): Promise<BaseResponse<AddCustomerRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<AddCustomerRes>> = await axios.post('/customers', body, {
        headers: {
          Accept: 'application/json',
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

  static async updateCustomer(param: UpdateCustomerParam, body: UpdateCustomerBody): Promise<BaseResponse<any>> {
    try {
      const { id } = param;
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.put('/customers', { id, ...body });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
