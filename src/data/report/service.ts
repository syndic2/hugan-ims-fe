import { AxiosResponse, AxiosError } from 'axios';
import axios from '../../commons/axios';

import { BaseListResponse, BaseResponse, UnknownResponse } from '../../commons/common';
import {
  GetSalesVolumeReportsQuery,
  GetSalesVolumeReportsRes,
  GetProductReportsQuery,
  GetProductReportsItemRes,
  GetSupplierReportsQuery,
  GetSupplierReportsItemRes,
  GetCustomerReportsQuery,
  GetCustomerReportsItemRes,
  GetTransactionReportsQuery,
  GetTransactionReportsItemRes
} from './contracts';

export class ReportService {

  static async getSalesVolumeReports(query: GetSalesVolumeReportsQuery): Promise<BaseResponse<GetSalesVolumeReportsRes[]> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<GetSalesVolumeReportsRes[]>> = await axios.get('/report/omset', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getProductReports(query: GetProductReportsQuery): Promise<BaseListResponse<GetProductReportsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetProductReportsItemRes>> = await axios.get('/report/products', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getSupplierReports(query: GetSupplierReportsQuery): Promise<BaseListResponse<GetSupplierReportsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetSupplierReportsItemRes>> = await axios.get('/report/supplier', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getCustomerReports(query: GetCustomerReportsQuery): Promise<BaseListResponse<GetCustomerReportsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetCustomerReportsItemRes>> = await axios.get('/report/customer', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getTransactionReports(query: GetTransactionReportsQuery): Promise<BaseListResponse<GetTransactionReportsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetTransactionReportsItemRes>> = await axios.get('/report/transaction', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
