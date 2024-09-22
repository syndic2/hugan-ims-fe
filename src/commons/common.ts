export interface BaseListQueryParam {
  q?: string;
  page: number;
  limit: number;
}

export interface BaseListResponse<T> extends BaseResponse<{
  count?: number,
  total_page?: number,
  result?: T[];
}> { }

export interface BaseResponse<T> {
  status?: boolean;
  message?: string;
  data?: T;
}

export const UnknownResponse: BaseResponse<null> = {
  status: false,
  message: "Terjadi sesuatu. Silahkan hubungi developer",
  data: null
};

export interface BaseSelect<T, T1 = any> {
  label: string;
  value: T;
  data?: T1;
}
