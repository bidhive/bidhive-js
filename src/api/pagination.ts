export interface PaginatedResponse<Type> {
  count: number;
  page: number;
  limit: number;
  page_count: number;
  next: number | null;
  previous: number | null;
  results: Type[];
}
