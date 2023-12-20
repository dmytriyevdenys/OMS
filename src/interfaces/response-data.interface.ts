
export type ResponseData<T> = {
    success: boolean;
    status_code: number
    data: T;
  };

  export type ResponseDataPagination<T> = ResponseData<T> & {
    current_page: number,
    per_page: number,
    total_pages: number,
    total: number,
    first_page: string,
    next_page: string,
    last_page: string
    previous_page: string
  } 