import PaginatedDataTable from "@/ui/tables/PaginatedDataTable";
import { fetchPage, FetchPageProps } from "@/api/common";
import { TranslatedWordWrapper as T } from "@/ui/TranslatedWord";
import { Modal, TriggerModalButton } from "@/ui/display/TriggerModalButton";

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
      <TriggerModalButton targetId="create-translation">New</TriggerModalButton>
      <Modal id="create-translation">Hello</Modal>
      <PaginatedDataTable
        columns={columns}
        dataSearchParams={{ ...params, api: "translate" }}
      />
    </>
  );
}
