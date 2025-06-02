import { getEnvironment } from "@/config/env";

/**
 * Props required to fetch paginated data from a backend API.
 */
export interface FetchPageProps {
  /** API route name (relative to the backend, e.g., "users", "translate", etc.) */
  api: string;

  /** Current page number (starts at 1) */
  page?: number;

  /** Number of items per page */
  pageSize?: number;

  /** Field name to sort by */
  sort?: string;

  /** Sort order: typically 'asc' or 'desc' */
  sortOrder?: string;
}

/**
 * Generic interface representing paginated data returned from the backend.
 */
export interface PaginatedData<T> {
  /** Array of returned items for the current page */
  data: T[];

  /** Current page number */
  page: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of items available */
  total: number;

  /** Total number of pages available */
  totalPages: number;
}

/**
 * fetchPage
 *
 * Reusable helper to retrieve paginated API results.
 * Constructs a server URL with the appropriate query params and
 * fetches the result using the given API path.
 *
 * @template T - The type of the individual data items in the result
 * @param {FetchPageProps} props - Pagination and sorting parameters
 * @returns {Promise<PaginatedData<T>>} - A promise resolving to paginated data
 *
 * @throws Will throw if the fetch request fails (e.g., network error or non-OK status)
 */
export async function fetchPage<T>({
  api,
  page,
  pageSize,
  sort,
  sortOrder,
}: FetchPageProps): Promise<PaginatedData<T>> {
  const { serverURI } = getEnvironment();

  // Build complete URL to the target backend endpoint
  const url = new URL(`/${api}`, serverURI);

  // Add optional query parameters if provided
  if (page) url.searchParams.append("page", page.toString());
  if (pageSize) url.searchParams.append("pageSize", pageSize.toString());
  if (sort) url.searchParams.append("sort", sort);
  if (sortOrder) url.searchParams.append("sortOrder", sortOrder);

  const response = await fetch(url.toString());

  // Throw error if server responds with failure
  if (!response.ok) {
    throw new Error(`Failed to fetch ${api}: ${response.statusText}`);
  }

  // Parse and return the result as typed paginated data
  const jsonResponse = await response.json();
  return jsonResponse as PaginatedData<T>;
}
