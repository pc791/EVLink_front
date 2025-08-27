import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = string; // Type 문자열로 관리

interface ModalContextType {
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  modalType: ModalType | null;
  modalData: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within GlobalModalProvider");
  return context;
};

interface GlobalModalProviderProps {
  children: ReactNode;
  modals: Record<ModalType, React.ComponentType<any>>; // Map 구조
}

export const GlobalModalProvider = ({ children, modals }: GlobalModalProviderProps) => {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  const ModalComponent = modalType ? modals[modalType] : null;

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType, modalData }}>
      {children}
      {ModalComponent && <ModalComponent open={true} onClose={closeModal} {...modalData} />}
    </ModalContext.Provider>
  );
};
