import { fetchTranslation } from "@/api/translatorApi";
import { getEnvironment, getSignInPath } from "@/config/env";
import GoogleSignInCardContent from "@/ui/form/oauth/GoogleSignInCardContent";

export default async function GoogleSignInCard({
  // redirectPath = "main/students",
}: {
  // redirectPath?: string;
}) {
  const backendAuthPath = getSignInPath();
  // const { language } = getEnvironment();

  const label = await fetchTranslation("Login with Google");

  return (
    <GoogleSignInCardContent
      // redirectPath={`/${language}/${redirectPath}`}
      backendAuthPath={backendAuthPath}
      label={label}
    />
  );
}
