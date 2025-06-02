"use client";

import T from "@/ui/TranslatedWord";

export default function GoogleSignInCardContent({
  backendAuthPath,
}: {
  backendAuthPath: string;
}) {
  const handleClick = () => {
    window.location.href = backendAuthPath;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 hover:shadow transition duration-150"
    >
      <img
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>
        <T>Log in with Google</T>
      </span>
    </button>
  );
}
