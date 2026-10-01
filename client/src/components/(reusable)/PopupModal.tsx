import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PopupModalProps {
  open: boolean;
  children: React.ReactNode;
}

export default function PopupModal({ open, children }: PopupModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open) {
      element.showModal();
    } else {
      element.close();
    }
  }, [open]);

  const modalRoot = document.getElementById("popup-modal");
  if (!modalRoot) return null;

  return createPortal(
    <dialog
      className="m-auto p-0 bg-transparent open:flex backdrop:bg-[#000000b1]"
      ref={dialog}
    >
      {open ? children : null}
    </dialog>,
    modalRoot,
  );
}
