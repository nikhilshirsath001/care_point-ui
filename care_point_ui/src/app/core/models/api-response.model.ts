export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface PageResponse<T> {
  content: T[];
  page: string;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}