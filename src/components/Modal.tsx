import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="modal-container" 
        className={`w-full ${maxWidth} bg-neutral-900 border border-amber-500/30 shadow-2xl hud-chamfer relative overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Top subtle HUD accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-cyan-400 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/60">
          <div>
            <h3 className="font-cyber text-lg font-bold tracking-wider text-neutral-100 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-amber-400 rotate-45" />
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-neutral-400 font-mono-cyber mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
