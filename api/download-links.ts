import { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, extractPdfFilename, isValidStripeSessionId } from './_security';
import { checkRateLimit } from './_rateLimit';

/**
 * Returns download links for a given Stripe session ID.
 * Only accessible after successful payment validation against Stripe.
 * Links expire after 48 hours.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res, ['GET']);

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const rateLimitKey = `rl:${ip}:download-links`;
  if (!checkRateLimit(req, rateLimitKey, 5, 60000)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const sessionId = req.query.session_id as string;
  if (!sessionId) return res.status(400).json({ error: 'session_id is required' });
  if (!isValidStripeSessionId(sessionId)) return res.status(400).json({ error: 'Invalid session_id' });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' as any });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if ((session as any).payment_status !== 'paid') {
      return res.status(403).json({ error: 'Payment not completed' });
    }

    const expirySeconds = 48 * 60 * 60;
    const sessionCreated = typeof (session as any).created === 'number' ? (session as any).created : 0;
    if (!sessionCreated || Date.now() / 1000 - sessionCreated > expirySeconds) {
      return res.status(403).json({ error: 'Download window expired' });
    }

    const contentUrls = (session as any).metadata?.contentUrls || '';
    const filenames = contentUrls.split(',').map((f: string) => f.trim()).filter(Boolean);

    const downloadLinks = filenames
      .map((raw: string) => extractPdfFilename(raw))
      .filter(Boolean)
      .map((filename: string) => ({
        title: filename.replace('.pdf', ''),
        url: `/api/download?session_id=${encodeURIComponent(sessionId)}&product=${encodeURIComponent(filename)}`,
        expiresAt: new Date((sessionCreated + expirySeconds) * 1000).toISOString(),
      }));

    return res.status(200).json({
      success: true,
      orderId: sessionId,
      downloadLinks,
    });
  } catch (error: any) {
    console.error('Download link lookup failed:', error?.message || error);
    return res.status(404).json({ error: 'Session not found' });
  }
}
