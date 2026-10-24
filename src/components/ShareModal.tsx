/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QrCode, Copy, Check, X, Smartphone, Globe, Shield, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  roomCode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://operacion-matriz.web.app';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Generate QR code URL using a public reliable QR SVG/PNG endpoint
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=06101f&color=a3e635&margin=2`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#09162c] border border-lime-400/50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Battenburg line */}
        <div className="h-2 police-battenburg-sm opacity-90" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-[#183158]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#06101f] border border-lime-400/40 flex items-center justify-center text-lime-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                Publicar & Compartir Misión
              </h3>
              <p className="text-[11px] text-lime-400 font-mono">
                Disponible en celulares, tablets y computadores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#06101f] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Live Online Badge */}
          <div className="p-3 rounded-xl bg-[#06101f] border border-[#1b3d6e] flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
              <span>Estado en Internet:</span>
              <strong className="text-lime-400 font-bold">Activo en la Nube</strong>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Cloud Run</span>
          </div>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#06101f] border border-[#183158]">
            <div className="p-3 bg-[#06101f] rounded-xl border border-lime-500/40 shadow-xl relative">
              <img
                src={qrUrl}
                alt="Código QR para abrir en celular"
                className="w-48 h-48 rounded-lg"
                loading="eager"
              />
              <div className="absolute inset-0 border border-lime-400/20 rounded-xl pointer-events-none" />
            </div>

            <p className="text-xs text-slate-300 mt-3 text-center flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Escanea este código con la cámara de tu celular</span>
            </p>

            {roomCode && (
              <div className="mt-2 text-center">
                <span className="text-[11px] text-slate-400">Código de Sala de Patrulla:</span>{' '}
                <strong className="font-mono text-lime-400 font-black tracking-widest text-base">
                  {roomCode}
                </strong>
              </div>
            )}
          </div>

          {/* Share Link input + copy button */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1.5">
              Enlace Web Directo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-[#06101f] border border-[#1b3d6e] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-colors cursor-pointer shrink-0 shadow-md shadow-lime-950/40"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Mobile tip: Add to home screen */}
          <div className="p-3.5 rounded-xl bg-[#06101f] border border-[#183158] text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-lime-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Consejo para usar como App en el Celular:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              En Safari (iPhone) presiona <strong>Compartir &rarr; &ldquo;Agregar a pantalla de inicio&rdquo;</strong>. En Chrome (Android) presiona el menú de 3 puntos &rarr; <strong>&ldquo;Instalar aplicación&rdquo;</strong> para jugar en pantalla completa sin barra de navegación.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#06101f] border-t border-[#183158] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0d2242] hover:bg-[#143059] text-white transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
