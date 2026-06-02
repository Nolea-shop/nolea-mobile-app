import type { VercelRequest } from '@vercel/node';

// Simple in-memory rate limiter for Vercel serverless functions.
// Note: In a distributed serverless environment, this resets per instance.
// For production at scale, consider Upstash Redis or similar.

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > 5 * 60 * 1000) {
    const keysToDelete: string[] = [];
    store.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => store.delete(key));
    lastCleanup = now;
  }
}

export function checkRateLimit(
  req: VercelRequest,
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanup();

  const now = Date.now();
  const key = `rl:${identifier}`;
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    const resetTime = now + windowMs;
    store.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export function applyRateLimit(
  req: VercelRequest,
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean } {
  const result = checkRateLimit(req, identifier, limit, windowMs);

  if (!result.allowed) {
    return { allowed: false };
  }

  return { allowed: true };
}

// Convenience wrapper for inline use in handlers
// Returns true if allowed, false if rate limited (sends 429 response)
export function rateLimit(
  req: VercelRequest,
  res: any,
  identifier: string,
  limit: number,
  windowSeconds: number
): boolean {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.toString().split(',')[0].trim() : (req.socket.remoteAddress || 'unknown');
  const key = `${ip}:${identifier}`;
  const result = checkRateLimit(req, key, limit, windowSeconds * 1000);
  if (!result.allowed) {
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }
  return true;
}
