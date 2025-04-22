import Link from "next/link";
import FloatingBox from "@/ui/display/FloatingBox";
import Input from "@/ui/form/Input";
import { TranslatedWord } from "@/ui/TranslatedWord";
import Button from "@/ui/form/Button";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/LoadingSpinner";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const T = ({ children }: { children: string }) => (
    <TranslatedWord lang={lang} word={children} />
  );

  return (
    <FloatingBox size="small" imgSrc="/backgrounds/signin-texture.jpg">
      <Suspense fallback={<LoadingSpinner width={32} height={32}/>}>
        <form className="flex flex-col gap-8">
          <h1>
            <T>Sign In</T>
          </h1>
          <Input
            id="email"
            label="email"
            type="email"
            placeholder="mail@mail.com"
            isRequired={true}
            variant="primary"
            language={lang}
          />
          <div className="flex flex-col items-end">
            <Input
              id="password"
              label="password"
              type="password"
              placeholder="*********"
              isRequired={true}
              variant="primary"
              language={lang}
              autoComplete="current-password"
            />
            <Link href="@" className="text-sm">
              <T>Forget your password?</T>
            </Link>
          </div>
          <Button className="w-full mt-4" variant="primary">
            Submit
          </Button>
        </form>
      </Suspense>
    </FloatingBox>
  );
}
