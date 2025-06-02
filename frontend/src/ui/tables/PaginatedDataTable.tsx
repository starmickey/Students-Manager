import T from "@/ui/TranslatedWord";
import { fetchPage, FetchPageProps } from "@/services/paginator";
import Pagination from "./Pagination";

interface PaginatedDataTableProps {
  dataSearchParams: FetchPageProps;
  columns: {
    key: string;
    name: string;
  }[];
}

export default async function PaginatedDataTable({
  dataSearchParams,
  columns,
}: PaginatedDataTableProps) {
  const { data, page, totalPages } = await fetchPage<Record<string,string>>(
    dataSearchParams
  );

  return (
    <>
      <table className="minimalistic-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="capitalize">
                <T>{column.name}</T>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              {columns.map((column, index) => (
                <td key={index} className="capitalize">
                  {entry?.[column.key] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </>
  );
}
