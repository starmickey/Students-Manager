import { getEnvironment } from "@/config/env";

export interface FetchPageProps {
  api: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortOrder?: string;
}

export interface PaginatedData {
  data: Record<string,string>[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function fetchPage({
  api,
  page,
  pageSize,
  sort,
  sortOrder,
}: FetchPageProps): Promise<PaginatedData> {
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
  return jsonResponse as PaginatedData;
}
