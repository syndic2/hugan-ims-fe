import { AxiosResponse, AxiosError } from "axios";
import axios from '../../commons/axios';

import { BaseResponse, BaseListResponse, UnknownResponse } from "../../commons/common";
import {
  GetTransactionsQuery,
  GetTransactionsItemRes,
  GetTransactionsSelectQuery,
  GetTransactionParam,
  GetTransactionRes,
  GetDeliveryNoteTransactionQuery,
  AddPurchaseTransactionBody,
  AddSaleTransactionBody,
  AddSplitStockProductBody
} from "./contracts";

export class TransactionService {

  static async getTransactions(query: GetTransactionsQuery): Promise<BaseListResponse<GetTransactionsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetTransactionsItemRes>> = await axios.get('/transaction', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getTransactionsSelect(query: GetTransactionsSelectQuery): Promise<BaseListResponse<string> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<string>> = await axios.get('/transaction/select', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getTransaction(param: GetTransactionParam): Promise<BaseResponse<GetTransactionRes> | BaseResponse<null>> {
    try {
      const { transaction_id } = param;
      const { data }: AxiosResponse<BaseResponse<GetTransactionRes>> = await axios.get(`/transaction/nota?id=${transaction_id}`);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getDeliveryNoteTransaction(query: GetDeliveryNoteTransactionQuery): Promise<BaseResponse<string> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<string>> = await axios.get('/transaction/delivery-note', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addPurchaseTransaction(body: AddPurchaseTransactionBody): Promise<BaseResponse<any>> {
    try {
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.post('/transaction/purchase', body);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addSaleTransaction(body: AddSaleTransactionBody): Promise<BaseResponse<any>> {
    try {
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.post('/transaction/sales', body);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addSplitStockProduct(body: AddSplitStockProductBody): Promise<BaseResponse<any>> {
    try {
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.post('/transaction/split', body);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
