export interface IPaginatedData<T> {
  data: T[];
  page: number;
  total: number;
  pages: number;
  perPage: number;
}
