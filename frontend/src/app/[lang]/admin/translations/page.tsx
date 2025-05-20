import { TranslatedWordWrapper as T } from "@/ui/TranslatedWord";
import { fetchLanguagesPage, fetchTranslationsPage } from "@/api/translatorApi";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sort?: string;
    sortOrder?: string;
  };
}) {
  const { data: words } = await fetchTranslationsPage({
    ...(searchParams?.page && {
      page: Number(searchParams?.page) || 1,
      pageSize: 10,
    }),
    sort: searchParams?.sort || "key",
    sortOrder: searchParams?.sortOrder || "asc",
  });

  const { data: languages } = await fetchLanguagesPage();

  return (
    <table className="minimalistic-table">
      <thead>
        <tr>
          <th><T>Code</T></th>
          {languages.map((language, index) => (
            <th key={index} className="capitalize">
              <T>{language.name}</T>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {words.map((word, index) => (
          <tr key={index}>
            <td><pre>{word.key || ""}</pre></td>
            {languages.map((language, index) => (
              <td key={index} className="capitalize">{word.translations?.[language.code] || ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
