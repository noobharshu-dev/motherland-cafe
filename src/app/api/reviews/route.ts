import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { submissionLimiter, checkRateLimit } from '@/lib/ratelimit';
import { sanitizeText } from '@/lib/sanitize';

const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters').max(2000),
  source: z.string().max(50).optional().default('Website'),
});

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting — 20 submissions per minute per IP
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimitResponse = await checkRateLimit(submissionLimiter, `review:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate with Zod
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Sanitize text fields before writing to DB
    const data = parsed.data;
    const review = await prisma.review.create({
      data: {
        name: sanitizeText(data.name),
        rating: data.rating,
        reviewText: sanitizeText(data.reviewText),
        source: sanitizeText(data.source ?? 'Website'),
        status: 'pending',
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
