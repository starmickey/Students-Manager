import { fetchPage, FetchPageProps } from "@/services/paginator";
import { Language } from "@/types/translator";
import DataTable, { Column } from "@/ui/tables/DataTable";
import T from "@/ui/TranslatedWord";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Omit<FetchPageProps, "api">>;
}) {
  const params = await searchParams;
  const languages = await fetchPage<Language>({ ...params, api: "languages" });

  const columns: Column[] = [
    {
      key: "code",
      name: "Code",
    },
    {
      key: "name",
      name: "Language",
    },
  ];

  const tableData = languages.data.map(({ code, name }) => ({
    code,
    name: <T>{name}</T>,
  }));

  return (
    <div className="admin-view">
      {/* Page header */}
      <section className="admin-view-header">
        <h1 className="page-title">
          <T>Languages</T>
        </h1>
      </section>

      <section>
        {languages.data.length > 0 ? (
          <DataTable
            columns={columns}
            data={tableData}
            pagination={{
              page: languages.page,
              totalPages: languages.totalPages,
            }}
          />
        ) : (
          <T>No languages</T>
        )}
      </section>
    </div>
  );
}
