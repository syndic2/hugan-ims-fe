import { AxiosResponse, AxiosError } from "axios";
import axios from '../../commons/axios';

import { BaseResponse, BaseListResponse, UnknownResponse } from "../../commons/common";
import {
  GetProductsQuery,
  GetProductsItemRes,
  GetProductsSelectItemRes,
  GetProductParam,
  GetProductRes,
  AddProductBody,
  AddProductRes,
  UpdateProductParam,
  UpdateProductBody
} from "./contracts";

export class ProductService {

  static async getProducts(query: GetProductsQuery): Promise<BaseListResponse<GetProductsItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetProductsItemRes>> = await axios.get('/products', { params: query });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getProductsSelect(): Promise<BaseListResponse<GetProductsSelectItemRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseListResponse<GetProductsItemRes>> = await axios.get('/products/select');

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async getProduct(param: GetProductParam): Promise<BaseResponse<GetProductRes> | BaseResponse<null>> {
    try {
      const { product_code } = param;
      const { data }: AxiosResponse<BaseResponse<GetProductRes>> = await axios.get(`/products/${product_code}`);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async addProduct(body: AddProductBody): Promise<BaseResponse<AddProductRes> | BaseResponse<null>> {
    try {
      const { data }: AxiosResponse<BaseResponse<AddProductRes>> = await axios.post('/products', body);

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }

  static async updateProduct(param: UpdateProductParam, body: UpdateProductBody): Promise<BaseResponse<any>> {
    try {
      const { product_code } = param;
      const { data }: AxiosResponse<BaseResponse<any>> = await axios.put('/products', { product_code, ...body });

      return data;
    } catch (err: any) {
      const error: AxiosError<BaseResponse<any>> = err;
      const { response } = error;

      if (!response) return UnknownResponse;

      return response.data;
    }
  }
}
