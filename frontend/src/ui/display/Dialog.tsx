"use client";

import {
  useEffect,
  useState,
  ReactNode,
  isValidElement,
  cloneElement,
  ReactElement,
} from "react";
import FloatingBox, { FloatingBoxProps } from "./FloatingBox";

/**
 * Props for the DialogWrapper component
 */
interface DialogWrapperProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger: ReactNode;
  dialog: ReactNode;
  lockBackground?: boolean; // If true, clicking the background won't close the dialog
}

/**
 * DialogWrapper manages the open/close logic, overlay click, and ESC key behavior
 */
export default function DialogWrapper({
  isOpen = false,
  onClose,
  trigger,
  dialog,
  lockBackground = true,
}: DialogWrapperProps) {
  const [open, setOpen] = useState(isOpen);

  // Assign a unique ID for stacking dialog layers
  const dialogId = `dialog-${getDialogsCount() + 1}`;

  // Synchronize internal state with external `isOpen` prop
  useEffect(() => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose?.();
    }
  }, [isOpen]);

  // Close dialog on ESC key if it is the top-most
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const topDialogId = `dialog-${getDialogsCount()}`;
      if (e.key === "Escape" && dialogId === topDialogId) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dialogId]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // Overlay click only closes the topmost dialog
  const handleOverlayClick = () => {
    const topDialogId = `dialog-${getDialogsCount()}`;
    if (!lockBackground && dialogId === topDialogId) {
      handleClose();
    }
  };

  const enhancedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
          // Preserve original trigger onClick
          if (
            typeof (trigger as ReactElement<any>).props?.onClick === "function"
          ) {
            (trigger as ReactElement<any>).props.onClick(e);
          }
          handleOpen();
        },
      } as React.HTMLAttributes<HTMLElement>)
    : trigger;

  const enhancedDialog =
    open && isValidElement(dialog)
      ? cloneElement(dialog, {
          id: dialogId,
          onClose: handleClose,
          onOverlayClick: handleOverlayClick,
        } as React.HTMLAttributes<HTMLElement>)
      : null;

  return (
    <>
      {enhancedTrigger}
      {enhancedDialog}
    </>
  );
}

/**
 * Props for the Dialog component, which wraps FloatingBox
 */
interface DialogProps
  extends Omit<FloatingBoxProps, "overlayBackground" | "isDialog"> {
  onClose?: () => void;
  lockBackground?: boolean;
}

/**
 * Dialog component renders a FloatingBox with optional close button and overlay click behavior
 */
export function Dialog({
  onClose,
  lockBackground = true,
  ...floatingBoxProps
}: DialogProps) {
  const { children, ...floatingBoxAttributes } = floatingBoxProps;

  return (
    <FloatingBox isDialog={true} {...floatingBoxAttributes}>
      <div className="flex justify-end">
        <button onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
      </div>
      {children}
    </FloatingBox>
  );
}

export function Modal(props: Omit<DialogProps, "lockBackground">) {
  return <Dialog backgroundColor="#00000060" {...props} />;
}

/**
 * Returns the number of currently rendered dialogs (based on ID prefix)
 */
function getDialogsCount(): number {
  return document.querySelectorAll("[id^='dialog']").length;
}
