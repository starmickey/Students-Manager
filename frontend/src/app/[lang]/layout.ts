import { Environment } from "@/config/env";

export default async function Layout({
  params,
  children,
}: Readonly<{
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}>)
{
  const { lang } = await params;
  Environment.setLanguage(lang);

  return children;
}