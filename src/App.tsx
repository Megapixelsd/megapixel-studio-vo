// ============================================
// MEGAPIXEL STUDIO VO - APPLICATION PRINCIPALE
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, LogOut, User, Settings, Radio, 
  Mic, BookOpen, Podcast, FileText, Lock
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/auth/LoginScreen';
import type { AppMode, VoiceControls, VoiceFingerprint } from './types';
import { STUDIO_CONTROLS } from './constants';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function App() {
  const { authStatus, session, logout, isAdmin } = useAuth();
  
  // État de l'application
  const [appMode, setAppMode] = useState<AppMode>('home');
  
  // État des sections (collapse/expand)
  const [sectionControlsOpen, setSectionControlsOpen] = useState(true);
  const [sectionTextOpen, setSectionTextOpen] = useState(true);
  
  // État de la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  
  // Contrôles vocaux
  const [voiceControls, setVoiceControls] = useState<VoiceControls>({
    temp: 'متوازن',
    emotion: 'متوسط',
    speed: 'متوسطة',
    depth: 'متوسطة',
    pitch: 'متوسطة',
    drama: 'متوسط',
    purpose: ''
  });
  
  // Verrouillage vocal (admin only)
  const [isVoiceLocked, setIsVoiceLocked] = useState(false);
  
  // Fingerprint vocal
  const [showFingerprintPanel, setShowFingerprintPanel] = useState(false);
  const [voiceFingerprint, setVoiceFingerprint] = useState<VoiceFingerprint>({
    name: '',
    style: 'رسمي',
    rhythm: 'متوسط',
    narrative: 'مباشر',
    isActive: false
  });
  
  // Texte
  const [inputText, setInputText] = useState('');
  
  // Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // ============================================
  // ÉCRAN DE CHARGEMENT AUTH
  // ============================================
  
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/20 text-xs uppercase tracking-[0.4em] animate-pulse">
            Initializing MEGAPIXEL STUDIO VO...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ÉCRAN DE CONNEXION
  // ============================================
  
  if (authStatus === 'unauthenticated') {
    return <LoginScreen />;
  }

  // ============================================
  // APPLICATION PROTÉGÉE
  // ============================================

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      
      {/* ==========================================
          BADGE DE SESSION (visible partout)
      ========================================== */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200]"
      >
        <div className="px-5 py-2.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-xl flex items-center gap-4 shadow-2xl">
          <div className={`w-2 h-2 rounded-full ${isAdmin() ? 'bg-green-500' : 'bg-cyan-500'} animate-pulse`} />
          
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[11px] font-bold text-white/70">{session?.username}</span>
          </div>
          
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            isAdmin() 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
          }`}>
            {session?.role}
          </div>
          
          <div className="w-px h-4 bg-white/10" />
          
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 text-white/30 hover:text-red-500 transition-colors text-[10px] font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </motion.div>

      {/* ==========================================
          BADGE ADMIN (coin supérieur droit)
      ========================================== */}
      {isAdmin() && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-4 right-4 z-[200]"
        >
          <div className="px-4 py-2 rounded-full bg-green-500/5 border border-green-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Mode Admin</span>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          BADGE VIEWER (si pas admin)
      ========================================== */}
      {!isAdmin() && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-4 right-4 z-[200]"
        >
          <div className="px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Mode Lecture Seule</span>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          CONTENU PRINCIPAL
      ========================================== */}
      <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto space-y-8">

        {/* Header MEGAPIXEL STUDIO VO */}
        <header className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-4">
              <Radio className="w-10 h-10 text-gold" />
              <h1 className="text-5xl md:text-6xl font-black gold-text tracking-tight">
                MEGAPIXEL
              </h1>
            </div>
            <p className="text-xl font-bold text-white/30 tracking-[0.3em] uppercase">
              STUDIO VO
            </p>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]">
              Professional Voice Engine v2.6
            </p>
          </motion.div>
        </header>

        {/* Navigation des studios */}
        <nav className="flex justify-center gap-4 mb-12">
          {[
            { id: 'home' as AppMode, label: 'Studio VO', icon: Mic, desc: 'Synthèse vocale' },
            { id: 'audiobook' as AppMode, label: 'Audiobook', icon: BookOpen, desc: 'Livres audio' },
            { id: 'podcast' as AppMode, label: 'Podcast', icon: Podcast, desc: 'Production podcast' },
            { id: 'transcript' as AppMode, label: 'Transcript', icon: FileText, desc: 'Transcription' },
          ].map((studio) => (
            <button
              key={studio.id}
              onClick={() => setAppMode(studio.id)}
              className={`relative p-6 rounded-3xl border transition-all duration-500 group ${
                appMode === studio.id
                  ? 'bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <studio.icon className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                appMode === studio.id ? 'text-cyan-500' : 'text-white/20 group-hover:text-white/40'
              }`} />
              <p className={`text-sm font-bold ${appMode === studio.id ? 'text-white' : 'text-white/40'}`}>
                {studio.label}
              </p>
              <p className="text-[9px] text-white/20 mt-1">{studio.desc}</p>
              {appMode === studio.id && (
                <motion.div 
                  layoutId="activeStudio"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* ==========================================
            STUDIO VO (mode home)
        ========================================== */}
        {appMode === 'home' && (
          <div className="space-y-8">
            
            {/* Section: Contrôles de sécurité (ADMIN ONLY) */}
            <section className="glass-3d p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white/40 uppercase tracking-widest flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Contrôles de sécurité
                </h2>
                {!isAdmin() && (
                  <span className="text-[10px] text-cyan-500/60 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
                    Lecture seule
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Verrouillage vocal - Admin only */}
                {isAdmin() ? (
                  <button
                    onClick={() => setIsVoiceLocked(!isVoiceLocked)}
                    className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${
                      isVoiceLocked
                        ? 'bg-green-500/10 border-green-500 text-green-500'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-cyan-500/40'
                    }`}
                  >
                    {isVoiceLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Voix verrouillée</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Verrouiller la voix</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/20 text-sm flex items-center gap-3">
                    <Lock className="w-4 h-4" />
                    <span>Verrouillage vocal (Admin)</span>
                  </div>
                )}

                {/* Fingerprint vocal - Admin only */}
                {isAdmin() ? (
                  <button
                    onClick={() => setShowFingerprintPanel(!showFingerprintPanel)}
                    className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${
                      voiceFingerprint.isActive
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-cyan-500/40'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>Bio-métrique vocale</span>
                  </button>
                ) : (
                  <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/20 text-sm flex items-center gap-3">
                    <Lock className="w-4 h-4" />
                    <span>Fingerprint vocal (Admin)</span>
                  </div>
                )}
              </div>

              {/* Panneau fingerprint */}
              <AnimatePresence>
                {showFingerprintPanel && isAdmin() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6">
                      <h3 className="text-sm font-bold gold-text">Configuration biométrique</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {(['رسمي', 'ودود', 'حماسي'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => setVoiceFingerprint(v => ({ ...v, style }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              voiceFingerprint.style === style
                                ? 'bg-cyan-500/10 border-cyan-500 text-white'
                                : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setVoiceFingerprint(v => ({ ...v, isActive: true }));
                          setShowFingerprintPanel(false);
                          setToast({ show: true, message: 'Fingerprint vocal activé', type: 'success' });
                        }}
                        className="w-full py-4 rounded-2xl gold-bg text-black font-bold"
                      >
                        Activer la biométrie
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Contrôles de voix */}
            <section className="glass-3d p-8">
              <button 
                onClick={() => setSectionControlsOpen(!sectionControlsOpen)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h2 className="text-lg font-black text-cyan-500 uppercase tracking-widest">
                  Paramètres vocaux
                </h2>
                <motion.div
                  animate={{ rotate: sectionControlsOpen ? 180 : 0 }}
                  className="text-white/20"
                >
                  ▼
                </motion.div>
              </button>

              <AnimatePresence>
                {sectionControlsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(STUDIO_CONTROLS).map(([key, control]: [string, any]) => (
                        <div key={key} className="space-y-3">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                            {control.title}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {control.options.map((opt: any) => (
                              <button
                                key={opt.label}
                                onClick={() => !isVoiceLocked && setVoiceControls(v => ({ ...v, [key]: opt.label }))}
                                disabled={isVoiceLocked}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  (voiceControls as any)[key] === opt.label
                                    ? 'gold-bg text-black'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                                } ${isVoiceLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Zone de texte */}
            <section className="glass-3d p-8">
              <button 
                onClick={() => setSectionTextOpen(!sectionTextOpen)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h2 className="text-lg font-black text-cyan-500 uppercase tracking-widest">
                  Texte à synthétiser
                </h2>
                <motion.div
                  animate={{ rotate: sectionTextOpen ? 180 : 0 }}
                  className="text-white/20"
                >
                  ▼
                </motion.div>
              </button>

              <AnimatePresence>
                {sectionTextOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Entrez votre texte ici..."
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 text-white placeholder-white/10 focus:border-cyan-500/30 focus:outline-none resize-none"
                      dir="rtl"
                    />
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setIsGenerating(true);
                          setGenerationStatus('Initialisation du moteur...');
                          setGenerationProgress(0);
                          
                          // Simulation de génération
                          let progress = 0;
                          const interval = setInterval(() => {
                            progress += 10;
                            setGenerationProgress(progress);
                            if (progress === 30) setGenerationStatus('Analyse du texte...');
                            if (progress === 60) setGenerationStatus('Synthèse vocale...');
                            if (progress === 90) setGenerationStatus('Finalisation...');
                            
                            if (progress >= 100) {
                              clearInterval(interval);
                              setIsGenerating(false);
                              setGenerationProgress(0);
                              setGenerationStatus('');
                              setToast({ show: true, message: 'Génération terminée !', type: 'success' });
                            }
                          }, 300);
                        }}
                        disabled={isGenerating || !inputText.trim()}
                        className="flex-1 py-5 rounded-full gold-bg text-black font-black text-lg shadow-2xl shadow-gold/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? (
                          <span className="animate-pulse">{generationStatus}</span>
                        ) : (
                          'Générer la voix'
                        )}
                      </button>
                    </div>

                    {/* Barre de progression */}
                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full gold-bg"
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          <span>MEGAPIXEL Engine v2.6</span>
                          <span>{generationProgress}%</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}

        {/* Placeholder pour autres modes */}
        {appMode !== 'home' && (
          <div className="glass-3d p-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-3xl font-black gold-text mb-4">
                {appMode === 'audiobook' && 'Audiobook Studio'}
                {appMode === 'podcast' && 'Podcast Studio'}
                {appMode === 'transcript' && 'Transcript Studio'}
              </h2>
              <p className="text-white/30 mb-8">Mode en développement...</p>
              <button
                onClick={() => setAppMode('home')}
                className="px-8 py-3 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                Retour au Studio VO
              </button>
            </motion.div>
          </div>
        )}

      </div>

      {/* ==========================================
          TOAST NOTIFICATIONS
      ========================================== */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-full bg-black/95 border border-cyan-500/30 shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-sm font-bold text-white/90">{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="ml-3 text-white/30 hover:text-white text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-[10px] text-white/10 uppercase tracking-[0.5em] font-bold">
          © 2026 MEGAPIXEL STUDIO VO — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default App;