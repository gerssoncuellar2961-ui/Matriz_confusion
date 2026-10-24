/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode } from '../types/game';
import { Shield, BookOpen, Users, Presentation, Award, RotateCcw, QrCode } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onResetGame: () => void;
  score: number;
  streak: number;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onResetGame,
  score,
  streak,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#06101f]/95 backdrop-blur-md border-b border-[#183158] transition-colors">
      {/* Subtle top police checkered Battenburg line */}
      <div className="h-1 police-battenburg-sm opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element brand wordmark with Police Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-md"
            title="Ir al menú principal"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0d2346] border border-lime-400/60 flex items-center justify-center text-lime-400 group-hover:border-lime-300 transition-colors shadow-[0_0_10px_rgba(163,230,53,0.2)]">
              <Shield className="w-5 h-5 fill-lime-400/20" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white group-hover:text-lime-300 transition-colors whitespace-nowrap block">
                OPERACIÓN MATRIZ
              </span>
              <span className="text-[10px] text-lime-400/90 tracking-wider uppercase font-bold block font-mono">
                Unidad de Inteligencia Predictiva
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('solo')}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentView === 'solo'
                ? 'border-lime-400 text-lime-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Misión
          </button>

          <button
            onClick={() => onNavigate('academy')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentView === 'academy'
                ? 'border-lime-400 text-lime-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Academia</span>
          </button>

          <button
            onClick={() => onNavigate('instructor')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentView === 'instructor'
                ? 'border-lime-400 text-lime-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-slate-400" />
            <span>Instructor</span>
          </button>

          <button
            onClick={() => onNavigate('squad')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentView === 'squad'
                ? 'border-lime-400 text-lime-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Escuadrón</span>
          </button>

          <button
            onClick={() => onNavigate('results')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentView === 'results'
                ? 'border-lime-400 text-lime-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-slate-400" />
            <span>Resultados</span>
          </button>
        </nav>

        {/* Zone 3: Score & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Player Score display in police style */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-200 bg-[#0a1830] px-3.5 py-1.5 rounded-lg border border-[#1a3866]">
            <div>
              <span className="text-slate-400">Puntaje:</span>{' '}
              <span className="font-mono font-bold text-lime-400 tabular-nums">{score} pts</span>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-400">Racha:</span>{' '}
              <span className="font-mono font-bold text-amber-300 tabular-nums">{streak}x</span>
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-md shadow-lime-950/40"
            title="Abrir en celular con código QR o compartir enlace"
          >
            <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Compartir / Móvil</span>
          </button>

          <button
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Activar animaciones' : 'Reducir animaciones'}
            className="p-2 text-xs text-slate-400 hover:text-slate-200 bg-[#0a1830] hover:bg-[#0f2447] rounded-lg border border-[#183158] transition-colors"
          >
            {reducedMotion ? 'Movimiento: Reducido' : 'Movimiento: Activo'}
          </button>

          <button
            onClick={onResetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0a1830] hover:bg-[#0f2447] border border-[#1a3866] rounded-lg hover:border-lime-400/60 transition-colors whitespace-nowrap cursor-pointer"
            title="Reiniciar partida actual"
          >
            <RotateCcw className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Share / QR Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </header>
  );
};
