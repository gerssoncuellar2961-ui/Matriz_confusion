/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseDossier, Classification, EvaluationMetrics, MatrixCounts, MetricValue } from '../types/game';

/**
 * Determines the true classification quadrant based on ground truth and AI prediction.
 */
export function determineClassification(
  groundTruth: 'POSITIVE' | 'NEGATIVE',
  aiPrediction: 'POSITIVE' | 'NEGATIVE'
): Classification {
  if (groundTruth === 'POSITIVE' && aiPrediction === 'POSITIVE') return 'VP';
  if (groundTruth === 'POSITIVE' && aiPrediction === 'NEGATIVE') return 'FN';
  if (groundTruth === 'NEGATIVE' && aiPrediction === 'POSITIVE') return 'FP';
  return 'VN';
}

/**
 * Calculates the 2x2 confusion matrix counts for evaluated cases.
 * The matrix counts reflect strictly the model's performance on the evaluated cases,
 * independent of player quiz answers.
 */
export function calculateMatrix(evaluatedDossiers: CaseDossier[]): MatrixCounts {
  let vp = 0;
  let fn = 0;
  let fp = 0;
  let vn = 0;

  for (const item of evaluatedDossiers) {
    const classification = determineClassification(item.groundTruth, item.aiPrediction);
    if (classification === 'VP') vp++;
    else if (classification === 'FN') fn++;
    else if (classification === 'FP') fp++;
    else if (classification === 'VN') vn++;
  }

  const total = vp + fn + fp + vn;
  const correct = vp + vn;
  const incorrect = fp + fn;

  return { vp, fn, fp, vn, total, correct, incorrect };
}

/**
 * Formats a ratio value (0.00 to 1.00) into a Spanish percentage string with 2 decimals.
 * Example: 0.75 -> "75,00 %"
 */
export function formatPercentage(val: number | null): string {
  if (val === null || isNaN(val) || !isFinite(val)) {
    return 'N/A';
  }
  const pct = val * 100;
  return `${pct.toFixed(2).replace('.', ',')} %`;
}

/**
 * Calculates the five key evaluation metrics from matrix quadrant counts.
 * Explicitly guards against division by zero without NaN or Infinity.
 */
export function calculateMetrics(counts: MatrixCounts): EvaluationMetrics {
  const { vp, fn, fp, vn, total } = counts;

  // 1. Accuracy = (VP + VN) / (VP + VN + FP + FN)
  const accDenom = total;
  const accVal = accDenom > 0 ? (vp + vn) / accDenom : null;
  const accuracy: MetricValue = {
    value: accVal,
    percentage: accVal !== null ? Math.round(accVal * 10000) / 100 : null,
    formatted: formatPercentage(accVal),
    isDefined: accVal !== null,
    undefinedReason: accDenom === 0 ? 'Sin expedientes procesados todavía.' : undefined,
    formula: 'Accuracy = (VP + VN) / Total',
    academicSummary: 'Proporción de todas las predicciones correctas (positivas y negativas) sobre el total de expedientes.',
  };

  // 2. Precision = VP / (VP + FP)
  const precDenom = vp + fp;
  const precVal = precDenom > 0 ? vp / precDenom : null;
  const precision: MetricValue = {
    value: precVal,
    percentage: precVal !== null ? Math.round(precVal * 10000) / 100 : null,
    formatted: formatPercentage(precVal),
    isDefined: precVal !== null,
    undefinedReason: precDenom === 0 ? 'Sin predicciones de ROBO emitidas por la IA (VP + FP = 0).' : undefined,
    formula: 'Precision = VP / (VP + FP)',
    academicSummary: 'De todos los casos que la IA predijo como ROBO, qué porcentaje realmente cometió el delito.',
  };

  // 3. Recall / Sensibilidad = VP / (VP + FN)
  const recDenom = vp + fn;
  const recVal = recDenom > 0 ? vp / recDenom : null;
  const recall: MetricValue = {
    value: recVal,
    percentage: recVal !== null ? Math.round(recVal * 10000) / 100 : null,
    formatted: formatPercentage(recVal),
    isDefined: recVal !== null,
    undefinedReason: recDenom === 0 ? 'Sin casos reales de ROBO en la muestra evaluada (VP + FN = 0).' : undefined,
    formula: 'Recall = VP / (VP + FN)',
    academicSummary: 'De todas las personas que verdaderamente cometieron un robo, cuántas logró detectar la IA.',
  };

  // 4. Specificity / Especificidad = VN / (VN + FP)
  const specDenom = vn + fp;
  const specVal = specDenom > 0 ? vn / specDenom : null;
  const specificity: MetricValue = {
    value: specVal,
    percentage: specVal !== null ? Math.round(specVal * 10000) / 100 : null,
    formatted: formatPercentage(specVal),
    isDefined: specVal !== null,
    undefinedReason: specDenom === 0 ? 'Sin casos reales de NO ROBO en la muestra evaluada (VN + FP = 0).' : undefined,
    formula: 'Specificity = VN / (VN + FP)',
    academicSummary: 'De todas las personas inocentes (no robo), qué proporción fue catalogada correctamente.',
  };

  // 5. F1-score = 2 * (Precision * Recall) / (Precision + Recall)
  // Direct equivalent: 2 * VP / (2 * VP + FP + FN)
  const f1Denom = 2 * vp + fp + fn;
  const f1Val = f1Denom > 0 ? (2 * vp) / f1Denom : null;
  const f1: MetricValue = {
    value: f1Val,
    percentage: f1Val !== null ? Math.round(f1Val * 10000) / 100 : null,
    formatted: formatPercentage(f1Val),
    isDefined: f1Val !== null,
    undefinedReason: f1Denom === 0 ? 'Tanto VP como FP y FN son cero (sin actividad positiva relevante).' : undefined,
    formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
    academicSummary: 'Media armónica entre precisión y exhaustividad; penaliza desbalances extremos.',
  };

  return { accuracy, precision, recall, specificity, f1 };
}

/**
 * Generates pedagogical interpretations of the current metrics.
 */
export function getAcademicInterpretation(metrics: EvaluationMetrics, counts: MatrixCounts): string[] {
  if (counts.total === 0) {
    return ['Inicia la investigación de expedientes para generar las métricas de rendimiento del modelo.'];
  }

  const notes: string[] = [];

  // General performance
  if (metrics.accuracy.isDefined) {
    notes.push(
      `El modelo tiene una Exactitud global del ${metrics.accuracy.formatted} (${counts.correct} aciertos de ${counts.total} casos).`
    );
  }

  // Recall vs Precision trade-off in policing context
  if (metrics.recall.isDefined && metrics.precision.isDefined) {
    const rec = (metrics.recall.value || 0) * 100;
    const prec = (metrics.precision.value || 0) * 100;

    if (rec > prec) {
      notes.push(
        `Alta Sensibilidad (${metrics.recall.formatted}): Detecta al 80 % de los culpables (8 de 10), pero a costa de Falsos Positivos (${counts.fp} inocentes investigados indebidamente).`
      );
    } else if (prec > rec) {
      notes.push(
        `Alta Precisión (${metrics.precision.formatted}): Cuando la IA acusa, rara vez se equivoca, pero a costa de Falsos Negativos (${counts.fn} ladrones no detectados).`
      );
    } else {
      notes.push(
        `Equilibrio entre Precisión y Sensibilidad (${metrics.precision.formatted}): Distribución simétrica de errores.`
      );
    }
  }

  // Ethical & Legal warning
  if (counts.fp > 0 || counts.fn > 0) {
    notes.push(
      `Impacto operativo: Los ${counts.fp} Falsos Positivos vulneran derechos civiles de personas inocentes. Los ${counts.fn} Falsos Negativos representan pérdidas no recuperadas e impunidad delictiva.`
    );
  }

  return notes;
}
