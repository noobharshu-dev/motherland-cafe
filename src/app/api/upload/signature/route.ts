import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { uploadLimiter, checkRateLimit } from '@/lib/ratelimit';

export async function POST(request: Request) {
  try {
    // Rate limiting — 10 signature requests per minute per IP
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimitResponse = await checkRateLimit(uploadLimiter, `upload:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json({ error: 'Missing Cloudinary API Secret' }, { status: 500 });
    }

    const folder = 'motherland-cafe';
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
