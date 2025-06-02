// File: app/admin/translations/page.tsx

import PaginatedDataTable from "@/ui/tables/PaginatedDataTable";
import { fetchPage, FetchPageProps } from "@/services/paginator";
import T from "@/ui/TranslatedWord";
import AMTranslationModal from "./AMTranslationModal";
import { Language } from "@/types/translator";

// The admin page for managing translations
export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Omit<FetchPageProps, "api">>;
}) {
  // Await any passed searchParams (usually used for filtering/pagination)
  const params = await searchParams;

  // Fetch the available languages from the backend
  const { data: languages } = await fetchPage<Language>({ api: "languages" });

  // Construct column definitions dynamically from the available languages
  const columns = [
    { key: "key", name: "Code" }, // Column for the main word key
    ...languages.map((lang) => ({
      key: lang.code,
      name: lang.name,
    })),
  ];

  return (
    <>
      {/* Page header */}
      <section className="flex justify-between flex-wrap items-start">
        <h1 className="flex-1 text-2xl font-bold">
          <T>Translations</T>
        </h1>

        {/* Modal button to create a new translation */}
        <div className="flex flex-wrap gap-4 items-center">
          <AMTranslationModal languages={languages} />
        </div>
      </section>

      {/* Data table showing all translations with pagination */}
      <section className="mt-4">
        <PaginatedDataTable
          columns={columns}
          dataSearchParams={{
            ...params,
            api: "translate", // Backend route to fetch translations
          }}
        />
      </section>
    </>
  );
}
