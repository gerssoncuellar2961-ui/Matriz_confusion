/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Classification } from '../types/game';

interface AcademyModalProps {
  onClose: () => void;
  onStartMission: () => void;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({
  onClose,
  onStartMission,
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'practice' | 'ethics'>('concepts');

  // Mini practice exercise state
  const practiceQuestions = [
    {
      scenario: 'La IA activó la alarma diciendo "ROBO". Al revisar las cámaras, se comprobó que un gato activó el sensor perimetral y no hubo ningún robo.',
      ai: 'Predijo: ROBO (+)',
      real: 'Real: NO HUBO ROBO (−)',
      correct: 'FP' as Classification,
      explanation: 'Es un Falso Positivo (FP o Error Tipo I): La IA predijo la clase positiva (robo), pero la realidad era negativa (falsa alarma).',
    },
    {
      scenario: 'La IA no detectó anomalías y catalogó el caso como "NO ROBO". Horas después, el banco descubrió que un empleado se llevó 50,000 euros en su maletín.',
      ai: 'Predijo: NO ROBO (−)',
      real: 'Real: SÍ HUBO ROBO (+)',
      correct: 'FN' as Classification,
      explanation: 'Es un Falso Negativo (FN o Error Tipo II): La IA predijo clase negativa (no robo), omitiendo un robo real.',
    },
    {
      scenario: 'La IA identificó a un sospechoso forzando una caja fuerte y emitió alerta de "ROBO". La policía llegó y detuvo al ladrón en flagrancia con el botín.',
      ai: 'Predijo: ROBO (+)',
      real: 'Real: SÍ HUBO ROBO (+)',
      correct: 'VP' as Classification,
      explanation: 'Es un Verdadero Positivo (VP): La IA predijo robo y el robo efectivamente ocurrió.',
    },
  ];

  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState<Classification | null>(null);

  const curQ = practiceQuestions[currentPracticeIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Academia de Inteligencia Predictiva
              </h2>
              <p className="text-xs text-slate-400">
                Fundamentos matemáticos y conceptuales de la Matriz de Confusión
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#06101f] rounded-xl border border-[#183158]">
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'concepts'
                  ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Los 4 Cuadrantes
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Práctica Rápida
            </button>
            <button
              onClick={() => setActiveTab('ethics')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ethics'
                  ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Ética & Ley
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Concepts */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          {/* Definitions Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
              1. Las Clases en Clasificación Binaria
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              En machine learning, una clasificación binaria compara la <strong>Realidad (Ground Truth)</strong> frente a la <strong>Predicción del Modelo</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-1">Clase Positiva (+)</span>
                <p className="text-slate-400">
                  El evento de interés ocurrió: la persona <strong>realmente cometió el robo</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Clase Negativa (−)</span>
                <p className="text-slate-400">
                  El evento no ocurrió: la persona <strong>no cometió el robo</strong> (persona inocente).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-300 block mb-1">Predicción Positiva</span>
                <p className="text-slate-400">
                  La IA emite una alarma y dictamina: <strong>&ldquo;Predice ROBO&rdquo;</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Predicción Negativa</span>
                <p className="text-slate-400">
                  La IA no detecta anomalías y dictamina: <strong>&ldquo;Predice NO ROBO&rdquo;</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* The 4 Quadrants Detailed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VP */}
            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-base">Verdadero Positivo (VP / TP)</h4>
              </div>
              <div className="text-xs font-mono text-emerald-300 mb-2">
                IA: ROBO (+) · Realidad: ROBO (+)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La IA predice robo y el peritaje confirma que sí ocurrió. Es un <strong>acierto positivo</strong>.
                El delincuente fue detectado y los activos protegidos.
              </p>
            </div>

            {/* FN */}
            <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base">Falso Negativo (FN)</h4>
              </div>
              <div className="text-xs font-mono text-amber-300 mb-2">
                IA: NO ROBO (−) · Realidad: ROBO (+)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La IA predice que no hubo robo, pero en realidad sí se perpetró el delito.
                Es un <strong>Error Tipo II (omisión)</strong>. Genera impunidad y pérdidas no advertidas.
              </p>
            </div>

            {/* FP */}
            <div className="bg-rose-950/20 border border-rose-500/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-white text-base">Falso Positivo (FP)</h4>
              </div>
              <div className="text-xs font-mono text-rose-300 mb-2">
                IA: ROBO (+) · Realidad: NO ROBO (−)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La IA predice robo, pero el caso es completamente legal o inocente.
                Es un <strong>Error Tipo I (falsa alarma)</strong>. Vulnerabilidad ética de derechos civiles y costos de investigación innecesarios.
              </p>
            </div>

            {/* VN */}
            <div className="bg-cyan-950/20 border border-cyan-500/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-white text-base">Verdadero Negativo (VN / TN)</h4>
              </div>
              <div className="text-xs font-mono text-cyan-300 mb-2">
                IA: NO ROBO (−) · Realidad: NO ROBO (−)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La IA predice que no hubo robo y los hechos confirman que no hubo anomalía.
                Es un <strong>acierto negativo</strong>. Preserva la presunción de inocencia.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mini Practice */}
      {activeTab === 'practice' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Caso de Entrenamiento {currentPracticeIndex + 1} de {practiceQuestions.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">Modo Interactivo</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-200 leading-relaxed mb-3">{curQ.scenario}</p>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-rose-300">
                {curQ.ai}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                {curQ.real}
              </span>
            </div>
          </div>

          {/* Interactive buttons */}
          <div>
            <div className="text-xs text-slate-400 mb-2 font-medium">
              Identifica el cuadrante correspondiente:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['VP', 'FP', 'FN', 'VN'] as Classification[]).map((cat) => {
                const isSelected = userPracticeAnswer === cat;
                const isCorrect = curQ.correct === cat;

                let btnStyle = 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600';
                if (userPracticeAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-2 ring-emerald-500/60';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-300 line-through';
                  } else {
                    btnStyle = 'border-slate-900 bg-slate-950 text-slate-600 opacity-40';
                  }
                }

                return (
                  <button
                    key={cat}
                    disabled={userPracticeAnswer !== null}
                    onClick={() => setUserPracticeAnswer(cat)}
                    className={`p-3 rounded-xl border font-bold text-xs sm:text-sm text-center transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Feedback */}
          {userPracticeAnswer && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-700">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                {userPracticeAnswer === curQ.correct ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> ¡Excelente! Cuadrante correcto.
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Cuadrante incorrecto.
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">{curQ.explanation}</p>

              <div className="mt-4 flex justify-end">
                {currentPracticeIndex < practiceQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentPracticeIndex(currentPracticeIndex + 1);
                      setUserPracticeAnswer(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg cursor-pointer"
                  >
                    <span>Siguiente Caso de Práctica</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onStartMission}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
                  >
                    <span>¡Listo para la Misión Real!</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Ethics & Legal Disclaimer */}
      {activeTab === 'ethics' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 mb-2">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-base font-bold text-white">
              Aclaración Ética, Jurídica y Metodológica
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Esta aplicación tiene <strong>fines estrictamente educativos y pedagógicos</strong> para cursos universitarios y de posgrado en Analítica de Datos y Machine Learning.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 space-y-2">
            <p>
              • <strong>Sin valor probatorio:</strong> Las predicciones de los modelos de inteligencia artificial no constituyen pruebas de culpabilidad ni determinaciones jurídicas bajo el debido proceso.
            </p>
            <p>
              • <strong>Datos ficticios:</strong> Todos los nombres, alias, casos y escenarios presentados son 100% ficticios. No se utilizan registros ni datos de personas reales.
            </p>
            <p>
              • <strong>Peligro de los Falsos Positivos en Justicia:</strong> Un modelo con alto Recall pero baja Precisión generará múltiples detenciones injustas de personas inocentes, violentando garantías fundamentales.
            </p>
          </div>
        </div>
      )}

      {/* Bottom CTA to start mission */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2"
        >
          Volver al Menú
        </button>
        <button
          onClick={onStartMission}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-black text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-lg shadow-lime-950/50 transition-colors cursor-pointer"
        >
          <span>Iniciar Misión de Expedientes</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
