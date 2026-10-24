/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CaseDossier, Classification, SquadParticipant, SquadRoomState } from '../types/game';
import { squadSync, SquadSyncMessage } from '../utils/squadSync';
import { AvatarPortrait } from './AvatarPortrait';
import {
  Users,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Eye,
  Play,
  RotateCcw,
  Sparkles,
  Smartphone,
  Flame,
  QrCode,
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface SquadModeProps {
  dossiers: CaseDossier[];
  onExit: () => void;
}

export const SquadMode: React.FC<SquadModeProps> = ({ dossiers, onExit }) => {
  const [role, setRole] = useState<'select' | 'host' | 'cadet'>('select');

  // Host state
  const [hostRoom, setHostRoom] = useState<SquadRoomState | null>(null);
  const [instructorName, setInstructorName] = useState('Comandante');
  const [showShareModal, setShowShareModal] = useState(false);

  // Cadet state
  const [joinCode, setJoinCode] = useState('');
  const [cadetName, setCadetName] = useState('');
  const [myParticipantId, setMyParticipantId] = useState('');
  const [currentCadetRoom, setCurrentCadetRoom] = useState<SquadRoomState | null>(null);
  const [myAnswer, setMyAnswer] = useState<Classification | null>(null);

  // Sync listener
  useEffect(() => {
    const unsubscribe = squadSync.subscribe((msg: SquadSyncMessage) => {
      if (msg.type === 'ROOM_UPDATED') {
        if (hostRoom && msg.room.code === hostRoom.code) {
          setHostRoom(msg.room);
        }
        if (currentCadetRoom && msg.room.code === currentCadetRoom.code) {
          setCurrentCadetRoom(msg.room);
          const p = msg.room.participants[myParticipantId];
          const curDossier = dossiers[msg.room.currentCaseIndex];
          if (p && curDossier && p.answers[curDossier.id]) {
            setMyAnswer(p.answers[curDossier.id]);
          } else {
            setMyAnswer(null);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [hostRoom, currentCadetRoom, myParticipantId, dossiers]);

  // Host creates room
  const handleCreateRoom = () => {
    const code = 'SQD' + Math.floor(100 + Math.random() * 900);
    const room = squadSync.createRoom(code, instructorName || 'Comandante');
    setHostRoom(room);
    setRole('host');
  };

  // Cadet joins room
  const handleJoinRoom = () => {
    if (!joinCode || !cadetName) return;
    const { room, participantId } = squadSync.joinRoom(joinCode.trim(), cadetName.trim());
    if (room) {
      setCurrentCadetRoom(room);
      setMyParticipantId(participantId);
      setRole('cadet');
    } else {
      alert('Sala no encontrada. Comprueba el código de acceso proporcionado por el instructor.');
    }
  };

  // Host: add quick simulated cadets for easy class demo
  const handleAddDemoCadets = () => {
    if (!hostRoom) return;
    const mockNames = ['Detective Ortiz', 'Agente Morales', 'Cadete Vega', 'Inspectora Luna'];
    const curDossier = dossiers[hostRoom.currentCaseIndex];

    mockNames.forEach((name) => {
      const { participantId } = squadSync.joinRoom(hostRoom.code, name);
      // Give random simulated answer
      const choices: Classification[] = ['VP', 'FP', 'FN', 'VN'];
      const pick = Math.random() > 0.3 ? curDossier.correctClassification : choices[Math.floor(Math.random() * choices.length)];
      squadSync.submitAnswer(
        hostRoom.code,
        participantId,
        curDossier.id,
        pick,
        pick === curDossier.correctClassification
      );
    });
  };

  // Cadet submits classification
  const handleCadetSubmit = (answer: Classification) => {
    if (!currentCadetRoom || myAnswer) return;
    const curDossier = dossiers[currentCadetRoom.currentCaseIndex];
    const isCorrect = curDossier.correctClassification === answer;
    setMyAnswer(answer);
    squadSync.submitAnswer(
      currentCadetRoom.code,
      myParticipantId,
      curDossier.id,
      answer,
      isCorrect
    );
  };

  // Host controls
  const handleHostNext = () => {
    if (!hostRoom) return;
    const nextIdx = (hostRoom.currentCaseIndex + 1) % dossiers.length;
    squadSync.nextCase(hostRoom.code, nextIdx);
  };

  const handleHostReveal = () => {
    if (!hostRoom) return;
    squadSync.setReveal(hostRoom.code, !hostRoom.isRevealed);
  };

  // Sort participants by points
  const getLeaderboard = (room: SquadRoomState | null): SquadParticipant[] => {
    if (!room) return [];
    return Object.values(room.participants).sort((a, b) => b.points - a.points);
  };

  // Render role selection
  if (role === 'select') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
          {/* Top Battenburg line */}
          <div className="absolute top-0 left-0 right-0 h-2 police-battenburg-sm opacity-90" />

          <div className="w-14 h-14 rounded-2xl bg-[#06101f] border border-lime-400/50 flex items-center justify-center text-lime-400 mx-auto mb-4 mt-2 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Modo Escuadrón: Multijugador Policial en Vivo
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2">
            Compite o colabora en clase sincronizando respuestas en tiempo real mediante un código de sala de patrulla.
          </p>

          {/* Local / Firebase Sync Notice */}
          <div className="my-6 p-4 rounded-xl bg-[#06101f] border border-[#183158] text-xs text-slate-200 text-left max-w-xl mx-auto space-y-1.5">
            <div className="flex items-center gap-2 text-lime-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Sincronización de Patrulla Local Activa (BroadcastChannel & LocalStorage)</span>
            </div>
            <p className="text-slate-400">
              Conexión instantánea entre pestañas y dispositivos en red local. Diseñado para salas de aula y simulaciones universitarias en vivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-6">
            {/* Option Host */}
            <div className="p-5 rounded-xl bg-[#06101f] border border-[#183158] text-left flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base mb-1">Crear Sala (Instructor)</h3>
                <p className="text-xs text-slate-400">
                  Controla la emisión de los 20 casos, proyecta la pantalla y observa las respuestas en vivo.
                </p>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="Tu alias o rango policial"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-[#0a1a33] border border-[#1b3d6e] text-white mb-2 focus:border-lime-400 focus:outline-none"
                />
                <button
                  onClick={handleCreateRoom}
                  className="w-full py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-lime-950/40"
                >
                  Abrir Sala de Misión
                </button>
              </div>
            </div>

            {/* Option Cadet */}
            <div className="p-5 rounded-xl bg-[#06101f] border border-[#183158] text-left flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base mb-1">Unirse a Sala (Cadete)</h3>
                <p className="text-xs text-slate-400">
                  Ingresa con el código de tu profesor/a para enviar tus clasificaciones desde tu dispositivo.
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Código de Sala (ej. SQD740)"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-[#0a1a33] border border-[#1b3d6e] text-white uppercase font-mono tracking-wider focus:border-lime-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={cadetName}
                  onChange={(e) => setCadetName(e.target.value)}
                  placeholder="Tu alias de detective"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-[#0a1a33] border border-[#1b3d6e] text-white focus:border-lime-400 focus:outline-none"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!joinCode || !cadetName}
                  className="w-full py-2.5 px-4 bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-lime-950/40"
                >
                  Entrar al Escuadrón
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Host Screen
  if (role === 'host' && hostRoom) {
    const curDossier = dossiers[hostRoom.currentCaseIndex];
    const leaderboard = getLeaderboard(hostRoom);
    const answersThisCase = leaderboard.filter((p) => p.answers[curDossier.id]);

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Host Header bar with Room Code */}
        <div className="bg-[#09162c] border border-[#1a3866] rounded-2xl p-5 shadow-xl relative overflow-hidden">
          {/* Top Battenburg line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 police-battenburg-sm opacity-90" />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#06101f] border border-lime-400/50 flex items-center justify-center text-lime-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 uppercase tracking-wider font-bold">
                    Código de Sala de Patrulla:
                  </span>
                  <span className="font-mono text-2xl font-black text-lime-400 tracking-widest bg-[#06101f] px-3 py-0.5 rounded-lg border border-lime-500/40 shadow-sm">
                    {hostRoom.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparte este código con los cadetes para unirse a la sala
                </p>
              </div>
            </div>

            {/* Actions for Host */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#06101f] hover:bg-lime-400 hover:text-slate-950 text-lime-400 rounded-lg border border-lime-400/40 cursor-pointer transition-colors shadow-sm"
                title="Mostrar código QR en pantalla grande para que los alumnos escaneen con sus celulares"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Mostrar QR Alumnos</span>
              </button>

              <button
                onClick={handleAddDemoCadets}
                className="px-3 py-1.5 text-xs font-semibold bg-[#06101f] hover:bg-[#0a1a33] text-slate-200 rounded-lg border border-[#183158] cursor-pointer"
                title="Añade cadetes virtuales para probar el flujo de votación"
              >
                + Simular Cadetes
              </button>

              <button
                onClick={handleHostReveal}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  hostRoom.isRevealed
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-emerald-600 text-white border-emerald-500'
                }`}
              >
                {hostRoom.isRevealed ? 'Ocultar Respuesta' : 'Revelar Respuesta a Todos'}
              </button>

              <button
                onClick={handleHostNext}
                className="px-4 py-2 text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 rounded-lg cursor-pointer shadow-md shadow-lime-950/40"
              >
                Siguiente Caso ({hostRoom.currentCaseIndex + 1}/{dossiers.length})
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Current Case vs Connected Cadets & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Current Dossier Presentation */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-mono text-xs font-bold text-cyan-400">
                {curDossier.codeNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Respuestas recibidas: {answersThisCase.length} / {leaderboard.length}
              </span>
            </div>

            <div className="flex gap-4 items-start mb-4">
              <AvatarPortrait
                code={curDossier.codeNumber}
                alias={curDossier.alias}
                archetype={curDossier.avatarSeed.archetype}
                accentColor={curDossier.avatarSeed.accentColor}
                className="w-28 h-36 shrink-0"
              />
              <div>
                <h4 className="font-bold text-white text-base">{curDossier.alias}</h4>
                <p className="text-xs text-slate-400 font-mono">{curDossier.title}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3">{curDossier.scenario}</p>
              </div>
            </div>

            {/* AI Prediction Tag */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Dictamen de la IA:</span>
              <span
                className={`font-mono font-bold text-xs px-2.5 py-1 rounded ${
                  curDossier.aiPrediction === 'POSITIVE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-slate-800 text-cyan-300 border border-slate-700'
                }`}
              >
                {curDossier.aiPrediction === 'POSITIVE' ? 'PREDICE ROBO (+)' : 'PREDICE NO ROBO (−)'}
              </span>
            </div>

            {/* Revealed Answer Box */}
            {hostRoom.isRevealed && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/60 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400">
                    Resultado Real: {curDossier.groundTruth === 'POSITIVE' ? 'SÍ HUBO ROBO' : 'NO HUBO ROBO'}
                  </span>
                  <span className="font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Cuadrante: {curDossier.correctClassification}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{curDossier.explanation}</p>
              </div>
            )}
          </div>

          {/* Right Column: Squad Leaderboard & Submissions */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Tabla de Clasificación del Escuadrón</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {leaderboard.length} cadetes
              </span>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Esperando a que los participantes ingresen con el código{' '}
                <strong className="text-cyan-400">{hostRoom.code}</strong>...
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((cadet, idx) => {
                  const answeredThis = cadet.answers[curDossier.id];
                  return (
                    <div
                      key={cadet.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-500 w-4">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-white block">{cadet.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {cadet.correctCount} aciertos · Racha {cadet.currentStreak}x
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Submission status for current case */}
                        {answeredThis ? (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {hostRoom.isRevealed ? answeredThis : 'Enviado ✓'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono italic">
                            Pensando...
                          </span>
                        )}

                        <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                          {cadet.points} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => setRole('select')}
            className="text-xs text-slate-400 hover:text-white"
          >
            ← Salir de la Sala
          </button>
        </div>

        {/* Big screen QR code modal for projector */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          roomCode={hostRoom.code}
        />
      </div>
    );
  }

  // Render Cadet View (Mobile / Student View)
  if (role === 'cadet' && currentCadetRoom) {
    const curDossier = dossiers[currentCadetRoom.currentCaseIndex];
    const myParticipant = currentCadetRoom.participants[myParticipantId];
    const isHostRevealed = currentCadetRoom.isRevealed;
    const isCorrect = myAnswer === curDossier.correctClassification;

    return (
      <div className="max-w-md mx-auto space-y-4">
        {/* Cadet Status Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Cadete en Operación
            </span>
            <span className="font-bold text-white text-sm">{myParticipant?.name}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Puntaje</span>
              <span className="font-bold text-cyan-300 tabular-nums">
                {myParticipant?.points || 0} pts
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Racha</span>
              <span className="font-bold text-amber-300 tabular-nums">
                {myParticipant?.currentStreak || 0}x
              </span>
            </div>
          </div>
        </div>

        {/* Current Dossier Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-mono font-bold text-cyan-400">{curDossier.codeNumber}</span>
            <span className="text-slate-400 font-mono">
              Caso {currentCadetRoom.currentCaseIndex + 1} de {dossiers.length}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-base">{curDossier.alias}</h3>
            <p className="text-xs text-slate-300 mt-1">{curDossier.scenario}</p>
          </div>

          {/* AI Dictamen */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
              Dictamen de la IA:
            </span>
            <span
              className={`font-mono font-bold text-xs block ${
                curDossier.aiPrediction === 'POSITIVE' ? 'text-rose-400' : 'text-cyan-400'
              }`}
            >
              {curDossier.aiPrediction === 'POSITIVE'
                ? 'PREDICE ROBO (+)'
                : 'PREDICE NO ROBO (−)'}
            </span>
          </div>

          {/* Decision Buttons for Cadet */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Selecciona tu clasificación:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['VP', 'FP', 'FN', 'VN'] as Classification[]).map((opt) => {
                const isSelected = myAnswer === opt;
                let btnStyle = 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-600';
                if (isSelected) {
                  btnStyle = 'border-cyan-500 bg-cyan-950/60 text-cyan-300 ring-2 ring-cyan-500/50';
                }

                return (
                  <button
                    key={opt}
                    disabled={myAnswer !== null}
                    onClick={() => handleCadetSubmit(opt)}
                    className={`p-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <span className="text-sm font-mono block">{opt}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {opt === 'VP' && 'Pred: + | Real: +'}
                      {opt === 'FP' && 'Pred: + | Real: −'}
                      {opt === 'FN' && 'Pred: − | Real: +'}
                      {opt === 'VN' && 'Pred: − | Real: −'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cadet status confirmation */}
          {myAnswer && !isHostRevealed && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-300 text-center animate-pulse">
              Respuesta <strong>{myAnswer}</strong> enviada al instructor. Esperando a que se revele el caso...
            </div>
          )}

          {/* Reveal details when host toggles it */}
          {isHostRevealed && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                  {isCorrect ? '¡Has acertado! (+10 pts)' : 'Has fallado este caso (0 pts)'}
                </span>
                <span className="font-mono text-cyan-400">
                  Cuadrante: {curDossier.correctClassification}
                </span>
              </div>
              <p className="text-xs text-slate-300">{curDossier.explanation}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setRole('select')}
          className="text-xs text-slate-400 hover:text-white block mx-auto pt-2"
        >
          ← Salir del Escuadrón
        </button>
      </div>
    );
  }

  return null;
};
