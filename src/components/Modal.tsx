"use client";

import { Modal, ModalHeader, ModalBody } from "flowbite-react";
import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const CustomModal = ({ isOpen, onClose, title, children }: CustomModalProps) => {
  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <ModalHeader>
        <div className="px-4 py-2">
          <span className="text-xl font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">{children}</div>
      </ModalBody>
    </Modal>
  );
};