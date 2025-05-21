import PaginatedDataTable from "@/ui/tables/PaginatedDataTable";
import { fetchPage, FetchPageProps } from "@/api/common";
import { TranslatedWordWrapper as T } from "@/ui/TranslatedWord";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Omit<FetchPageProps, "api">>;
}) {
  const params = await searchParams;

  const { data: languages } = await fetchPage({ api: "languages" });

  const columns = [
    {
      key: "key",
      name: "Code",
    },
    ...languages.map((l) => ({
      key: l.code,
      name: l.name,
    })),
  ];

  return (
    <>
      <h1>
        <T>Translations</T>
      </h1>
      <PaginatedDataTable
        columns={columns}
        dataSearchParams={{ ...params, api: "translate" }}
      />
    </>
  );
}
