import Navbar from "@/ui/Navbar";
import { ReactNode } from "react";

export default async function Layout({
  params,
  children,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang} />
      <main>{children}</main>
    </>
  );
}
