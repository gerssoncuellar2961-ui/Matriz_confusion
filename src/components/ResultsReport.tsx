/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CaseDossier,
  Classification,
  EvaluationMetrics,
  MatrixCounts,
  PlayerScore,
} from '../types/game';
import { ConfusionMatrix } from './ConfusionMatrix';
import { MetricsPanel } from './MetricsPanel';
import {
  Award,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  FileCheck,
} from 'lucide-react';

interface ResultsReportProps {
  dossiers: CaseDossier[];
  evaluatedDossiers: CaseDossier[];
  playerAnswers: Record<string, Classification>;
  matrixCounts: MatrixCounts;
  metrics: EvaluationMetrics;
  playerScore: PlayerScore;
  onRestart: () => void;
  onGoToMenu: () => void;
  onGoToAcademy: () => void;
}

export const ResultsReport: React.FC<ResultsReportProps> = ({
  dossiers,
  evaluatedDossiers,
  playerAnswers,
  matrixCounts,
  metrics,
  playerScore,
  onRestart,
  onGoToMenu,
  onGoToAcademy,
}) => {
  const [expandedReflection, setExpandedReflection] = useState<number | null>(0);
  const [filterQuadrant, setFilterQuadrant] = useState<string>('ALL');

  // Academic reflection questions
  const reflectionQuestions = [
    {
      title: '1. ¿Cuándo conviene priorizar Sensibilidad (Recall) sobre Precisión en seguridad y cuál es su costo?',
      question:
        'Si aumentamos el umbral para no dejar escapar ningún robo (Recall cercano a 100%), ¿qué ocurre con los Falsos Positivos y qué consecuencias prácticas y éticas genera?',
      answer:
        'Priorizar Recall es crítico cuando el costo de omitir un delito (FN) es catastrófico (por ejemplo, robo con armas o terrorismo). No obstante, el costo es una avalancha de Falsos Positivos (FP): ciudadanos y empleados inocentes serán sometidos a interrogatorios, allanamientos y detenciones injustificadas, saturando al equipo policial y erosionando la confianza pública.',
    },
    {
      title: '2. ¿Por qué el Accuracy del 75,00 % puede ser engañoso ante un desbalance de clases?',
      question:
        'En nuestra partida evaluamos 10 casos positivos y 10 casos negativos (balanceados 50/50). ¿Qué pasaría con el Accuracy si en una ciudad el 99% de las personas son inocentes y el modelo predice siempre "NO ROBO"?',
      answer:
        'La "paradoja de la exactitud" (Accuracy Paradox): Si solo el 1% de los casos fuesen robos reales, un modelo "ciego" que siempre predice "NO ROBO" obtendría un 99,00 % de Accuracy, pero su Recall sería del 0,00 %, resultando completamente inútil para la seguridad. Por ello, nunca se debe evaluar un clasificador utilizando únicamente Accuracy.',
    },
    {
      title: '3. ¿Cómo impacta ajustar el umbral de decisión (threshold) del modelo?',
      question:
        'Si el software policial baja su umbral de confianza de 0.50 a 0.20 para generar alarmas con mayor facilidad, ¿hacia qué cuadrantes se desplazan los casos?',
      answer:
        'Bajar el umbral vuelve al modelo más propenso a predecir positivo (+). Esto reduce los Falsos Negativos (aumentando el Recall), pero inevitablemente incrementa los Falsos Positivos (degradando la Precisión y la Especificidad). Mover el umbral es una decisión política, ética y operativa sobre qué tipo de error la institución está dispuesta a tolerar.',
    },
  ];

  // Filter evaluated cases for review
  const filteredCases = evaluatedDossiers.filter((c) => {
    if (filterQuadrant === 'ALL') return true;
    return c.correctClassification === filterQuadrant;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Executive Header Banner */}
      <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Top Battenburg line */}
        <div className="absolute top-0 left-0 right-0 h-2 police-battenburg-sm opacity-90" />

        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#183158] pt-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#06101f] border border-lime-400/50 flex items-center justify-center text-lime-400 shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Informe de Inteligencia: Evaluación Final
              </h2>
              <p className="text-xs text-slate-300">
                Resumen estadístico de la misión y auditoría de la Matriz de Confusión
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#06101f] hover:bg-[#0d2242] text-slate-200 border border-[#183158] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-lime-400" />
              <span>Repetir Misión</span>
            </button>
            <button
              onClick={onGoToMenu}
              className="px-5 py-2 text-xs font-black rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 transition-colors cursor-pointer shadow-md shadow-lime-950/40"
            >
              Menú Principal
            </button>
          </div>
        </div>

        {/* Two Performance Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Pillar 1: Player Performance */}
          <div className="p-5 rounded-xl bg-[#06101f] border border-[#183158]">
            <span className="text-xs font-bold text-lime-400 uppercase tracking-wider block mb-1">
              Desempeño del Estudiante (Quiz)
            </span>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl font-black font-mono text-white tabular-nums">
                {playerScore.points}
              </span>
              <span className="text-xs text-slate-400">puntos acumulados</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Aciertos</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {playerScore.correctCount} / {evaluatedDossiers.length}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Errores</span>
                <span className="font-bold text-rose-400 tabular-nums">
                  {playerScore.incorrectCount}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Mejor Racha</span>
                <span className="font-bold text-amber-400 tabular-nums">
                  {playerScore.maxStreak}x
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              * Mide tu habilidad para catalogar cada situación en VP, FP, FN o VN.
            </p>
          </div>

          {/* Pillar 2: Model Performance */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Rendimiento del Modelo Predictivo (IA)
            </span>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {metrics.accuracy.formatted}
              </span>
              <span className="text-xs text-slate-400">Exactitud global</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Sensibilidad</span>
                <span className="font-bold text-amber-400 tabular-nums">
                  {metrics.recall.formatted}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Precisión</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {metrics.precision.formatted}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">F1-Score</span>
                <span className="font-bold text-indigo-400 tabular-nums">
                  {metrics.f1.formatted}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              * Calculado a partir de las predicciones reales de la IA, independiente de tus respuestas.
            </p>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <section>
        <div className="mb-3">
          <h3 className="text-base font-bold text-white">Matriz de Confusión Resultante</h3>
          <p className="text-xs text-slate-400">
            Distribución oficial de los {matrixCounts.total} expedientes analizados
          </p>
        </div>
        <ConfusionMatrix counts={matrixCounts} />
      </section>

      {/* Metrics Breakdown Section */}
      <section>
        <div className="mb-3">
          <h3 className="text-base font-bold text-white">Detalle de Métricas Estadísticas</h3>
          <p className="text-xs text-slate-400">
            Fórmulas aplicadas y su interpretación analítica
          </p>
        </div>
        <MetricsPanel metrics={metrics} counts={matrixCounts} />
      </section>

      {/* Critical Analysis: Consequences of FP vs FN in Criminal Context */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            Análisis de Impacto Crítico: Falsos Positivos vs. Falsos Negativos
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          En ciencia de datos aplicada a la seguridad, los errores no tienen el mismo costo humano ni económico:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
            <span className="font-bold text-rose-300 block text-sm">
              Costo de los Falsos Positivos ({matrixCounts.fp} casos en la partida)
            </span>
            <p className="text-slate-300">
              Personas inocentes sufren allanamientos, incautaciones y detenciones arbitrarias. Genera daño moral irreparable, demandas al Estado y discriminación sistémica.
            </p>
            <div className="text-[11px] text-rose-400/90 font-mono">
              Solución analítica: Aumentar la Precisión y elevar el umbral de alerta.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
            <span className="font-bold text-amber-300 block text-sm">
              Costo de los Falsos Negativos ({matrixCounts.fn} casos en la partida)
            </span>
            <p className="text-slate-300">
              Delitos reales cometidos que el sistema ignora. Causa pérdidas financieras multimillonarias, sensación de impunidad y riesgo para la integridad pública.
            </p>
            <div className="text-[11px] text-amber-400/90 font-mono">
              Solución analítica: Aumentar la Sensibilidad (Recall) y bajar el umbral de sospecha.
            </div>
          </div>
        </div>
      </section>

      {/* Academic Reflection Questions (For Master's Students) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            Preguntas de Reflexión Académica (Maestría en Analítica)
          </h3>
        </div>

        <div className="space-y-3">
          {reflectionQuestions.map((item, index) => {
            const isExpanded = expandedReflection === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedReflection(isExpanded ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {item.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 text-xs text-slate-300 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
                    <p className="text-slate-400 italic">{item.question}</p>
                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 font-medium leading-relaxed">
                      <strong>Respuesta y fundamentación analítica:</strong> {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Case by Case Audit Log */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-400" />
              <span>Auditoría Caso por Caso ({evaluatedDossiers.length} expedientes)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verifica cómo se clasificó cada expediente en la matriz
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'VP', 'FP', 'FN', 'VN'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterQuadrant(f)}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-colors cursor-pointer ${
                  filterQuadrant === f
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Código</th>
                <th className="p-2.5">Sospechoso</th>
                <th className="p-2.5">Predicción IA</th>
                <th className="p-2.5">Hecho Real</th>
                <th className="p-2.5 text-center">Cuadrante</th>
                <th className="p-2.5 text-center">Tu Respuesta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCases.map((d) => {
                const playerPick = playerAnswers[d.id];
                const isPlayerCorrect = playerPick === d.correctClassification;

                return (
                  <tr key={d.id} className="hover:bg-slate-950/40">
                    <td className="p-2.5 font-bold text-cyan-400">{d.codeNumber}</td>
                    <td className="p-2.5 font-sans font-medium text-white">{d.alias}</td>
                    <td className="p-2.5">
                      <span
                        className={
                          d.aiPrediction === 'POSITIVE' ? 'text-rose-400' : 'text-slate-400'
                        }
                      >
                        {d.aiPrediction === 'POSITIVE' ? 'ROBO (+)' : 'NO ROBO (−)'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={
                          d.groundTruth === 'POSITIVE' ? 'text-rose-400' : 'text-slate-400'
                        }
                      >
                        {d.groundTruth === 'POSITIVE' ? 'ROBO (+)' : 'NO ROBO (−)'}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          d.correctClassification === 'VP'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : d.correctClassification === 'VN'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : d.correctClassification === 'FP'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {d.correctClassification}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      {playerPick ? (
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isPlayerCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPlayerCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {playerPick}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">No respondido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onGoToAcademy}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Repasar conceptos en la Academia</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Partida</span>
          </button>
          <button
            onClick={onGoToMenu}
            className="px-6 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-900/40 transition-colors cursor-pointer"
          >
            Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
};
