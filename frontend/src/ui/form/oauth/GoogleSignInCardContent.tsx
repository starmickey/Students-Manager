
"use client";

export default function GoogleSignInCardContent({
  // redirectPath,
  backendAuthPath,
  label,
}: {
  // redirectPath: string;
  backendAuthPath: string;
  label: string;
}) {

  const handleClick = () => {
    // const returnTo = encodeURIComponent(
    //   `${window.location.origin}/${redirectPath}`
    // );
    // alert(`${backendAuthPath}?returnTo=${returnTo}`)
    // window.location.href = `${backendAuthPath}?returnTo=${returnTo}`;
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
      <span>{label}</span>
    </button>
  );
}
