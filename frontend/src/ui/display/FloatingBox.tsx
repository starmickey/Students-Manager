"use client";

import { ReactNode } from "react";

export interface FloatingBoxProps {
  id?: string;
  children: ReactNode;
  imgSrc?: string;
  size?: "small";
  backgroundColor?: string;
  onOverlayClick?: () => void;
  isDialog?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export default function FloatingBox({
  id,
  children,
  imgSrc,
  size,
  backgroundColor,
  onOverlayClick = () => {},
  isDialog = false,
  ariaLabelledBy,
  ariaDescribedBy,
}: FloatingBoxProps) {
  const overlayStyle: React.CSSProperties = {
    ...(imgSrc
      ? { backgroundImage: `url("${imgSrc}")` }
      : backgroundColor && { backgroundColor }),
  };

  const handleOverlayClick = () => {
    onOverlayClick?.();
  };

  return (
    <div {...(id && { id })}>
      <div
        className="floating-box-overlay"
        onClick={handleOverlayClick}
        style={overlayStyle}
        role="presentation"
      >
        <div
          className={`floating-box ${size ? `floating-box-${size}` : ""}`}
          onClick={(e) => e.stopPropagation()}
          role={!isDialog ? "dialog" : undefined}
          aria-modal={!isDialog ? "true" : undefined}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <div className="floating-box-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
