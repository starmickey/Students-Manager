import {Model as MongooseModel, SortOrder} from 'mongoose';
import {BadRequest} from '../config/exceptions';

export interface FetchPageProps<T> {
  model: MongooseModel<T>;
  page?: number;
  pageSize?: number;
  sort?:
    | string
    | {[key: string]: SortOrder | {$meta: any}}
    | [string, SortOrder][]
    | null;
}

export interface Page<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function fetchPage<T>({
  page,
  pageSize,
  model,
  sort,
}: FetchPageProps<T>): Promise<Page<T>> {
  if ((page && page <= 0) || (pageSize && pageSize <= 0)) {
    throw new BadRequest('Page and pageSize must be positive integers');
  }

  const total = await model.countDocuments();
  let query = model.find();

  // Pagination logic
  let skip = 0;
  let limit = total;
  let currentPage = 1;
  let currentPageSize = total;
  let totalPages = 1;

  if (page && pageSize) {
    totalPages = Math.ceil(total / pageSize);
    skip = (page - 1) * pageSize;

    if (total > 0 && skip >= total) {
      throw new BadRequest('Page exceeds total number of available pages');
    }

    limit = pageSize;
    currentPage = page;
    currentPageSize = pageSize;

    query = query.skip(skip).limit(limit);
  }

  // Apply sorting only if sort is defined
  if (sort) {
    query = query.sort(sort);
  }

  const data: T[] = await query.exec();

  return {
    data,
    page: currentPage,
    pageSize: currentPageSize,
    total,
    totalPages,
  };
}
