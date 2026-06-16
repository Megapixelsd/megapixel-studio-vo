// ============================================
// MEGAPIXEL STUDIO VO - ÉCRAN DE CONNEXION
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, LogIn, Radio } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLocked } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Fond atmosphérique */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      {/* Grille subtile */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="glass-3d p-12 space-y-10 border border-white/[0.05]">
          
          {/* Logo MEGAPIXEL STUDIO VO */}
          <div className="text-center space-y-5">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-3xl gold-bg flex items-center justify-center shadow-2xl shadow-gold/20"
            >
              <Radio className="w-12 h-12 text-black" />
            </motion.div>
            
            <div>
              <h1 className="text-5xl font-black gold-text tracking-tight leading-none">
                MEGAPIXEL
              </h1>
              <p className="text-lg font-bold text-white/40 tracking-[0.3em] uppercase mt-2">
                STUDIO VO
              </p>
            </div>
            
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <p className="text-white/20 text-[10px] uppercase tracking-[0.4em]">
              Professional Voice Engine
            </p>
          </div>

          {/* Alertes */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-500 text-xs font-bold">Compte temporairement verrouillé</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                Identifiant
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 pl-12 text-white text-sm focus:border-cyan-500/30 focus:outline-none transition-all group-hover:border-white/20"
                  placeholder="admin"
                  dir="ltr"
                  autoComplete="username"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500/50 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                Mot de passe
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 pl-12 text-white text-sm focus:border-cyan-500/30 focus:outline-none transition-all group-hover:border-white/20"
                  placeholder="••••••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                />
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500/50 transition-colors" />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || isLocked}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 rounded-full gold-bg text-black font-black text-lg shadow-2xl shadow-gold/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Accéder au Studio</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer sécurité */}
          <div className="text-center space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-white/20">Session chiffrée • HMAC-SHA256</span>
            </div>
            <p className="text-[8px] text-white/10">
              MEGAPIXEL STUDIO VO v2.6 • Protection contre les modifications non autorisées
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};