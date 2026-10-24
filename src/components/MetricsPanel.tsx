/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EvaluationMetrics, MatrixCounts } from '../types/game';
import { getAcademicInterpretation } from '../utils/metrics';
import { Target, Zap, Search, ShieldCheck, Scale, HelpCircle } from 'lucide-react';

interface MetricsPanelProps {
  metrics: EvaluationMetrics;
  counts: MatrixCounts;
  compact?: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  counts,
  compact = false,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const interpretations = getAcademicInterpretation(metrics, counts);

  const metricCards = [
    {
      id: 'accuracy',
      label: 'Exactitud',
      abbr: 'Accuracy',
      metric: metrics.accuracy,
      icon: <Target className="w-4 h-4 text-lime-400" />,
      colorClass: 'text-lime-400',
      borderClass: 'border-lime-500/40 bg-lime-950/15',
      description: 'Proporción de todas las predicciones correctas sobre el total.',
      formula: '(VP + VN) / Total',
    },
    {
      id: 'precision',
      label: 'Precisión',
      abbr: 'Precision',
      metric: metrics.precision,
      icon: <Zap className="w-4 h-4 text-lime-300" />,
      colorClass: 'text-lime-300',
      borderClass: 'border-lime-500/30 bg-[#06101f]',
      description: 'Fiabilidad cuando predice ROBO: qué porcentaje realmente fue robo.',
      formula: 'VP / (VP + FP)',
    },
    {
      id: 'recall',
      label: 'Sensibilidad',
      abbr: 'Recall',
      metric: metrics.recall,
      icon: <Search className="w-4 h-4 text-amber-400" />,
      colorClass: 'text-amber-400',
      borderClass: 'border-amber-500/30 bg-[#06101f]',
      description: 'Capacidad de captura: qué porcentaje de los robos reales detectó la IA.',
      formula: 'VP / (VP + FN)',
    },
    {
      id: 'specificity',
      label: 'Especificidad',
      abbr: 'Specificity',
      metric: metrics.specificity,
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      colorClass: 'text-sky-400',
      borderClass: 'border-sky-500/30 bg-[#06101f]',
      description: 'Protección de inocentes: porcentaje de casos de NO ROBO bien descartados.',
      formula: 'VN / (VN + FP)',
    },
    {
      id: 'f1',
      label: 'F1-Score',
      abbr: 'F1 Harmonic',
      metric: metrics.f1,
      icon: <Scale className="w-4 h-4 text-emerald-400" />,
      colorClass: 'text-emerald-300',
      borderClass: 'border-emerald-500/30 bg-[#06101f]',
      description: 'Media armónica entre Precisión y Sensibilidad.',
      formula: '2 × (P × R) / (P + R)',
    },
  ];

  return (
    <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Métricas de Rendimiento del Modelo</span>
            <span className="text-[10px] font-mono font-bold text-lime-400 px-2 py-0.5 rounded bg-[#06101f] border border-lime-500/30">
              AUDITORÍA OFICIAL
            </span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Cálculo oficial en tiempo real a partir de los 4 cuadrantes
          </p>
        </div>
      </div>

      {/* Grid of 5 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {metricCards.map((card) => {
          const isDefined = card.metric.isDefined;
          return (
            <div
              key={card.id}
              className={`p-3.5 rounded-xl border ${card.borderClass} transition-all hover:border-lime-400/60`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  {card.icon}
                  {card.label}
                </span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === card.id ? null : card.id)}
                  className="text-slate-400 hover:text-lime-300 cursor-pointer"
                  title="Ver fórmula y explicación"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metric percentage value */}
              <div className="my-1">
                <div
                  className={`text-2xl font-black font-mono tabular-nums tracking-tight ${
                    isDefined ? card.colorClass : 'text-slate-500 text-lg'
                  }`}
                >
                  {card.metric.formatted}
                </div>
              </div>

              {/* Formula & short caption */}
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {card.formula}
              </div>

              {/* Undefined reason if applicable */}
              {!isDefined && card.metric.undefinedReason && (
                <div className="mt-1 text-[10px] text-amber-400 leading-tight">
                  {card.metric.undefinedReason}
                </div>
              )}

              {/* Active help popup */}
              {activeTooltip === card.id && (
                <div className="mt-2 pt-2 border-t border-[#183158] text-[11px] text-slate-200">
                  <p className="mb-1">{card.description}</p>
                  <span className="text-[10px] text-lime-400 font-mono block">
                    {card.metric.formula}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Academic Interpretation Box */}
      {!compact && (
        <div className="bg-[#06101f] border border-[#183158] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400"></span>
              <span>¿Qué significan estos resultados?</span>
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
            {interpretations.map((text, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-lime-400 font-bold shrink-0">·</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
