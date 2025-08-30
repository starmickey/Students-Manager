import Card from "@/ui/Card";
import DualView from "@/ui/DualView";
import DualViewButton from "@/ui/DualViewButton";
import PaginatedDataTable from "@/ui/tables/DataTable";
import T from "@/ui/TranslatedWord";

export default async function Page() {
  return (
    <>
      <h1 className="page-title">
        <T>Courses</T>
      </h1>
      <DualView
        views={[
          {
            type: "list",
            content: (
              <PaginatedDataTable
                columns={[
                  {
                    key: "title",
                  },
                ]}
                data={[
                  {
                    title: "Math",
                  },
                ]}
              />
            ),
          },
          {
            type: "grid",
            content: (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-8">
                <Card title="Matemáticas" description="" />
                <Card
                  title="Matemáticas"
                  description="Aprlve problemas paso a paso."
                />
                <Card
                  title="Matemáticas"
                  description="Aprende los fundamentos y resuelve problemas paso a paso."
                />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
