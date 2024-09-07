import { PAGINATION_CONSTANTS } from '../constants/query.constant';
import { IQueryPagination } from '../interfaces/query.interface';

export function getSkipAndLimitFromQuery(query: any) {
  const limit: number = query.page_size
    ? parseInt(query.page_size)
    : PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;
  const skip: number = query.page_no
    ? (parseInt(query.page_no) - 1) * limit
    : (PAGINATION_CONSTANTS.DEFAULT_PAGE_NO - 1) * limit;
  return { skip, limit };
}

export function getPaginationObject(offset, limit, total): IQueryPagination {
  const page = offset / limit + 1;
  const page_size = limit;
  const page_count = Math.ceil(total / limit);
  return { page, page_size, page_count, total };
}
