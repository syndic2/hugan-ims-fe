import React from 'react';

interface ModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    isOpen,
    children
  } = props;

  return isOpen ? (
    <div className="fixed left-0 top-0 z-999 h-screen min-h-screen w-full flex items-center justify-center bg-black/90 px-4 py-5">
      {children}
    </div>
  ) : null;
};

export const ModalMemo = React.memo(Modal);

export default Modal;
