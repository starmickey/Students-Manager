import Image, { ImageProps } from "next/image";

type LoadingSpinnerProps = Omit<ImageProps, "src" | "alt">;

export default function LoadingSpinner({
  className = "",
  ...props
}: LoadingSpinnerProps) {
  return (
    <Image
      priority
      {...props}
      src="/icons/spinner.svg"
      alt="Cargando"
      className={`animate-spin loading-spinner ${className}`}
    />
  );
}
