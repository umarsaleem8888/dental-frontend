
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
    // style={{border:'solid 1px red'}} 
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-[100%]">
      <div 
        // style={{border: 'solid 2px green'}}
        className=" absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative h-[100%] max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-black/20 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        <div  className="p-6 overflow-auto h-[90%]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
