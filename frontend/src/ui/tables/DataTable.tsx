import T from "@/ui/TranslatedWord";
import Pagination from "./Pagination";

export interface Column {
  key: string;
  name?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  pagination?: {
    page: number;
    totalPages: number;
  };
}

export default async function DataTable({
  data,
  columns,
  pagination,
}: DataTableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="minimalistic-table">
          {columns.find((c) => c.name) && (
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="capitalize">
                    {column.name && <T>{column.name}</T>}
                  </th>
                ))}
              </tr>
            </thead>
          )}
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
      </div>
      {pagination && (
        <div className="flex justify-end">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        </div>
      )}
    </>
  );
}
