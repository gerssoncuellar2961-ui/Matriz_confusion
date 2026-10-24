/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CaseDossier, MatrixCounts, EvaluationMetrics } from '../types/game';
import { ConfusionMatrix } from './ConfusionMatrix';
import { MetricsPanel } from './MetricsPanel';
import { AvatarPortrait } from './AvatarPortrait';
import {
  Play,
  Pause,
  SkipForward,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Clock,
  LayoutGrid,
  FileText,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface InstructorModeProps {
  dossiers: CaseDossier[];
  currentIndex: number;
  matrixCounts: MatrixCounts;
  metrics: EvaluationMetrics;
  onNextCase: () => void;
  onResetSession: () => void;
  onSelectCaseIndex: (index: number) => void;
}

export const InstructorMode: React.FC<InstructorModeProps> = ({
  dossiers,
  currentIndex,
  matrixCounts,
  metrics,
  onNextCase,
  onResetSession,
  onSelectCaseIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showGroundTruth, setShowGroundTruth] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showMatrix, setShowMatrix] = useState<boolean>(true);
  const [isProjectorView, setIsProjectorView] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'case' | 'analytics'>('case');
  const [sessionType, setSessionType] = useState<'practice' | 'competitive'>('practice');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const currentDossier = dossiers[currentIndex];

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && isPlaying && secondsLeft > 0 && !showGroundTruth) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Auto pause or alert when time is up
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isPlaying, secondsLeft, showGroundTruth]);

  // When changing case, hide answers and reset timer
  const handleNext = () => {
    setShowGroundTruth(false);
    setShowExplanation(false);
    setSecondsLeft(30);
    onNextCase();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    setShowGroundTruth(false);
    setShowExplanation(false);
    setSecondsLeft(30);
    onResetSession();
  };

  return (
    <div
      className={`space-y-6 ${
        isProjectorView ? 'max-w-6xl mx-auto text-base' : 'max-w-5xl mx-auto text-sm'
      }`}
    >
      {/* Instructor Control Console Bar */}
      <div className="bg-[#09162c] border border-[#1b3d6e] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Top Battenburg line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 police-battenburg-sm opacity-80" />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Status & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#06101f] border border-lime-400/60 flex items-center justify-center text-lime-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Panel del Instructor · Modo Proyector
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#06101f] text-lime-400 border border-lime-500/40 font-bold">
                  {sessionType === 'practice' ? 'Modo Práctica' : 'Modo Competitivo'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Control de sesión en aula para proyector o pantalla compartida
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700 hover:bg-amber-900/60'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
            </button>

            <button
              onClick={() => setIsProjectorView(!isProjectorView)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Vista ampliada con tipografía gigante para proyectores"
            >
              {isProjectorView ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Vista Estándar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Modo Proyector</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-rose-300 border border-slate-700 hover:bg-rose-950/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Secondary controls row */}
        <div className="mt-4 pt-3 border-t border-[#183158] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('case')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activeTab === 'case'
                  ? 'bg-lime-400 text-slate-950 font-black'
                  : 'text-slate-300 hover:text-white bg-[#06101f] border border-[#183158]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Presentación del Caso</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-lime-400 text-slate-950 font-black'
                  : 'text-slate-300 hover:text-white bg-[#06101f] border border-[#183158]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matriz & Métricas Globales</span>
            </button>
          </div>

          {/* Visibility toggles */}
          <div className="flex flex-wrap items-center gap-3 text-slate-200">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showMatrix}
                onChange={(e) => setShowMatrix(e.target.checked)}
                className="rounded bg-[#06101f] border-[#183158] text-lime-400 focus:ring-lime-400"
              />
              <span>Mostrar Matriz</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isTimerActive}
                onChange={(e) => setIsTimerActive(e.target.checked)}
                className="rounded bg-[#06101f] border-[#183158] text-lime-400 focus:ring-lime-400"
              />
              <span>Temporizador ({secondsLeft}s)</span>
            </label>

            <button
              onClick={() =>
                setSessionType(sessionType === 'practice' ? 'competitive' : 'practice')
              }
              className="text-[11px] text-lime-400 hover:underline font-bold"
            >
              Cambiar a {sessionType === 'practice' ? 'Competitivo' : 'Práctica'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-600 text-white flex items-center justify-between gap-4">
          <div className="text-xs">
            <strong className="block text-sm">¿Confirmar reinicio de la misión de aula?</strong>
            Se reiniciarán los expedientes y la matriz volverá a cero para una nueva sesión.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 text-xs bg-[#06101f] text-slate-300 rounded hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs font-bold bg-rose-600 text-white rounded hover:bg-rose-500"
            >
              Sí, reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Case Presentation View */}
      {activeTab === 'case' && currentDossier && (
        <div className="space-y-6">
          {/* Main Dossier Presentation for Projector */}
          <div
            className={`bg-[#09162c] border border-[#1a3866] rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden ${
              isProjectorView ? 'p-8 sm:p-10' : 'p-6 sm:p-8'
            }`}
          >
            {/* Top Battenburg line */}
            <div className="absolute top-0 left-0 right-0 h-2 police-battenburg-sm opacity-80" />
            {/* Case header bar with giant index */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm sm:text-base font-bold px-3 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {currentDossier.codeNumber}
                </span>
                <span
                  className={`font-mono text-slate-400 ${
                    isProjectorView ? 'text-lg font-bold' : 'text-xs'
                  }`}
                >
                  Expediente {currentIndex + 1} de {dossiers.length}
                </span>
              </div>

              {/* Timer indicator for students */}
              {isTimerActive && (
                <div
                  className={`flex items-center gap-2 font-mono font-bold px-4 py-1.5 rounded-xl border ${
                    secondsLeft <= 5
                      ? 'bg-rose-950/80 text-rose-400 border-rose-700 animate-pulse'
                      : 'bg-slate-950 text-cyan-300 border-slate-800'
                  }`}
                >
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className={isProjectorView ? 'text-2xl' : 'text-lg'}>
                    00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                  </span>
                </div>
              )}
            </div>

            {/* Split case content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-6 items-start">
              {/* Left Column: Portrait & Suspect */}
              <div className="md:col-span-4 flex flex-col items-center sm:items-start gap-4">
                <AvatarPortrait
                  code={currentDossier.codeNumber}
                  alias={currentDossier.alias}
                  archetype={currentDossier.avatarSeed.archetype}
                  accentColor={currentDossier.avatarSeed.accentColor}
                  className={isProjectorView ? 'w-56 h-72' : 'w-44 h-56'}
                />

                <div>
                  <h3
                    className={`font-bold text-white tracking-tight ${
                      isProjectorView ? 'text-2xl' : 'text-lg'
                    }`}
                  >
                    {currentDossier.alias}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mt-1">
                    {currentDossier.title}
                  </p>
                </div>

                {/* AI Prediction Box - Large for distance viewing */}
                <div className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Dictamen de la IA</span>
                    <span className="font-mono text-cyan-400">
                      {currentDossier.aiConfidence}% Certeza
                    </span>
                  </div>

                  {currentDossier.aiPrediction === 'POSITIVE' ? (
                    <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-200">
                      <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
                        <ShieldAlert className="w-6 h-6 text-rose-400" />
                        <span>Predice: ROBO (+)</span>
                      </div>
                      <span className="text-xs text-rose-300 font-mono block mt-1">
                        Clase Positiva Predictiva
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                      <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
                        <ShieldCheck className="w-6 h-6 text-cyan-400" />
                        <span>Predice: NO ROBO (−)</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono block mt-1">
                        Clase Negativa Predictiva
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Case description & Instructor Controls */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                    Hechos Ficticios del Caso
                  </h4>
                  <p
                    className={`text-slate-200 leading-relaxed ${
                      isProjectorView ? 'text-lg sm:text-xl font-medium' : 'text-sm'
                    }`}
                  >
                    {currentDossier.scenario}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                    <strong className="text-slate-300">Evidencias materiales:</strong>{' '}
                    {currentDossier.evidence}
                  </div>
                </div>

                {/* Question Prompt for the Class */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-center">
                  <span
                    className={`font-bold text-cyan-300 block ${
                      isProjectorView ? 'text-xl' : 'text-base'
                    }`}
                  >
                    ¿Qué cuadrante representa esta predicción según los hechos reales?
                  </span>
                  <div className="flex justify-center gap-4 mt-2 text-xs font-mono text-slate-300">
                    <span>VP (Verdadero Positivo)</span>
                    <span>·</span>
                    <span>FP (Falso Positivo)</span>
                    <span>·</span>
                    <span>FN (Falso Negativo)</span>
                    <span>·</span>
                    <span>VN (Verdadero Negativo)</span>
                  </div>
                </div>

                {/* Instructor Action Buttons: Reveal Ground Truth & Explanation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowGroundTruth(!showGroundTruth)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                        showGroundTruth
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {showGroundTruth ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Ocultar Resultado Real</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Revelar Resultado Real</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      {showExplanation ? 'Ocultar Explicación' : 'Mostrar Explicación'}
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-lg shadow-lime-950/50 transition-all cursor-pointer"
                  >
                    <span>Siguiente Caso ({currentIndex + 1}/{dossiers.length})</span>
                    <SkipForward className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Revealed Answer Card */}
                {showGroundTruth && (
                  <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/60 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span className="font-bold text-white text-base sm:text-lg">
                          Resultado Real: {currentDossier.groundTruth === 'POSITIVE' ? 'SÍ HUBO ROBO' : 'NO HUBO ROBO'}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400 px-3 py-1 rounded bg-emerald-950 border border-emerald-800">
                        Cuadrante: {currentDossier.correctClassification}
                      </span>
                    </div>

                    {showExplanation && (
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mt-2 pt-2 border-t border-slate-800">
                        {currentDossier.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional inline matrix below case if toggled */}
          {showMatrix && (
            <div className="mt-6">
              <ConfusionMatrix
                counts={matrixCounts}
                highlightQuadrant={showGroundTruth ? currentDossier.correctClassification : null}
              />
            </div>
          )}
        </div>
      )}

      {/* Analytics View: Deep Matrix & Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <ConfusionMatrix counts={matrixCounts} />
          <MetricsPanel metrics={metrics} counts={matrixCounts} />
        </div>
      )}
    </div>
  );
};
