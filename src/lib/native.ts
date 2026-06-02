/**
 * Native Bridge — vereint Capacitor-Plugins und Web-Fallbacks.
 * Wird auf Web wie auch in der nativen App einheitlich aufgerufen.
 */

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share, CanShareResult } from '@capacitor/share';
import { App as CapApp } from '@capacitor/app';

/**
 * Prüft ob die App in einer nativen Capacitor-Umgebung läuft.
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Haptisches Feedback.
 * - Native iOS/Android: Capacitor Haptics (echtes Taptic/Haptic Engine)
 * - Web: navigator.vibrate als Fallback
 */
export const haptics = {
  async impact(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    try {
      if (isNative()) {
        const styleMap = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        };
        await Haptics.impact({ style: styleMap[style] });
        return;
      }
    } catch (e) {
      // Capacitor nicht verfügbar → Fallback
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 25 : 50;
      navigator.vibrate(duration);
    }
  },

  async success(): Promise<void> {
    try {
      if (isNative()) {
        await Haptics.notification({ type: NotificationType.Success });
        return;
      }
    } catch (e) {
      // Fallback
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 50, 20, 50, 40]);
    }
  },

  async error(): Promise<void> {
    try {
      if (isNative()) {
        await Haptics.notification({ type: NotificationType.Error });
        return;
      }
    } catch (e) {
      // Fallback
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([60, 30, 60]);
    }
  },
};

/**
 * Native Share-Sheet Integration.
 * - Native: Öffnet iOS Share-Sheet / Android Intent
 * - Web: navigator.share API, dann Fallback Clipboard
 */
export const shareContent = async (options: {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}): Promise<boolean> => {
  const payload = {
    title: options.title,
    text: options.text,
    url: options.url,
    dialogTitle: options.dialogTitle || options.title,
  };

  // Native path
  if (isNative()) {
    try {
      const can: CanShareResult = await Share.canShare();
      if (can.value) {
        await Share.share(payload);
        return true;
      }
    } catch (e) {
      console.warn('Capacitor Share failed, falling back', e);
    }
  }

  // Web Share API
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share(payload);
      return true;
    } catch (e) {
      // User hat abgebrochen oder Browser unterstützt es nicht
    }
  }

  // Letzter Fallback: Clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      const text = `${payload.text}${payload.url ? ' ' + payload.url : ''}`;
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Clipboard nicht erlaubt
    }
  }

  return false;
};

/**
 * App-Lifecycle: Back-Button Handling für Android.
 */
export const setupAppBackButton = (onBack: () => void): (() => void) => {
  if (!isNative()) return () => {};

  const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      onBack();
    } else {
      window.history.back();
    }
  });

  return () => {
    handler.then((h) => h.remove());
  };
};
