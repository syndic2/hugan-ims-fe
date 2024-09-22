import { AxiosResponse, AxiosError } from 'axios';
import axios from '../../commons/axios';

import { BaseResponse, BaseListResponse, UnknownResponse } from '../../commons/common';
import {
  GetSuppliersQuery,
  GetSuppliersItemRes,
  GetSuppliersSelectItemRes,
  GetSupplierParam,
  GetSupplierRes,
  AddSupplierBody,
  AddSupplierRes,
  UpdateSupplierParam,
  UpdateSupplierBody
} from './contracts'

export class SupplierService {

  static async getSuppliers(query: GetSuppliersQuery): Promise<BaseListResponse<GetSuppliersItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetSuppliersItemRes>> = await axios.get('/suppliers', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getSuppliersSelect(): Promise<BaseListResponse<GetSuppliersSelectItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetSuppliersItemRes>> = await axios.get('/suppliers/select');

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  };

  static async getSupplier(param: GetSupplierParam): Promise<BaseResponse<GetSupplierRes> | BaseResponse<null>> {
    try {
      const { id } = param;
      const { data }: AxiosResponse<BaseResponse<GetSupplierRes>> = await axios.get(`/suppliers/${id}`);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addSupplier(body: AddSupplierBody): Promise<BaseResponse<AddSupplierRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<AddSupplierRes>> = await axios.post('/suppliers', body);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async updateSupplier(param: UpdateSupplierParam, body: UpdateSupplierBody): Promise<BaseResponse<any>> {
    try {
      const { id } = param;
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.put('/suppliers', { id, ...body });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
