export interface IList<T> {
  items?: Array<T>;
  paging?: IPaging;
}

export interface IPaging {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
