// ============================================
// MEGAPIXEL STUDIO VO - SERVICE DE SÉCURITÉ
// ============================================

import type { AuthSession, UserRole } from '../types';

// Clé secrète de l'application (à remplacer par variable d'environnement en production)
const APP_SECRET = import.meta.env.VITE_APP_SECRET || 'MEGAPIXEL_STUDIO_VO_2026_SECURE_KEY';

class SecurityService {
  private static instance: SecurityService;
  
  private constructor() {}
  
  // HMAC-SHA256 signature
  async sign(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', 
      keyData, 
      { name: 'HMAC', hash: 'SHA-256' }, 
      false, 
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }
  
  // Vérification signature (constant-time comparison)
  async verify(data: string, signature: string, secret: string): Promise<boolean> {
    try {
      const expectedSig = await this.sign(data, secret);
      if (signature.length !== expectedSig.length) return false;
      
      let result = 0;
      for (let i = 0; i < signature.length; i++) {
        result |= signature.charCodeAt(i) ^ expectedSig.charCodeAt(i);
      }
      return result === 0;
    } catch {
      return false;
    }
  }
  
  // Hash mot de passe avec salt
  async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt + APP_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }
  
  // Fingerprint navigateur (anti-vol de session)
  generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency?.toString() || 'unknown'
    ];
    return btoa(components.join('|'));
  }
  
  // Valider une session existante
  async validateSession(session: AuthSession): Promise<boolean> {
    // Vérifier expiration
    if (Date.now() > session.expiresAt) return false;
    
    // Vérifier fingerprint (même navigateur)
    const currentFingerprint = this.generateFingerprint();
    if (session.fingerprint !== currentFingerprint) return false;
    
    // Vérifier signature
    const payload = `${session.username}:${session.role}:${session.expiresAt}:${session.fingerprint}`;
    return await this.verify(payload, session.token, APP_SECRET);
  }
  
  // Générer un salt aléatoire
  generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  
  // Singleton
  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }
}

export const securityService = SecurityService.getInstance();