/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MatrixCounts } from '../types/game';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Info } from 'lucide-react';

interface ConfusionMatrixProps {
  counts: MatrixCounts;
  highlightQuadrant?: 'VP' | 'FN' | 'FP' | 'VN' | null;
  compact?: boolean;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  counts,
  highlightQuadrant = null,
  compact = false,
}) => {
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const quadrantDetails = {
    VP: {
      code: 'VP',
      title: 'Verdadero Positivo (VP)',
      subtitle: 'Acierto Positivo · Detección Real',
      description: 'La IA predijo ROBO y el caso fue un ROBO real en los hechos.',
      meaning: 'Detecta a un criminal genuino. Protege los bienes y valida la eficacia del sistema.',
      colorClass: 'border-lime-500/60 bg-lime-950/25 text-lime-300',
      badgeClass: 'text-lime-400 bg-lime-950/80 border-lime-600',
      icon: <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />,
    },
    FN: {
      code: 'FN',
      title: 'Falso Negativo (FN)',
      subtitle: 'Error Tipo II · Delito No Detectado',
      description: 'La IA predijo NO ROBO, pero el caso sí fue un ROBO en la realidad.',
      meaning: 'El delito pasa desapercibido. Genera impunidad, daño material y fallo de prevención.',
      colorClass: 'border-amber-500/60 bg-amber-950/25 text-amber-300',
      badgeClass: 'text-amber-400 bg-amber-950/80 border-amber-600',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    FP: {
      code: 'FP',
      title: 'Falso Positivo (FP)',
      subtitle: 'Error Tipo I · Falsa Alarma Policial',
      description: 'La IA predijo ROBO, pero en la realidad NO hubo robo (persona inocente).',
      meaning: 'Se investiga o acusa injustamente a un inocente. Afecta derechos civiles y satura patrullas.',
      colorClass: 'border-rose-500/60 bg-rose-950/25 text-rose-300',
      badgeClass: 'text-rose-400 bg-rose-950/80 border-rose-600',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    VN: {
      code: 'VN',
      title: 'Verdadero Negativo (VN)',
      subtitle: 'Acierto Negativo · Descarte Correcto',
      description: 'La IA predijo NO ROBO y se confirmó que NO hubo robo.',
      meaning: 'Descarta correctamente un caso sin delito. Preserva la presunción de inocencia.',
      colorClass: 'border-sky-500/60 bg-sky-950/25 text-sky-300',
      badgeClass: 'text-sky-400 bg-sky-950/80 border-sky-600',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />,
    },
  };

  return (
    <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Matriz de Confusión: Auditoría del Modelo de IA Policial</span>
            <span className="text-xs font-mono font-bold text-lime-400 px-2.5 py-0.5 rounded bg-[#06101f] border border-lime-500/30">
              AUDITORÍA DE LA IA
            </span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Mide si el <strong className="text-lime-300">algoritmo policial</strong> acertó o falló según la realidad forense (independiente de tu puntaje como jugador)
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <span>Casos auditados de la IA:</span>
          <span className="font-bold text-lime-400 tabular-nums px-2.5 py-0.5 rounded bg-[#06101f] border border-[#183158]">
            {counts.total} / 20
          </span>
        </div>
      </div>

      {/* Grid container with pixel-perfect horizontal & vertical alignment */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[500px] flex flex-col gap-3">
          {/* Top Row: Column Headers aligned over quadrant cells */}
          <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] gap-3 items-stretch">
            {/* Top-Left Empty Anchor */}
            <div className="flex items-center justify-center p-2 text-[11px] font-mono font-bold text-slate-500">
              REALIDAD \ PREDICCIÓN
            </div>

            {/* Column 1 Header: Aligned over VP & FP */}
            <div className="bg-[#06101f] border border-[#183158] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-lime-400 text-center flex items-center justify-center shadow-inner">
              Predicción: ROBO (+)
            </div>

            {/* Column 2 Header: Aligned over FN & VN */}
            <div className="bg-[#06101f] border border-[#183158] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-sky-300 text-center flex items-center justify-center shadow-inner">
              Predicción: NO ROBO (−)
            </div>
          </div>

          {/* Row 1: Real Positivo */}
          <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] gap-3 items-stretch">
            {/* Row 1 Header: Aligned with VP & FN */}
            <div className="bg-[#06101f] border border-[#183158] rounded-xl p-3.5 flex flex-col justify-center text-xs font-bold text-lime-400 shadow-inner">
              <span className="text-sm">Real: ROBO (+)</span>
              <span className="text-[10px] text-slate-400 font-normal mt-0.5">Clase Positiva</span>
            </div>

            {/* Cell VP [Row 1, Col 1] */}
            <button
              onClick={() => setSelectedInfo(selectedInfo === 'VP' ? null : 'VP')}
              className={`rounded-xl p-4 border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[140px] sm:min-h-[155px] ${
                quadrantDetails.VP.colorClass
              } ${
                highlightQuadrant === 'VP'
                  ? 'ring-2 ring-lime-400 scale-[1.01] shadow-lg shadow-lime-500/30'
                  : 'hover:border-lime-400 hover:bg-lime-950/30'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-black text-lime-400">VP</span>
                {quadrantDetails.VP.icon}
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-white">
                  {counts.vp}
                </div>
                <div className="text-xs text-lime-300 font-semibold mt-0.5">
                  Verdadero Positivo
                </div>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1.5 border-t border-lime-900/50 w-full">
                <span>Acierto Positivo</span>
                <Info className="w-3.5 h-3.5 text-lime-400" />
              </div>
            </button>

            {/* Cell FN [Row 1, Col 2] */}
            <button
              onClick={() => setSelectedInfo(selectedInfo === 'FN' ? null : 'FN')}
              className={`rounded-xl p-4 border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[140px] sm:min-h-[155px] ${
                quadrantDetails.FN.colorClass
              } ${
                highlightQuadrant === 'FN'
                  ? 'ring-2 ring-amber-400 scale-[1.01] shadow-lg shadow-amber-500/30'
                  : 'hover:border-amber-400 hover:bg-amber-950/30'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-black text-amber-400">FN</span>
                {quadrantDetails.FN.icon}
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-white">
                  {counts.fn}
                </div>
                <div className="text-xs text-amber-300 font-semibold mt-0.5">
                  Falso Negativo
                </div>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1.5 border-t border-amber-900/50 w-full">
                <span>Error Tipo II</span>
                <Info className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </button>
          </div>

          {/* Row 2: Real Negativo */}
          <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] gap-3 items-stretch">
            {/* Row 2 Header: Aligned with FP & VN */}
            <div className="bg-[#06101f] border border-[#183158] rounded-xl p-3.5 flex flex-col justify-center text-xs font-bold text-sky-300 shadow-inner">
              <span className="text-sm">Real: NO ROBO (−)</span>
              <span className="text-[10px] text-slate-400 font-normal mt-0.5">Clase Negativa</span>
            </div>

            {/* Cell FP [Row 2, Col 1] */}
            <button
              onClick={() => setSelectedInfo(selectedInfo === 'FP' ? null : 'FP')}
              className={`rounded-xl p-4 border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[140px] sm:min-h-[155px] ${
                quadrantDetails.FP.colorClass
              } ${
                highlightQuadrant === 'FP'
                  ? 'ring-2 ring-rose-500 scale-[1.01] shadow-lg shadow-rose-500/30'
                  : 'hover:border-rose-400 hover:bg-rose-950/30'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-black text-rose-400">FP</span>
                {quadrantDetails.FP.icon}
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-white">
                  {counts.fp}
                </div>
                <div className="text-xs text-rose-300 font-semibold mt-0.5">
                  Falso Positivo
                </div>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1.5 border-t border-rose-900/50 w-full">
                <span>Error Tipo I</span>
                <Info className="w-3.5 h-3.5 text-rose-400" />
              </div>
            </button>

            {/* Cell VN [Row 2, Col 2] */}
            <button
              onClick={() => setSelectedInfo(selectedInfo === 'VN' ? null : 'VN')}
              className={`rounded-xl p-4 border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[140px] sm:min-h-[155px] ${
                quadrantDetails.VN.colorClass
              } ${
                highlightQuadrant === 'VN'
                  ? 'ring-2 ring-sky-400 scale-[1.01] shadow-lg shadow-sky-500/30'
                  : 'hover:border-sky-400 hover:bg-sky-950/30'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-black text-sky-400">VN</span>
                {quadrantDetails.VN.icon}
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-white">
                  {counts.vn}
                </div>
                <div className="text-xs text-sky-300 font-semibold mt-0.5">
                  Verdadero Negativo
                </div>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1.5 border-t border-sky-900/50 w-full">
                <span>Acierto Negativo</span>
                <Info className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Quadrant Explanatory Card if clicked */}
      {selectedInfo && (
        <div className="mt-4 p-4 rounded-xl bg-[#06101f] border border-[#1b3b6a] text-xs transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-white text-sm">
              {quadrantDetails[selectedInfo as keyof typeof quadrantDetails].title}
            </span>
            <button
              onClick={() => setSelectedInfo(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-[11px] bg-[#0d2242] cursor-pointer"
            >
              Cerrar
            </button>
          </div>
          <p className="text-slate-200 mb-1 leading-relaxed">
            {quadrantDetails[selectedInfo as keyof typeof quadrantDetails].description}
          </p>
          <p className="text-slate-400 italic">
            {quadrantDetails[selectedInfo as keyof typeof quadrantDetails].meaning}
          </p>
        </div>
      )}

      {/* Under-matrix summary counts */}
      {!compact && (
        <div className="mt-5 pt-3.5 border-t border-[#183158] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
                <span>
                  Aciertos del Modelo de IA (VP + VN):{' '}
                  <strong className="text-lime-400 font-mono tabular-nums">{counts.correct}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>
                  Fallos del Modelo de IA (FP + FN):{' '}
                  <strong className="text-rose-400 font-mono tabular-nums">{counts.incorrect}</strong>
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 font-mono bg-[#06101f] px-3 py-1 rounded-lg border border-[#183158]">
              Exactitud de la IA:{' '}
              <strong className="text-lime-400">
                {counts.total > 0 ? `${((counts.correct / counts.total) * 100).toFixed(1)}%` : 'N/A'}
              </strong>
            </div>
          </div>

          {/* Explicit pedagogical differentiation */}
          <div className="bg-[#06101f] border border-[#183158] rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs leading-relaxed">
              <strong className="text-sky-300">Principio de Evaluación en Analítica:</strong> Esta matriz registra si la <strong className="text-white">inteligencia artificial</strong> acertó o erró al contrastarla con la verdad forense. Tus respuestas y aciertos personales como <strong className="text-lime-300">detective / perito</strong> se contabilizan en tu marcador superior.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
