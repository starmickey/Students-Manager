import {Model as MongooseModel, SortOrder} from 'mongoose';
import {BadRequest} from '../config/exceptions';

/**
 * FetchPageProps<T>
 * 
 * Interface defining parameters for paginated data fetching.
 * 
 * Properties:
 *  - model: Mongoose model representing the collection to query.
 *  - page: Optional page number (1-based).
 *  - pageSize: Optional number of items per page.
 *  - sort: Optional sorting criteria. Can be:
 *      - string (field name),
 *      - object mapping field names to SortOrder or $meta,
 *      - array of [field, SortOrder] tuples,
 *      - or null to disable sorting.
 */
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

/**
 * Page<T>
 * 
 * Interface defining the structure of a paginated response.
 * 
 * Properties:
 *  - data: Array of fetched documents of type T.
 *  - page: Current page number.
 *  - pageSize: Number of items per page.
 *  - total: Total number of documents in the collection.
 *  - totalPages: Total number of pages available.
 */
export interface Page<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * fetchPage<T>
 * 
 * Fetches a paginated and optionally sorted page of documents from a MongoDB collection using Mongoose.
 * 
 * Behavior:
 *  - Validates that page and pageSize, if provided, are positive integers.
 *  - Calculates total documents and total pages.
 *  - Throws BadRequest error if page exceeds available pages.
 *  - Applies skip and limit for pagination.
 *  - Applies sorting if provided.
 * 
 * @param props - Object containing fetch options (model, page, pageSize, sort).
 * @returns Promise resolving to a Page<T> object containing paginated data and metadata.
 * 
 * @throws BadRequest if invalid page/pageSize or page exceeds available pages.
 */
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

  // Pagination defaults
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

  // Apply sorting if provided
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
