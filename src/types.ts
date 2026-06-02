export interface Recipe {
  id: string;
  title: string;
  description: string;
  price: number; // in cents
  imageUrl: string;
  category: string;
  contentUrl?: string; // only for owner/admin
  createdAt: any;
  isOnline: boolean; // controls visibility in shop
  authorId?: string; // UID of the creator
  authorEmail?: string;
  isUserGenerated?: boolean;
}

export interface CartItem extends Recipe {
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'admin' | 'creator';
  purchasedRecipeIds: string[];
  stripeAccountId?: string; // for payouts
}

// Guide progress tracking (Phase 2: Completion System)
export type GuideStatus = 'not_started' | 'in_progress' | 'complete';

export interface GuideProgress {
  guideId: string;
  userId: string;
  status: GuideStatus;
  progressPercent: number; // 0-100
  completedAt?: string; // ISO timestamp
  startedAt?: string;
}

// Centralized motion presets (Phase 2: Motion System)
export const MotionPresets = {
  press: { whileTap: { scale: 0.97 }, transition: { type: 'spring' as const, stiffness: 400, damping: 17 } },
  reveal: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  pageTransition: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  sheet: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring' as const, damping: 25, stiffness: 200 } },
  shimmer: { animate: { translateX: '100%' }, transition: { repeat: Infinity, duration: 1.5, ease: 'linear' as const } },
} as const;

export type MotionPreset = keyof typeof MotionPresets;

// Analytics event types (extended for Phase 2)
export type AnalyticsEventName =
  | 'product_viewed'
  | 'add_to_cart'
  | 'checkout_started'
  | 'checkout_completed'
  | 'guide_downloaded'
  | 'guide_progress_updated'
  | 'guide_completed'
  | 'share_artifact_created';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}
