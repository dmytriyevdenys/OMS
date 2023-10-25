
export type ResponseData<T> = {
    success: boolean;
    status_code: number
    data: T;
  };