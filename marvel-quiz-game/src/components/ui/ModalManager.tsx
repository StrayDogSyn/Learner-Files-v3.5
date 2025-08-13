import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import { X } from 'lucide-react';

export function ModalManager() {
  const { ui, closeModal } = useGameStore();
  const { activeModal } = ui;

  if (!activeModal) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="
            bg-gradient-to-br from-slate-900/95 to-slate-800/95
            backdrop-blur-xl border border-slate-700/50
            rounded-2xl shadow-2xl overflow-hidden
          ">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white">
                {activeModal.title}
              </h2>
              <button
                onClick={closeModal}
                className="
                  p-2 rounded-lg text-slate-400 hover:text-white
                  hover:bg-slate-700/50 transition-colors
                "
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-slate-300 mb-6">
                {activeModal.content}
              </p>
              
              {/* Actions */}
              <div className="flex space-x-3 justify-end">
                {activeModal.actions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.handler();
                      if (action.closeOnClick !== false) {
                        closeModal();
                      }
                    }}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all
                      ${
                        action.variant === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : action.variant === 'danger'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ModalManager;