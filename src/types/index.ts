// ============================================
// MEGAPIXEL STUDIO VO - TYPES
// ============================================

export type AppMode = 'home' | 'audiobook' | 'podcast' | 'transcript';
export type AudiobookMode = 'none' | 'new' | 'import' | 'script' | 'multi' | 'pilot' | 'production';
export type PodcastSource = 'upload' | 'manual';
export type PodcastDistributionMode = 'smart' | 'manual';
export type TranscriptionStatus = 'idle' | 'transcribing' | 'completed';

// --- AUTHENTIFICATION ---
export type UserRole = 'admin' | 'viewer';
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  username: string;
  role: UserRole;
  token: string;
  expiresAt: number;
  fingerprint: string;
}

// --- VOIX & AUDIO ---
export interface VoiceControls {
  temp: string;
  emotion: string;
  speed: string;
  depth: string;
  pitch: string;
  drama: string;
  purpose: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  voiceType: string;
  category: string;
  categoryKey: string;
  description: string;
  dialectId: string;
}

export interface VoiceFingerprint {
  name: string;
  style: 'رسمي' | 'ودود' | 'حماسي';
  rhythm: 'هادئ' | 'متوسط' | 'نشيط';
  narrative: 'مباشر' | 'قصصي';
  isActive: boolean;
}

// --- PROJETS ---
export interface AudiobookProject {
  id: string;
  name: string;
  dialectId: string;
  status: string;
  createdAt: number;
  lastEdited: number;
  content: string;
  enhancedContent: string;
  segments: NarrationSegment[];
}

export interface NarrationSegment {
  id: number;
  label: string;
  role: string;
  selectedVoice: string;
  content: string;
  pilotAudioUrl?: string;
  finalAudioUrl?: string;
}

// --- PODCAST ---
export interface PodcastTurn {
  speakerId: string;
  text: string;
}

export interface PodcastScriptResult {
  turns: PodcastTurn[];
  speakers: SpeakerProfile[];
  error?: string;
}

export interface SpeakerProfile {
  id: string;
  role: string;
  tone: string;
  style: string;
  gender: 'male' | 'female' | 'any';
  categoryHint: string;
  description: string;
  reasoning: string;
}

export interface SegmentSuggestion {
  role: string;
  label: string;
  text: string;
}

// --- HISTORIQUE ---
export interface HistoryItem {
  id: string;
  voiceName: string;
  dialect: string;
  category: string;
  timestamp: number;
  url: string;
}

export interface GenerationHistory {
  id: string;
  text: string;
  selection: {
    dialect: string;
    type: string;
    field: string;
    controls: VoiceControls;
    fingerprint?: VoiceFingerprint;
  };
  timestamp: number;
  audioBlobUrl: string;
}

// --- UI ---
export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}