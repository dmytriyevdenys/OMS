
export type ResponseData<T> = {
    success: boolean;
    total: number;
    data: T;
  };