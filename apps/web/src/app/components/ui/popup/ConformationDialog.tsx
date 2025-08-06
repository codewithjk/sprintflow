import React from "react";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-md bg-white dark:bg-gray-900 shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
