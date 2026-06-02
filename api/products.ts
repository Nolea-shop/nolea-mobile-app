import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { initFirebaseAdmin } from './_firebaseAdmin';
import { applyCors } from './_security';

interface ProductResponse {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  imageUrl: string;
  slug: string;
  isOnline: boolean;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res, ['GET']);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const app = initFirebaseAdmin();
    if (!app) {
      return res.status(500).json({ error: 'Firebase Admin is not configured' });
    }

    const snapshot = await admin
      .firestore(app)
      .collection('recipes')
      .where('isOnline', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const products: ProductResponse[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const title = String(data.title || 'Untitled Guide');
      return {
        id: doc.id,
        title,
        description: String(data.description || ''),
        priceCents: Number(data.price || 0),
        category: String(data.category || 'Digital Guide'),
        imageUrl: String(data.imageUrl || ''),
        slug: slugify(title),
        isOnline: Boolean(data.isOnline),
      };
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Products API failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Could not load products' });
  }
}
