// Modal.jsx
import React from 'react';

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnText,
  actionBtnIcon,
  onActionClick,  // this prop is handlePrint from the parent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70">
      <div className="relative flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="md:text-lg font-medium text-gray-900">{title}</h3>

            {showActionBtn && (
              <button
                className="btn-small-light mr-12"
                onClick={onActionClick}  // ← must be exactly this
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
