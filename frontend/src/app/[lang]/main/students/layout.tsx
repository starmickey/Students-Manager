import Sidebar, { SidebarElement } from "@/ui/display/Sidebar";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { ReactNode, Suspense } from "react";

const sidebarElements: SidebarElement[] = [
  {
    label: "Children",
    title: "Children",
    href: ""
  }
]

export default async function Layout({
  params,
  children,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <Suspense fallback={<LoadingSpinner width={32} height={32}/>}>
      <Sidebar elements={sidebarElements} />
      <main>{children}</main>
    </Suspense>
  );
}
