import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from '../Icons';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // match animation duration
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div ref={modalRef} className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button onClick={handleClose} className="btn icon-btn btn-ghost" aria-label="Fechar modal"><XIcon /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;