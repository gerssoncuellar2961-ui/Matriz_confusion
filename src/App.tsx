/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ViewMode,
  CaseDossier,
  Classification,
  PlayerScore,
} from './types/game';
import { DEFAULT_DOSSIERS } from './data/dossiers';
import { calculateMatrix, calculateMetrics } from './utils/metrics';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { DossierCard } from './components/DossierCard';
import { ConfusionMatrix } from './components/ConfusionMatrix';
import { MetricsPanel } from './components/MetricsPanel';
import { AcademyModal } from './components/AcademyModal';
import { InstructorMode } from './components/InstructorMode';
import { SquadMode } from './components/SquadMode';
import { ResultsReport } from './components/ResultsReport';
import { RotateCcw, Award, CheckCircle2, XCircle, Target, Trophy, Info } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('menu');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [evaluatedIds, setEvaluatedIds] = useState<string[]>([]);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, Classification>>({});
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const [playerScore, setPlayerScore] = useState<PlayerScore>({
    points: 0,
    correctCount: 0,
    incorrectCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    streakBonusCount: 0,
    badges: [],
  });

  // Evaluated dossiers list (prevents double-counting)
  const evaluatedDossiers = useMemo(() => {
    return DEFAULT_DOSSIERS.filter((d) => evaluatedIds.includes(d.id));
  }, [evaluatedIds]);

  // Model Confusion Matrix & Metrics strictly reflect evaluated dossiers
  const matrixCounts = useMemo(() => {
    return calculateMatrix(evaluatedDossiers);
  }, [evaluatedDossiers]);

  const metrics = useMemo(() => {
    return calculateMetrics(matrixCounts);
  }, [matrixCounts]);

  const currentDossier = DEFAULT_DOSSIERS[currentCaseIndex];

  // Handle Player classification in Solo Mode
  const handleClassifyCase = (choice: Classification) => {
    if (!currentDossier) return;

    // Check if already answered to prevent double counting
    if (evaluatedIds.includes(currentDossier.id)) {
      return;
    }

    const isCorrect = choice === currentDossier.correctClassification;

    // 1. Update player answers map
    setPlayerAnswers((prev) => ({
      ...prev,
      [currentDossier.id]: choice,
    }));

    // 2. Update evaluated dossiers list (updates matrix & model metrics automatically)
    setEvaluatedIds((prev) => [...prev, currentDossier.id]);

    // 3. Update player score & streak
    setPlayerScore((prev) => {
      if (isCorrect) {
        const newStreak = prev.currentStreak + 1;
        const newMaxStreak = Math.max(prev.maxStreak, newStreak);
        let bonus = 0;
        let streakBonusCount = prev.streakBonusCount;

        // 5 points bonus for every streak of 5
        if (newStreak > 0 && newStreak % 5 === 0) {
          bonus = 5;
          streakBonusCount += 1;
        }

        const earned = 10 + bonus;
        return {
          ...prev,
          points: prev.points + earned,
          correctCount: prev.correctCount + 1,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
          streakBonusCount,
        };
      } else {
        return {
          ...prev,
          incorrectCount: prev.incorrectCount + 1,
          currentStreak: 0,
        };
      }
    });
  };

  // Next case in Solo Mode
  const handleNextCase = () => {
    if (currentCaseIndex < DEFAULT_DOSSIERS.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
    } else {
      setCurrentView('results');
    }
  };

  // Reset entire mission
  const handleResetGame = () => {
    setShowResetConfirm(false);
    setCurrentCaseIndex(0);
    setEvaluatedIds([]);
    setPlayerAnswers({});
    setPlayerScore({
      points: 0,
      correctCount: 0,
      incorrectCount: 0,
      currentStreak: 0,
      maxStreak: 0,
      streakBonusCount: 0,
      badges: [],
    });
  };

  return (
    <div
      className={`min-h-screen bg-[#060e1c] text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950 ${
        reducedMotion ? 'motion-reduce' : ''
      }`}
    >
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onResetGame={() => setShowResetConfirm(true)}
        score={playerScore.points}
        streak={playerScore.currentStreak}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09162c] border border-[#1b3b6a] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              ¿Reiniciar la Misión de Expedientes?
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Esta acción pondrá a cero los {evaluatedIds.length} expedientes evaluados, restablecerá la matriz de confusión y reiniciará tu puntaje de perito.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg bg-[#06101f] border border-[#183158]"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetGame}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg"
              >
                Sí, reiniciar misión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW: Main Menu */}
        {currentView === 'menu' && (
          <MainMenu
            onNavigate={setCurrentView}
            playerScore={playerScore}
            totalEvaluated={evaluatedIds.length}
          />
        )}

        {/* VIEW: Solo Mission Mode */}
        {currentView === 'solo' && (
          <div className="space-y-8">
            <DossierCard
              key={currentDossier.id}
              dossier={currentDossier}
              caseNumber={currentCaseIndex + 1}
              totalCases={DEFAULT_DOSSIERS.length}
              playerAnswer={playerAnswers[currentDossier.id] || null}
              onClassify={handleClassifyCase}
              onNextCase={handleNextCase}
              isLastCase={currentCaseIndex === DEFAULT_DOSSIERS.length - 1}
              onViewResults={() => setCurrentView('results')}
            />

            {/* Live Interactive Confusion Matrix and Metrics Panel underneath */}
            <div className="space-y-6">
              {/* Detective Performance Banner: Shows the player's personal answers vs the AI model */}
              <div className="bg-[#09162c] border border-lime-400/40 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 police-battenburg-sm opacity-90" />
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#06101f] border border-lime-400/50 flex items-center justify-center text-lime-400 shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Tu Desempeño como Detective</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-300 border border-lime-400/40 font-bold">
                          TUS RESPUESTAS
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Tus decisiones al clasificar el cuadrante de cada expediente (VP, FN, FP o VN).
                      </p>
                    </div>
                  </div>

                  {/* Player Live Counters */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="flex items-center gap-2 bg-[#06101f] px-3 py-2 rounded-xl border border-lime-500/30">
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tus Aciertos:</span>
                        <span className="font-mono font-bold text-lime-400 text-sm tabular-nums">
                          {playerScore.correctCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#06101f] px-3 py-2 rounded-xl border border-rose-500/30">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tus Errores:</span>
                        <span className="font-mono font-bold text-rose-400 text-sm tabular-nums">
                          {playerScore.incorrectCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#06101f] px-3 py-2 rounded-xl border border-sky-500/30">
                      <Target className="w-4 h-4 text-sky-400" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tu Efectividad:</span>
                        <span className="font-mono font-bold text-sky-300 text-sm tabular-nums">
                          {playerScore.correctCount + playerScore.incorrectCount > 0
                            ? `${Math.round((playerScore.correctCount / (playerScore.correctCount + playerScore.incorrectCount)) * 100)}%`
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#06101f] px-3 py-2 rounded-xl border border-amber-500/30">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Puntaje:</span>
                        <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                          {playerScore.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ConfusionMatrix
                counts={matrixCounts}
                highlightQuadrant={
                  playerAnswers[currentDossier.id]
                    ? currentDossier.correctClassification
                    : null
                }
              />
              <MetricsPanel metrics={metrics} counts={matrixCounts} />
            </div>
          </div>
        )}

        {/* VIEW: Instructor Mode */}
        {currentView === 'instructor' && (
          <InstructorMode
            dossiers={DEFAULT_DOSSIERS}
            currentIndex={currentCaseIndex}
            matrixCounts={matrixCounts}
            metrics={metrics}
            onNextCase={handleNextCase}
            onResetSession={handleResetGame}
            onSelectCaseIndex={setCurrentCaseIndex}
          />
        )}

        {/* VIEW: Squad Mode (Multiplayer) */}
        {currentView === 'squad' && (
          <SquadMode
            dossiers={DEFAULT_DOSSIERS}
            onExit={() => setCurrentView('menu')}
          />
        )}

        {/* VIEW: Academy Mode */}
        {currentView === 'academy' && (
          <AcademyModal
            onClose={() => setCurrentView('menu')}
            onStartMission={() => setCurrentView('solo')}
          />
        )}

        {/* VIEW: Results Report Mode */}
        {currentView === 'results' && (
          <ResultsReport
            dossiers={DEFAULT_DOSSIERS}
            evaluatedDossiers={evaluatedDossiers}
            playerAnswers={playerAnswers}
            matrixCounts={matrixCounts}
            metrics={metrics}
            playerScore={playerScore}
            onRestart={handleResetGame}
            onGoToMenu={() => setCurrentView('menu')}
            onGoToAcademy={() => setCurrentView('academy')}
          />
        )}
      </main>

      {/* Footer (Quiet, editorial, compliant with frontend-design skill) */}
      <footer className="border-t border-[#183158] bg-[#06101f] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">OPERACIÓN MATRIZ</span>
            <span className="text-lime-400">·</span>
            <span className="text-lime-400 font-mono text-[11px]">Unidad de Inteligencia Predictiva</span>
            <span className="text-slate-600">·</span>
            <span>Maestría en Analítica de Datos</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Simulación pedagógica de evaluación de modelos de clasificación binaria
          </div>
        </div>
      </footer>
    </div>
  );
}
