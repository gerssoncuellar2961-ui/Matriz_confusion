/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_DOSSIERS } from '../data/dossiers';
import { calculateMatrix, calculateMetrics } from './metrics';

export function runInternalVerification(): { passed: boolean; report: string[] } {
  const matrix = calculateMatrix(DEFAULT_DOSSIERS);
  const metrics = calculateMetrics(matrix);
  const logs: string[] = [];
  let passed = true;

  function assert(condition: boolean, msg: string) {
    if (!condition) {
      logs.push(`❌ FALLÓ: ${msg}`);
      passed = false;
    } else {
      logs.push(`✅ CORRECTO: ${msg}`);
    }
  }

  assert(matrix.total === 20, `Total casos debe ser 20, obtenido: ${matrix.total}`);
  assert(matrix.vp === 8, `VP debe ser 8, obtenido: ${matrix.vp}`);
  assert(matrix.fn === 2, `FN debe ser 2, obtenido: ${matrix.fn}`);
  assert(matrix.fp === 3, `FP debe ser 3, obtenido: ${matrix.fp}`);
  assert(matrix.vn === 7, `VN debe ser 7, obtenido: ${matrix.vn}`);
  assert(matrix.correct === 15, `Predicciones correctas debe ser 15, obtenido: ${matrix.correct}`);
  assert(matrix.incorrect === 5, `Predicciones incorrectas debe ser 5, obtenido: ${matrix.incorrect}`);

  assert(metrics.accuracy.formatted === '75,00 %', `Accuracy debe ser 75,00 %, obtenido: ${metrics.accuracy.formatted}`);
  assert(metrics.precision.formatted === '72,73 %', `Precision debe ser 72,73 %, obtenido: ${metrics.precision.formatted}`);
  assert(metrics.recall.formatted === '80,00 %', `Recall debe ser 80,00 %, obtenido: ${metrics.recall.formatted}`);
  assert(metrics.specificity.formatted === '70,00 %', `Specificity debe ser 70,00 %, obtenido: ${metrics.specificity.formatted}`);
  assert(metrics.f1.formatted === '76,19 %', `F1 debe ser 76,19 %, obtenido: ${metrics.f1.formatted}`);

  // Test zero denominators
  const emptyMatrix = calculateMatrix([]);
  const emptyMetrics = calculateMetrics(emptyMatrix);
  assert(emptyMetrics.accuracy.formatted === 'N/A', 'Accuracy con 0 casos es N/A');
  assert(emptyMetrics.precision.formatted === 'N/A', 'Precision con 0 casos es N/A');
  assert(emptyMetrics.recall.formatted === 'N/A', 'Recall con 0 casos es N/A');
  assert(emptyMetrics.specificity.formatted === 'N/A', 'Specificity con 0 casos es N/A');
  assert(emptyMetrics.f1.formatted === 'N/A', 'F1 con 0 casos es N/A');

  return { passed, report: logs };
}

// Auto-run if executed directly in node/tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('verifyData')) {
  const result = runInternalVerification();
  console.log(result.report.join('\n'));
  console.log('Validación final:', result.passed ? 'APROBADA' : 'FALLIDA');
}
