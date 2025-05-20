import { getEnvironment } from "@/config/env";
import { PaginatedData } from "./types";

export interface FetchPageProps {
  api: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortOrder?: string;
}

export async function fetchPage<T>({
  api,
  page,
  pageSize,
  sort,
  sortOrder,
}: FetchPageProps): Promise<PaginatedData<T>> {
  const { serverURI } = getEnvironment();
  const url = new URL(`/${api}`, serverURI);
  if (page) url.searchParams.append("page", page.toString());
  if (pageSize) url.searchParams.append("pageSize", pageSize.toString());
  if (sort) url.searchParams.append("sort", sort);
  if (sortOrder) url.searchParams.append("sortOrder", sortOrder);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch ${api}: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse as PaginatedData<T>;
}
