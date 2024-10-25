export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export interface PaginatedResult<T> {
  current_page: number;
  data: T[];
  total_items: number;
  total_pages: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: PaginatedResult<T>;
}
