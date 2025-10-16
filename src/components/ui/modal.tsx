import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  children: React.ReactNode;
  hideButton?: boolean;
  modalClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  showBackButton,
  onBackClick,
  children,
  hideButton,
  modalClassName,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={clsx(
            "w-full max-w-md rounded-xl bg-white p-6",
            modalClassName
          )}
        >
          {title && (
            <DialogTitle as="h3" className="text-lg font-medium text-gray-900">
              {title}
            </DialogTitle>
          )}
          <div className="mt-2 h-[80vh] overflow-y-scroll">{children}</div>
          <div className="mt-4 flex justify-end">
            {showBackButton && (
              <Button
                className="mr-2 inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-hidden hover:bg-gray-600"
                onClick={onBackClick}
              >
                Back
              </Button>
            )}
            {secondaryActionText && onSecondaryAction && (
              <Button
                className="mr-2 inline-flex items-center gap-2 rounded-md bg-gray-300 py-1.5 px-3 text-sm font-semibold text-gray-900 shadow-inner focus:outline-hidden hover:bg-gray-200"
                onClick={onSecondaryAction}
              >
                {secondaryActionText}
              </Button>
            )}
            {!hideButton && (
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-hidden hover:bg-indigo-500"
                onClick={onPrimaryAction}
              >
                {primaryActionText}
              </Button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
