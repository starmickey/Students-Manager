import { getSignInPath } from "@/config/env";
import GoogleSignInCardContent from "@/ui/form/oauth/GoogleSignInCardContent";

export default async function GoogleSignInCard() {
  const backendAuthPath = getSignInPath();

  return <GoogleSignInCardContent backendAuthPath={backendAuthPath} />;
}
