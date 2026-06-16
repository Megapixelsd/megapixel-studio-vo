// ============================================
// MEGAPIXEL STUDIO VO - HOOK D'AUTHENTIFICATION
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/securityService';
import type { AuthSession, AuthStatus, UserRole } from '../types';
import { SECURITY_CONFIG } from '../constants';

const SESSION_KEY = 'megapixel_session';
const CREDS_KEY = 'megapixel_admin_creds';

export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  // Vérifier session au démarrage
  useEffect(() => {
    const checkSession = async () => {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) {
        setAuthStatus('unauthenticated');
        return;
      }
      
      try {
        const parsed: AuthSession = JSON.parse(stored);
        const isValid = await securityService.validateSession(parsed);
        
        if (isValid) {
          setSession(parsed);
          setAuthStatus('authenticated');
        } else {
          localStorage.removeItem(SESSION_KEY);
          setAuthStatus('unauthenticated');
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setAuthStatus('unauthenticated');
      }
    };
    
    checkSession();
  }, []);

  // Auto-logout sur inactivité (30 min)
  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
    };
    
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    resetTimer();
    
    return () => {
      clearTimeout(timeout);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [authStatus]);

  // Créer admin par défaut (premier démarrage)
  const setupDefaultAdmin = async (): Promise<string> => {
    const defaultPass = 'Megapixel2026!Secure';
    const salt = securityService.generateSalt();
    const hash = await securityService.hashPassword(defaultPass, salt);
    
    const creds = {
      username: 'admin',
      role: 'admin' as UserRole,
      salt,
      hash,
      createdAt: Date.now()
    };
    
    localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
    return defaultPass;
  };

  // Connexion
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Vérifier lockout
    if (Date.now() < lockoutUntil) {
      const minutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
      throw new Error(`Compte verrouillé. Réessayez dans ${minutes} minutes.`);
    }
    
    let storedCreds = localStorage.getItem(CREDS_KEY);
    
    // Premier démarrage
    if (!storedCreds) {
      const defaultPass = await setupDefaultAdmin();
      throw new Error(`Premier démarrage ! Mot de passe par défaut: ${defaultPass}. Rafraîchissez la page et reconnectez-vous.`);
    }
    
    const creds = JSON.parse(storedCreds);
    const inputHash = await securityService.hashPassword(password, creds.salt);
    
    if (inputHash !== creds.hash || username !== creds.username) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
        const lockTime = Date.now() + SECURITY_CONFIG.lockoutDuration;
        setLockoutUntil(lockTime);
        setLoginAttempts(0);
        throw new Error('Trop de tentatives. Compte verrouillé 15 minutes.');
      }
      
      throw new Error('Identifiants invalides.');
    }
    
    // Succès - créer session
    setLoginAttempts(0);
    const fingerprint = securityService.generateFingerprint();
    const expiresAt = Date.now() + SECURITY_CONFIG.sessionDuration;
    
    const payload = `${username}:${creds.role}:${expiresAt}:${fingerprint}`;
    const token = await securityService.sign(payload, APP_SECRET);
    
    const newSession: AuthSession = {
      username,
      role: creds.role,
      token,
      expiresAt,
      fingerprint
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    setAuthStatus('authenticated');
    
    return true;
  }, [loginAttempts, lockoutUntil]);

  // Déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setAuthStatus('unauthenticated');
    window.location.reload();
  }, []);

  // Changer mot de passe (admin only)
  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!session || session.role !== 'admin') {
      throw new Error('Non autorisé.');
    }
    
    if (newPassword.length < SECURITY_CONFIG.passwordMinLength) {
      throw new Error(`Mot de passe minimum ${SECURITY_CONFIG.passwordMinLength} caractères.`);
    }
    
    const storedCreds = JSON.parse(localStorage.getItem(CREDS_KEY)!);
    const oldHash = await securityService.hashPassword(oldPassword, storedCreds.salt);
    
    if (oldHash !== storedCreds.hash) {
      throw new Error('Ancien mot de passe incorrect.');
    }
    
    const newSalt = securityService.generateSalt();
    const newHash = await securityService.hashPassword(newPassword, newSalt);
    
    localStorage.setItem(CREDS_KEY, JSON.stringify({
      ...storedCreds,
      salt: newSalt,
      hash: newHash,
      updatedAt: Date.now()
    }));
    
    return true;
  }, [session]);

  return {
    authStatus,
    session,
    login,
    logout,
    changePassword,
    isAdmin: () => session?.role === 'admin',
    isViewer: () => session?.role === 'viewer',
    isLocked: Date.now() < lockoutUntil
  };
};