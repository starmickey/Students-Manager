import T from "@/ui/TranslatedWord";
import Pagination from "./Pagination";
import { ReactNode } from "react";

export interface PaginatedTableColumn {
  key: string;
  name?: string;
}

interface PaginatedDataTableProps {
  data: any[];
  columns: PaginatedTableColumn[];
  page: number;
  totalPages: number;
}

export default async function PaginatedDataTable({
  data,
  columns,
  page,
  totalPages,
}: PaginatedDataTableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="minimalistic-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="capitalize">
                  {column.name && <T>{column.name}</T>}
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
      </div>
      <div className="flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </>
  );
}
