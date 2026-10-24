/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewMode, PlayerScore } from '../types/game';
import {
  Play,
  Presentation,
  Users,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  Target,
  ArrowRight,
  Shield,
  Siren,
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (view: ViewMode) => void;
  playerScore: PlayerScore;
  totalEvaluated: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  playerScore,
  totalEvaluated,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Tactical Command Center Card with Police Patrol Livery */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#06101f] via-[#091a36] to-[#0d264f] border border-[#1b3d6e] rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Top Police Battenburg Checkered Trim */}
        <div className="absolute top-0 left-0 right-0 h-3 police-battenburg opacity-95" />

        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#a3e635_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl pt-2">
          {/* Eyebrow kicker with police badge */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-400 mb-3 tracking-wider uppercase">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#06101f] border border-lime-400/40">
              <Siren className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Patrulla de Inteligencia & Clasificación Supervisada</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            OPERACIÓN MATRIZ
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-lime-400 mt-1 flex items-center gap-2">
            <span>Unidad de Inteligencia Predictiva</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#081730] text-slate-300 border border-[#1b3b6a]">
              DIVISIÓN ANALÍTICA
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mt-4 max-w-2xl font-normal">
            Asume el mando como oficial analista de datos. Evalúa 20 expedientes criminales ficticios donde un algoritmo predictivo dictamina si ocurrió un robo. Clasifica cada caso en <strong className="text-lime-300">VP, FP, FN o VN</strong> y observa en vivo cómo se calcula la <strong className="text-white">Matriz de Confusión</strong> y las métricas del modelo.
          </p>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#183158]">
            <div className="p-3 rounded-xl bg-[#06101f]/80 border border-[#1a3866]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Expedientes</span>
              <span className="text-xl font-black font-mono text-lime-400 tabular-nums">
                {totalEvaluated} / 20
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#06101f]/80 border border-[#1a3866]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Tu Puntaje</span>
              <span className="text-xl font-black font-mono text-white tabular-nums">
                {playerScore.points} pts
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#06101f]/80 border border-[#1a3866]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Mejor Racha</span>
              <span className="text-xl font-black font-mono text-amber-300 tabular-nums flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" />
                {playerScore.maxStreak}x
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#06101f]/80 border border-[#1a3866]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Aciertos Quiz</span>
              <span className="text-xl font-black font-mono text-lime-400 tabular-nums">
                {playerScore.correctCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Buttons Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Modalidades Operativas</span>
            <span className="w-2 h-2 rounded-full bg-lime-400"></span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">5 módulos activos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Start Mission (Individual) */}
          <button
            onClick={() => onNavigate('solo')}
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#091830] to-[#06101f] border border-[#1a3866] hover:border-lime-400 text-left transition-all duration-200 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
                <span>Iniciar Misión</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Examina los 20 expedientes a tu propio ritmo, toma decisiones de clasificación y acumula puntos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#183158] text-[11px] font-mono text-lime-400 font-bold">
              Modo individual guiado
            </div>
          </button>

          {/* Card 2: Modo Instructor */}
          <button
            onClick={() => onNavigate('instructor')}
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#091830] to-[#06101f] border border-[#1a3866] hover:border-lime-400 text-left transition-all duration-200 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0f2a52] text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-sky-500/30">
                <Presentation className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
                <span>Modo Instructor</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Control para docencia universitaria: vista ampliada para proyector, temporizador, revelación diferida de respuestas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#183158] text-[11px] font-mono text-sky-400 font-bold">
              Ideal para proyectar en clase
            </div>
          </button>

          {/* Card 3: Modo Escuadrón (Multijugador) */}
          <button
            onClick={() => onNavigate('squad')}
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#091830] to-[#06101f] border border-[#1a3866] hover:border-lime-400 text-left transition-all duration-200 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-lime-500/30">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
                <span>Entrar a una Sala</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Modo Escuadrón: Conéctate con un código de sala desde tu navegador o celular y compite en el ranking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#183158] text-[11px] font-mono text-lime-400 font-bold">
              Multijugador sincronizado
            </div>
          </button>

          {/* Card 4: Academia */}
          <button
            onClick={() => onNavigate('academy')}
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#091830] to-[#06101f] border border-[#1a3866] hover:border-lime-400 text-left transition-all duration-200 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0f2a52] text-lime-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-[#183158]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
                <span>Academia: Aprende la Matriz</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Aprende qué es VP, FP, FN y VN con ejemplos visuales, mini-prácticas y comprensión de los tipos de error.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#183158] text-[11px] font-mono text-slate-300 font-bold">
              Tutorial interactivo
            </div>
          </button>

          {/* Card 5: Resultados */}
          <button
            onClick={() => onNavigate('results')}
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#091830] to-[#06101f] border border-[#1a3866] hover:border-lime-400 text-left transition-all duration-200 shadow-lg flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-purple-500/30">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
                <span>Resultados & Métricas</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Consulta la matriz acumulada, las 5 métricas oficiales (Accuracy, Precision, Recall, Specificity, F1) y preguntas de reflexión.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#183158] text-[11px] font-mono text-purple-300 font-bold">
              Informe analítico y auditoría
            </div>
          </button>
        </div>
      </div>

      {/* Rules & Scoring Breakdown */}
      <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-lime-400" />
          <span>Reglas del Sistema de Evaluación y Puntuación</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">+10 puntos por acierto</strong>
              Identifica correctamente el cuadrante correspondiente a la predicción y al hecho real.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">+5 puntos de bonificación</strong>
              Premio extra al alcanzar rachas consecutivas de 5 respuestas acertadas.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Target className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Separación estricta</strong>
              Tu puntaje mide tus aciertos como analista. Las métricas del modelo (75% Accuracy, etc.) reflejan la calidad objetiva de la IA.
            </div>
          </div>
        </div>
      </div>

      {/* Academic & Ethical Note */}
      <div className="p-4 rounded-xl bg-[#06101f] border border-[#183158] text-xs text-slate-400 flex items-start gap-3">
        <Siren className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <p>
          <strong>Simulación pedagógica:</strong> Todos los casos son ficticios para el aprendizaje de analítica de datos en posgrados. Ninguna predicción constituye prueba jurídica de culpabilidad penal.
        </p>
      </div>
    </div>
  );
};
