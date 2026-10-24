/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseDossier, Classification } from '../types/game';
import { AvatarPortrait } from './AvatarPortrait';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Siren,
} from 'lucide-react';

interface DossierCardProps {
  dossier: CaseDossier;
  caseNumber: number;
  totalCases: number;
  playerAnswer: Classification | null;
  onClassify: (selection: Classification) => void;
  onNextCase: () => void;
  isLastCase: boolean;
  onViewResults: () => void;
}

export const DossierCard: React.FC<DossierCardProps> = ({
  dossier,
  caseNumber,
  totalCases,
  playerAnswer,
  onClassify,
  onNextCase,
  isLastCase,
  onViewResults,
}) => {
  const [selectedClassification, setSelectedClassification] = useState<Classification | null>(
    playerAnswer
  );

  // Reset or sync whenever dossier changes to allow selecting each case independently
  React.useEffect(() => {
    setSelectedClassification(playerAnswer);
  }, [dossier.id, playerAnswer]);

  const currentAnswer = playerAnswer ?? selectedClassification;
  const hasAnswered = currentAnswer !== null;
  const isPlayerCorrect = currentAnswer === dossier.correctClassification;

  const handleSelect = (choice: Classification) => {
    if (hasAnswered) return;
    setSelectedClassification(choice);
    onClassify(choice);
  };

  const classificationOptions: {
    key: Classification;
    label: string;
    sublabel: string;
    hint: string;
    icon: React.ReactNode;
    style: string;
    activeStyle: string;
  }[] = [
    {
      key: 'VP',
      label: 'VP · Verdadero Positivo',
      sublabel: 'Predice ROBO y fue ROBO',
      hint: 'Acierto Positivo (Delito Detectado)',
      icon: <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />,
      style: 'border-[#1b3660] bg-[#071326] hover:border-lime-400/80 hover:bg-[#0d2242] text-slate-200',
      activeStyle: 'border-lime-400 bg-lime-950/40 text-lime-300 ring-2 ring-lime-400/60',
    },
    {
      key: 'FP',
      label: 'FP · Falso Positivo',
      sublabel: 'Predice ROBO, pero NO fue robo',
      hint: 'Error Tipo I (Falsa Alarma Policial)',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      style: 'border-[#1b3660] bg-[#071326] hover:border-rose-400/80 hover:bg-rose-950/20 text-slate-200',
      activeStyle: 'border-rose-500 bg-rose-950/40 text-rose-300 ring-2 ring-rose-500/60',
    },
    {
      key: 'FN',
      label: 'FN · Falso Negativo',
      sublabel: 'Predice NO ROBO, pero SÍ fue robo',
      hint: 'Error Tipo II (Delito Omitido)',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      style: 'border-[#1b3660] bg-[#071326] hover:border-amber-400/80 hover:bg-amber-950/20 text-slate-200',
      activeStyle: 'border-amber-500 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/60',
    },
    {
      key: 'VN',
      label: 'VN · Verdadero Negativo',
      sublabel: 'Predice NO ROBO y NO fue robo',
      hint: 'Acierto Negativo (Descarte Correcto)',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />,
      style: 'border-[#1b3660] bg-[#071326] hover:border-sky-400/80 hover:bg-[#0d2242] text-slate-200',
      activeStyle: 'border-sky-400 bg-sky-950/40 text-sky-300 ring-2 ring-sky-400/60',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#09162c] border border-[#1a3866] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Top Police Livery Battenburg Checkered Trim Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-2 police-battenburg-sm opacity-90" />

      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-4 border-b border-[#183158]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-[#06101f] text-lime-400 border border-lime-500/40 tracking-wider">
            {dossier.codeNumber}
          </span>
          <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
            <span>Expediente {caseNumber} de {totalCases}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress bar in police lime */}
          <div className="w-32 bg-[#06101f] h-2 rounded-full overflow-hidden border border-[#183158]">
            <div
              className="bg-lime-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(163,230,53,0.5)]"
              style={{ width: `${(caseNumber / totalCases) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-lime-400 font-bold tabular-nums">
            {Math.round((caseNumber / totalCases) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-start">
        {/* Left column: Portrait and suspect metadata */}
        <div className="md:col-span-4 flex flex-col items-center sm:items-start gap-4">
          <AvatarPortrait
            code={dossier.codeNumber}
            alias={dossier.alias}
            archetype={dossier.avatarSeed.archetype}
            accentColor="#a3e635"
            className="w-full max-w-[210px] h-64 mx-auto sm:mx-0"
          />

          <div className="w-full text-center sm:text-left">
            <h4 className="text-base font-bold text-white tracking-tight">{dossier.alias}</h4>
            <p className="text-xs text-lime-300/80 font-mono mt-0.5">{dossier.title}</p>
          </div>

          {/* AI Prediction Box with Police Patrol Styling */}
          <div className="w-full p-3.5 rounded-xl bg-[#06101f] border border-[#1a3866] shadow-inner">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-lime-400">
                <Siren className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Dictamen Predictivo</span>
              </span>
              <span className="font-mono font-bold text-lime-400">{dossier.aiConfidence}% conf.</span>
            </div>

            {dossier.aiPrediction === 'POSITIVE' ? (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-rose-950/50 border border-rose-600/80 text-rose-200">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-black text-sm block tracking-wide">Predice: ROBO (+)</span>
                  <span className="text-[10px] text-rose-300 font-mono">Clase Positiva Predictiva</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0a1e3d] border border-sky-600/70 text-sky-200">
                <ShieldCheck className="w-5 h-5 text-lime-400 shrink-0" />
                <div>
                  <span className="font-black text-sm block tracking-wide text-white">Predice: NO ROBO (−)</span>
                  <span className="text-[10px] text-sky-300 font-mono">Clase Negativa Predictiva</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Incident Details and Questionnaire */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="bg-[#06101f] border border-[#183158] rounded-xl p-4 shadow-sm">
            <h5 className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400"></span>
              <span>Hechos del Expediente Policial</span>
            </h5>
            <p className="text-sm text-slate-100 leading-relaxed font-normal">{dossier.scenario}</p>

            <div className="mt-3 pt-3 border-t border-[#183158] text-xs text-slate-300">
              <strong className="text-lime-300 font-semibold">Evidencia forense preliminar:</strong>{' '}
              {dossier.evidence}
            </div>
          </div>

          {/* Step 1: Request user classification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ¿Qué cuadrante representa esta predicción policial?
              </span>
              {!hasAnswered && (
                <span className="text-xs text-lime-400 font-mono font-bold animate-pulse">
                  Elige una categoría
                </span>
              )}
            </div>

            {/* 4 Classification Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {classificationOptions.map((opt) => {
                const isSelected = currentAnswer === opt.key;
                const isCorrect = dossier.correctClassification === opt.key;

                let stateBorder = opt.style;
                if (hasAnswered) {
                  if (isCorrect) {
                    stateBorder = 'border-lime-400 bg-lime-950/60 text-lime-200 ring-2 ring-lime-400';
                  } else if (isSelected && !isCorrect) {
                    stateBorder = 'border-rose-500 bg-rose-950/60 text-rose-200 line-through opacity-75';
                  } else {
                    stateBorder = 'border-[#142642] bg-[#050d1a] text-slate-500 opacity-40';
                  }
                } else if (isSelected) {
                  stateBorder = opt.activeStyle;
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelect(opt.key)}
                    disabled={hasAnswered}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${stateBorder}`}
                  >
                    <div className="mt-0.5">{opt.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>{opt.label}</span>
                        {hasAnswered && isCorrect && (
                          <span className="text-[10px] font-mono text-lime-400 bg-lime-950/90 px-1.5 py-0.5 rounded border border-lime-600 font-bold">
                            CORRECTA
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">{opt.sublabel}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{opt.hint}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Post-Answer Reveal and Explanation */}
          {hasAnswered && (
            <div className="mt-2 p-4 rounded-xl bg-[#06101f] border border-[#1b3b6a] animate-in fade-in duration-300 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  {isPlayerCorrect ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-lime-300 bg-lime-950/80 px-2.5 py-1 rounded-lg border border-lime-500 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                      ¡Acierto como Detective! (+10 pts)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-600">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Tu respuesta fue incorrecta (0 pts)
                    </span>
                  )}

                  <span className="text-xs text-slate-300 font-mono">
                    Realidad Forense:{' '}
                    <strong
                      className={
                        dossier.groundTruth === 'POSITIVE'
                          ? 'text-rose-400 font-bold'
                          : 'text-lime-400 font-bold'
                      }
                    >
                      {dossier.groundTruth === 'POSITIVE' ? 'SÍ HUBO ROBO (+)' : 'NO HUBO ROBO (−)'}
                    </strong>
                  </span>
                </div>

                <div className="text-xs font-mono text-lime-400 bg-[#09162c] px-2.5 py-1 rounded-lg border border-[#183158]">
                  Cuadrante IA: <strong>{dossier.correctClassification}</strong>
                </div>
              </div>

              {!isPlayerCorrect && (
                <div className="mb-2 text-xs text-rose-200 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/60 leading-relaxed">
                  ⚠️ Elegiste <strong className="text-white font-mono">{playerAnswer}</strong>, pero el caso es un <strong className="text-lime-300 font-mono">{dossier.correctClassification}</strong>. La matriz de confusión de abajo audita cómo actuó el algoritmo de IA policial en este expediente criminal.
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-2 bg-[#09162c] p-3 rounded-lg border border-[#183158]">
                {dossier.explanation}
              </p>

              {/* Action button: Next dossier or finish in Police Lime Green */}
              <div className="mt-4 flex items-center justify-end">
                {isLastCase ? (
                  <button
                    onClick={onViewResults}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-lime-400 to-lime-300 hover:from-lime-300 hover:to-lime-200 rounded-xl shadow-lg shadow-lime-950/60 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Finalizar Misión y Ver Informe</span>
                  </button>
                ) : (
                  <button
                    onClick={onNextCase}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-lg shadow-lime-950/50 transition-all cursor-pointer"
                  >
                    <span>Siguiente Expediente</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
