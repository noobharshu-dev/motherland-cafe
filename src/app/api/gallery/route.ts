import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sanitizeText } from '@/lib/sanitize';

const galleryImageSchema = z.object({
  imageUrl: z.string().url('imageUrl must be a valid URL'),
  title: z.string().max(200).optional().default(''),
  category: z.string().max(50).optional().default('general'),
  isPublished: z.boolean().optional().default(true),
  displayOrder: z.number().int().min(0).optional().default(0),
});

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(images);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate with Zod
    const parsed = galleryImageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: data.imageUrl,
        title: sanitizeText(data.title ?? ''),
        category: sanitizeText(data.category ?? 'general'),
        isPublished: data.isPublished ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    revalidatePath('/gallery');
    return NextResponse.json(image, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}
