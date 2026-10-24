/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Classification, SquadParticipant, SquadRoomState } from '../types/game';

const CHANNEL_NAME = 'operacion_matriz_squad_bus';
const STORAGE_PREFIX = 'op_matriz_room_';

export type SquadSyncMessage =
  | { type: 'ROOM_UPDATED'; room: SquadRoomState }
  | { type: 'PARTICIPANT_JOINED'; roomCode: string; participant: SquadParticipant }
  | { type: 'SUBMIT_ANSWER'; roomCode: string; participantId: string; caseId: string; answer: Classification }
  | { type: 'INSTRUCTOR_NEXT_CASE'; roomCode: string; caseIndex: number }
  | { type: 'INSTRUCTOR_REVEAL'; roomCode: string; isRevealed: boolean }
  | { type: 'ROOM_CLOSED'; roomCode: string };

class SquadSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((msg: SquadSyncMessage) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel unavailable, falling back to storage events', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key?.startsWith(STORAGE_PREFIX) && e.newValue) {
          try {
            const room: SquadRoomState = JSON.parse(e.newValue);
            this.notifyListeners({ type: 'ROOM_UPDATED', room });
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  public subscribe(cb: (msg: SquadSyncMessage) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners(msg: SquadSyncMessage) {
    for (const cb of this.listeners) {
      cb(msg);
    }
  }

  public broadcast(msg: SquadSyncMessage) {
    if (this.channel) {
      this.channel.postMessage(msg);
    }
    // Also dispatch to local listeners in the same window
    this.notifyListeners(msg);
  }

  public saveRoomToStorage(room: SquadRoomState) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}${room.code}`, JSON.stringify(room));
      this.broadcast({ type: 'ROOM_UPDATED', room });
    }
  }

  public getRoomFromStorage(code: string): SquadRoomState | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${code.toUpperCase()}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public createRoom(code: string, instructorName: string): SquadRoomState {
    const room: SquadRoomState = {
      code: code.toUpperCase(),
      instructorName,
      status: 'waiting',
      currentCaseIndex: 0,
      isRevealed: false,
      participants: {},
      lastUpdated: Date.now(),
    };
    this.saveRoomToStorage(room);
    return room;
  }

  public joinRoom(code: string, participantName: string): { room: SquadRoomState | null; participantId: string } {
    const room = this.getRoomFromStorage(code);
    if (!room) return { room: null, participantId: '' };

    const participantId = 'cadet_' + Math.random().toString(36).substring(2, 9);
    const participant: SquadParticipant = {
      id: participantId,
      name: participantName,
      points: 0,
      correctCount: 0,
      incorrectCount: 0,
      currentStreak: 0,
      answers: {},
      joinedAt: Date.now(),
    };

    room.participants[participantId] = participant;
    room.lastUpdated = Date.now();
    this.saveRoomToStorage(room);
    this.broadcast({ type: 'PARTICIPANT_JOINED', roomCode: room.code, participant });

    return { room, participantId };
  }

  public submitAnswer(
    roomCode: string,
    participantId: string,
    caseId: string,
    answer: Classification,
    isCorrect: boolean
  ): SquadRoomState | null {
    const room = this.getRoomFromStorage(roomCode);
    if (!room || !room.participants[participantId]) return null;

    const participant = room.participants[participantId];
    if (participant.answers[caseId]) {
      // Avoid double counting
      return room;
    }

    participant.answers[caseId] = answer;
    if (isCorrect) {
      participant.correctCount += 1;
      participant.currentStreak += 1;
      let pointsEarned = 10;
      if (participant.currentStreak % 5 === 0) {
        pointsEarned += 5; // Streak bonus
      }
      participant.points += pointsEarned;
    } else {
      participant.incorrectCount += 1;
      participant.currentStreak = 0;
    }

    room.lastUpdated = Date.now();
    this.saveRoomToStorage(room);
    this.broadcast({ type: 'SUBMIT_ANSWER', roomCode, participantId, caseId, answer });
    return room;
  }

  public nextCase(roomCode: string, nextIndex: number): SquadRoomState | null {
    const room = this.getRoomFromStorage(roomCode);
    if (!room) return null;

    room.currentCaseIndex = nextIndex;
    room.isRevealed = false;
    room.status = 'active';
    room.lastUpdated = Date.now();
    this.saveRoomToStorage(room);
    this.broadcast({ type: 'INSTRUCTOR_NEXT_CASE', roomCode, caseIndex: nextIndex });
    return room;
  }

  public setReveal(roomCode: string, isRevealed: boolean): SquadRoomState | null {
    const room = this.getRoomFromStorage(roomCode);
    if (!room) return null;

    room.isRevealed = isRevealed;
    room.lastUpdated = Date.now();
    this.saveRoomToStorage(room);
    this.broadcast({ type: 'INSTRUCTOR_REVEAL', roomCode, isRevealed });
    return room;
  }
}

export const squadSync = new SquadSyncService();
