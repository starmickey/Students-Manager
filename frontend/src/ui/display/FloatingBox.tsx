import { ReactNode } from "react";

interface FloatingBoxProps {
  children: ReactNode,
  imgSrc?: string,
  size?: "small",
};

export default function FloatingBox({ children, imgSrc, size }: FloatingBoxProps) {
  return (
    <div>
      <div className="floating-box-overlay" style={{ backgroundImage: `url("${imgSrc}")`}}>
        <div className={`floating-box ${size ? `floating-box-${size}` : ""}`}>
          {children}
        </div>
      </div>
    </div>
  )
}