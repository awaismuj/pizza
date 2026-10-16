import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const content = (
    <div className="pos-modal-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="pos-modal-card max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0 sticky top-0 z-10">
          <h2 className="text-base sm:text-lg text-slate-900 dark:text-white font-extrabold tracking-tight">{title}</h2>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xl leading-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
};

export default Modal;


