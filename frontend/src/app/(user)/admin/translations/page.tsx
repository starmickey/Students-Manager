import PaginatedDataTable, { Column } from "@/ui/tables/DataTable";
import { fetchPage, FetchPageProps } from "@/services/paginator";
import T from "@/ui/TranslatedWord";
import AMTranslationModal from "./AMTranslationModal";
import { Language } from "@/types/translator";
import Button from "@/ui/form/Button";
import { PiPencil, PiTrash } from "react-icons/pi";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Omit<FetchPageProps, "api">>;
}) {
  // Obtener parámetros de la URL
  const params = await searchParams;

  // Obtener datos de la base de datos
  const [languages, translations] = await Promise.all([
    fetchPage<Language>({ api: "languages" }),
    fetchPage<Record<string, string>>({
      pageSize: 15,
      ...params,
      api: "translate",
    }),
  ]);

  // Crear configuración de tabla
  const columns: Column[] = [
    {
      key: "key",
      name: "Code",
    },
    ...languages.data.map((lang) => ({
      key: lang.code,
      name: lang.name,
    })),
    {
      key: "updateBtn",
    },
    {
      key: "removeBtn",
    },
  ];

  const tableData = translations.data.map((data) => ({
    ...data,
    updateBtn: (
      <AMTranslationModal
        action="update"
        languages={languages.data}
        word={{
          key: data.key,
          translations: Object.entries(data)
            .map(([langCode, word]) => ({
              langCode,
              word,
            }))
            .filter((d) => d.langCode !== "key"),
        }}
        trigger={
          <Button title="Update translation" variant="ghost">
            <PiPencil />
          </Button>
        }
      />
    ),
    removeBtn: (
      <Button title="Remove" variant="ghost">
        <PiTrash />
      </Button>
    ),
  }));

  return (
    <div className="admin-view">
      {/* Page header */}
      <section className="admin-view-header">
        <h1 className="page-title">
          <T>Translations</T>
        </h1>

        {/* Modal button to create a new translation */}
        {languages.data.length > 0 && (
          <AMTranslationModal
            action="create"
            languages={languages.data}
            trigger={
              <Button title="Create translation">
                <T>New</T>
              </Button>
            }
          />
        )}
      </section>

      <section>
        {languages.data.length > 0 && translations.data.length > 0 ? (
          // Data table showing all translations with pagination
          <PaginatedDataTable
            columns={columns}
            data={tableData}
            pagination={{
              page: translations.page,
              totalPages: translations.totalPages,
            }}
          />
        ) : languages.data.length > 0 ? (
          <T>No translations</T>
        ) : (
          <T>No languages created, please create one to create translations.</T>
        )}
      </section>
    </div>
  );
}
